import { useState } from "react";

function TaskForm({ onAgregar }) {
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [fecha, setFecha] = useState("");

  const handleAgregarTarea = () => {
    if (nuevaTarea.trim() !== "") {
      onAgregar({
        id: Date.now(),
        texto: nuevaTarea,
        completada: false,
        descripcion: nuevaDescripcion,
        fecha: fecha,
      });

      setNuevaTarea("");
      setNuevaDescripcion("");
      setFecha("");
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
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />
      <button onClick={handleAgregarTarea}>Agregar Tarea</button>
    </div>
  );
}

export default TaskForm;
