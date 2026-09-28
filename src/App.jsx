import { useState, useEffect, useCallback, useRef } from "react";
import TaskForm from "./components/TaskForm";
import TaskFilter from "./components/TaskFilter";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [tareas, setTareas] = useState(() => {
    const guardadas = localStorage.getItem("mis_tareas");
    return guardadas ? JSON.parse(guardadas) : [];
  });

  const timeoutsRef = useRef({});
  const [busqueda, setBusqueda] = useState("");
  useEffect(() => {
    localStorage.setItem("mis_tareas", JSON.stringify(tareas));
  }, [tareas]);

  const solicitarPermisoNotificaciones = async () => {
    if (!("Notification" in window)) {
      alert("Este navegador no soporta notificaciones.");
      return;
    }
    if (Notification.permission === "default") {
      const permiso = await Notification.requestPermission();
      if (permiso === "granted") {
        new Notification("¡Notificaciones activadas!", {
          body: "Te avisaremos antes de que venzan tus tareas.",
          icon: "/logo-negro.png",
        });
      }
    }
  };

  const enviarNotificacion = (titulo, descripcion) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(titulo, {
        body: descripcion || "Tienes una tarea pendiente.",
        icon: "/logo-negro.png",
      });
    }
  };

  const limpiarTimeout = useCallback((id) => {
    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id]);
      delete timeoutsRef.current[id];
    }
  }, []);

  const programarRecordatorio = (tarea) => {
    if (!tarea.fecha || tarea.completada) return;

    const tiempoLimite = new Date(tarea.fecha).getTime();
    const tiempoActual = new Date().getTime();

    const minutosAntes = tarea.anticipacion || 15;
    const margenAnticipacion = minutosAntes * 60 * 1000;
    const tiempoEspera = tiempoLimite - margenAnticipacion - tiempoActual;

    if (tiempoEspera > 0) {
      const textoAviso =
        minutosAntes >= 1440
          ? `Vence en ${minutosAntes / 1440} día(s).`
          : minutosAntes >= 60
            ? `Vence en ${minutosAntes / 60} hora(s).`
            : `Vence en ${minutosAntes} minutos.`;

      setTimeout(() => {
        enviarNotificacion(
          `¡Tarea próxima a vencer: ${tarea.texto}`,
          textoAviso,
        );
      }, tiempoEspera);
    }
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      tareas.forEach((t) => programarRecordatorio(t));
    }

    return () => {
      Object.values(timeoutsRef.current).forEach(clearTimeout);
      timeoutsRef.current = {};
    };
  }, [tareas, programarRecordatorio]);

  const handleAgregarTarea = useCallback(
    (objetoTarea) => {
      setTareas((prev) => [...prev, objetoTarea]);
      programarRecordatorio(objetoTarea);
    },
    [programarRecordatorio],
  );

  const [filtro, setFiltro] = useState("todas");

  const handleAlternarCompletada = useCallback((id) => {
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t)),
    );
  }, []);

  const handleEliminarTarea = useCallback(
    (id) => {
      limpiarTimeout(id);
      setTareas((prev) => prev.filter((t) => t.id !== id));
    },
    [limpiarTimeout],
  );
  const handleEditarTarea = (id, texto, descripcion, fecha, anticipacion) => {
    setTareas(
      tareas.map((t) => {
        if (t.id === id) {
          const tareaActualizada = {
            ...t,
            texto,
            descripcion,
            fecha,
            anticipacion,
          };
          programarRecordatorio(tareaActualizada);
          return tareaActualizada;
        }
        return t;
      }),
    );
  };

  const handleLimpiar = useCallback(() => {
    setTareas((prev) => {
      const eliminadas = prev.filter((t) => t.completada);
      eliminadas.forEach((t) => limpiarTimeout(t.id));
      return prev.filter((t) => !t.completada);
    });
  }, [limpiarTimeout]);

  const pendientes = tareas.filter((t) => !t.completada).length;

  const tareasFiltradas = tareas.filter((t) => {
    const coincideTexto =
      t.texto.toLowerCase().includes(busqueda.toLowerCase()) ||
      (t.descripcion &&
        t.descripcion.toLowerCase().includes(busqueda.toLowerCase()));
    if (!coincideTexto) return false;
    if (filtro === "pendientes") return !t.completada;
    if (filtro === "completadas") return t.completada;
    return true;
  });

  return (
    <div className="App">
      <h1>Lista de Tareas</h1>
      <p>Pendientes: {pendientes}</p>
      <div className="barra-progreso">
        <div
          className="barra-progreso-fill"
          style={{
            width: `${tareas.length ? ((tareas.length - pendientes) / tareas.length) * 100 : 0}%`,
          }}
        />
      </div>
      <button
        className="boton-notificaciones"
        onClick={solicitarPermisoNotificaciones}
      >
        Activar Recordatorios
      </button>
      <input
        className="busqueda"
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar tarea..."
      />
      <TaskFilter
        filtro={filtro}
        setFiltro={setFiltro}
        onLimpiar={handleLimpiar}
      />
      <TaskList
        tareas={tareasFiltradas}
        onAlternar={handleAlternarCompletada}
        onEliminar={handleEliminarTarea}
        onEditar={handleEditarTarea}
      />
      <TaskForm onAgregar={handleAgregarTarea} />
    </div>
  );
}

export default App;
