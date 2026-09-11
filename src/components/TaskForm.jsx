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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAgregarTarea();
    }
  };

  return (
    <div className="contenedor-botonAgregar">
      <input
        type="text"
        value={nuevaTarea}
        onChange={(e) => setNuevaTarea(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nueva tarea"
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
      <button onClick={handleAgregarTarea}>Agregar Tarea</button>
    </div>
  );
}

export default TaskForm;
