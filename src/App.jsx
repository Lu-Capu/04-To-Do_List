import { useState, useEffect, useCallback } from "react";
import TaskForm from "./components/TaskForm";
import TaskFilter from "./components/TaskFilter";
import TaskList from "./components/TaskList";
import { useNotificaciones } from "./hooks/useNotificaciones";
import "./App.css";

function App() {
  const [tareas, setTareas] = useState(() => {
    const guardadas = localStorage.getItem("mis_tareas");
    return guardadas ? JSON.parse(guardadas) : [];
  });

  const [busqueda, setBusqueda] = useState("");
  useEffect(() => {
    localStorage.setItem("mis_tareas", JSON.stringify(tareas));
  }, [tareas]);

  const {
    permiso,
    soportadas,
    contextoSeguro,
    motivoBloqueo,
    solicitarPermiso,
    notificar,
    agenda,
    registro,
    ultimoFallo,
    swActivo,
  } = useNotificaciones(tareas);

  const bloqueado = motivoBloqueo !== null;
  const [ayudaVisible, setAyudaVisible] = useState(false);
  const [diagVisible, setDiagVisible] = useState(false);

  const handleActivarNotificaciones = async () => {
    if (bloqueado) {
      setAyudaVisible((v) => !v);
      return;
    }
    const resultado = await solicitarPermiso();
    if (resultado === "granted") {
      setAyudaVisible(false);
      void notificar(
        "¡Notificaciones activadas!",
        "Te avisaremos antes de que venzan tus tareas.",
        "confirmacion-permisos",
      );
    }
  };

  const handleProbar = () => {
    void notificar(
      "Notificaciones funcionando",
      "Si ves esto, los avisos de vencimiento llegarán correctamente.",
      "prueba-manual",
    );
  };

  const textoBoton = !soportadas
    ? "Notificaciones no soportadas"
    : !contextoSeguro
      ? "Abrir en localhost"
      : permiso === "granted"
        ? "Notificaciones activadas"
        : permiso === "denied"
          ? "Notificaciones bloqueadas"
          : "Activar Recordatorios";

  const AYUDA = {
    insecure:
      "Las notificaciones sólo funcionan en contextos seguros. Estás entrando por la IP de red; abre la app en http://localhost:5173.",
    denied:
      "Tu navegador tiene las notificaciones bloqueadas para este sitio y ya no vuelve a preguntar. Para reactivarlas: pulsa el candado o el icono de ajustes junto a la barra de direcciones → Permisos → Notificaciones → Permitir, y luego recarga la página.",
    unsupported:
      "Este navegador no soporta la API de notificaciones. Prueba con Chrome, Edge o Firefox de escritorio.",
  };

  const [filtro, setFiltro] = useState("todas");

  const handleAgregarTarea = useCallback((objetoTarea) => {
    setTareas((prev) => [...prev, objetoTarea]);
  }, []);

  const handleAlternarCompletada = useCallback((id) => {
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t)),
    );
  }, []);

  const handleEliminarTarea = useCallback((id) => {
    setTareas((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleEditarTarea = useCallback((id, texto, descripcion, fecha, anticipacion) => {
    setTareas((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, texto, descripcion, fecha, anticipacion } : t,
      ),
    );
  }, []);

  const handleLimpiar = useCallback(() => {
    setTareas((prev) => prev.filter((t) => !t.completada));
  }, []);

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
      <div className="barra-notificaciones">
        <button
          className="boton-notificaciones"
          onClick={handleActivarNotificaciones}
          aria-expanded={bloqueado ? ayudaVisible : undefined}
        >
          {textoBoton}
        </button>
        {permiso === "granted" && (
          <button
            className="boton-notificaciones secondary"
            onClick={handleProbar}
          >
            Probar
          </button>
        )}
        <button
          className="boton-notificaciones secondary"
          onClick={() => setDiagVisible((v) => !v)}
          aria-expanded={diagVisible}
        >
          Diagnóstico
        </button>
      </div>
      {bloqueado && ayudaVisible && (
        <p className="aviso-notificaciones">{AYUDA[motivoBloqueo]}</p>
      )}
      {ultimoFallo && (
        <p className="aviso-notificaciones error">
          <strong>No se pudo mostrar:</strong> {ultimoFallo.detalle}
        </p>
      )}
      {diagVisible && (
        <div className="panel-diagnostico">
          <dl>
            <dt>Permiso</dt>
            <dd>{permiso}</dd>
            <dt>Contexto seguro</dt>
            <dd>{contextoSeguro ? "sí" : "no"}</dd>
            <dt>Service worker</dt>
            <dd>
              {swActivo === null
                ? "sin comprobar"
                : swActivo
                  ? "registrado"
                  : "no disponible (se usa new Notification)"}
            </dd>
            <dt>Avisos programados</dt>
            <dd>{agenda.length}</dd>
          </dl>
          {agenda.length > 0 && (
            <ul>
              {agenda.map((a) => (
                <li key={a.id}>
                  {a.texto} → {a.cuando}
                </li>
              ))}
            </ul>
          )}
          <h4>Últimos envíos</h4>
          {registro.length === 0 ? (
            <p>Ninguno todavía.</p>
          ) : (
            <ul>
              {registro.map((r) => (
                <li key={r.clave} className={r.ok ? "ok" : "fallo"}>
                  {r.hora} · {r.titulo} · {r.detalle}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
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
