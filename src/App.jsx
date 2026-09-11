import { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskFilter from "./components/TaskFilter";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [tareas, setTareas] = useState(() => {
    const guardadas = localStorage.getItem("mis_tareas");
    return guardadas ? JSON.parse(guardadas) : [];
  });

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
          icon: "/pwa-192x192.png",
        });
      }
    }
  };
  const enviarNotificacion = (titulo, descripcion) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(titulo, {
        body: descripcion || "Tienes una tarea pendiente.",
        icon: "/pwa-192x192.png",
      });
    }
  };
  const programarRecordatorio = (tarea) => {
    if (!tarea.fecha || tarea.completada) return;

    const tiempoLimite = new Date(tarea.fecha).getTime();
    const tiempoActual = new Date().getTime();

    // Notificar 15 minutos antes (15m * 60s * 1000ms)
    const margenAnticipacion = 15 * 60 * 1000;
    const tiempoEspera = tiempoLimite - margenAnticipacion - tiempoActual;

    if (tiempoEspera > 0) {
      setTimeout(() => {
        enviarNotificacion(
          `!!Tarea próxima a vencer: ${tarea.texto}`,
          "Vence en 15 minutos.",
        );
      }, tiempoEspera);
    }
  };

  // 4. Reprogramar recordatorios existentes al cargar o abrir la app
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      tareas.forEach((t) => programarRecordatorio(t));
    }
  }, []);
  // 5. Manejar creación de tarea + temporizador
  const handleAgregarTarea = (objetoTarea) => {
    setTareas((prev) => [...prev, objetoTarea]);
    programarRecordatorio(objetoTarea);
  };

  const [filtro, setFiltro] = useState("todas");

  const handleAlternarCompletada = (id) => {
    setTareas(
      tareas.map((t) =>
        t.id === id ? { ...t, completada: !t.completada } : t,
      ),
    );
  };

  const handleEliminarTarea = (id) => {
    setTareas(tareas.filter((t) => t.id !== id));
  };

  const handleEditarTarea = (id, texto, descripcion, fecha) => {
    setTareas(
      tareas.map((t) => {
        if (t.id === id) {
          const tareaActualizada = { ...t, texto, descripcion, fecha };
          programarRecordatorio(tareaActualizada);
          return tareaActualizada;
        }
        return t;
      }),
    );
  };

  const handleLimpiar = () => {
    setTareas(tareas.filter((t) => !t.completada));
  };

  const pendientes = tareas.filter((t) => !t.completada).length;

  const tareasFiltradas = tareas.filter((t) => {
    if (filtro === "pendientes") return !t.completada;
    if (filtro === "completadas") return t.completada;
    return true;
  });

  return (
    <div className="App">
      <h1>Lista de Tareas</h1>
      <p>Pendientes: {pendientes}</p>
      <button
        onClick={solicitarPermisoNotificaciones}
        style={{ marginBottom: "15px", cursor: "pointer" }}
      >
        Activar Recordatorios
      </button>
      <TaskFilter setFiltro={setFiltro} onLimpiar={handleLimpiar} />
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
