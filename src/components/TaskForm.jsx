import { useState } from "react";

function TaskForm({ onAgregar }) {
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [anticipacion, setAnticipacion] = useState("15");

  const handleAgregarTarea = () => {
    if (nuevaTarea.trim() !== "") {
      onAgregar({
        id: Date.now(),
        texto: nuevaTarea,
        completada: false,
        descripcion: nuevaDescripcion,
        fecha: fecha,
        anticipacion: Number(anticipacion),
      });

      setNuevaTarea("");
      setNuevaDescripcion("");
      setFecha("");
      setAnticipacion("15");
    }
  };

  return (
    <form className="contenedor-botonAgregar" onSubmit={(e) => { e.preventDefault(); handleAgregarTarea(); }}>
      <div className="encabezado-formulario">
        <div>
          <p className="eyebrow">Nueva tarea</p>
          <h2>¿Qué quieres lograr?</h2>
        </div>
        <span aria-hidden="true">＋</span>
      </div>
      <input
        type="text"
        value={nuevaTarea}
        onChange={(e) => setNuevaTarea(e.target.value)}
        placeholder="Escribe el título de tu tarea"
        aria-label="Título de la tarea"
        required
      />
      <input
        type="text"
        value={nuevaDescripcion}
        onChange={(e) => setNuevaDescripcion(e.target.value)}
        placeholder="Descripción (opcional)"
      />
      <input
        type="datetime-local"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />
      <select
        value={anticipacion}
        onChange={(e) => setAnticipacion(e.target.value)}
      >
        <option value="15">Avisar 15 min antes</option>
        <option value="30">Avisar 30 min antes</option>
        <option value="60">Avisar 1 hora antes</option>
        <option value="1440">Avisar 1 día antes</option>
      </select>
      <button type="submit"><span aria-hidden="true">＋</span> Agregar tarea</button>
    </form>
  );
}

export default TaskForm;
