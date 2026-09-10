import { useState } from "react";

function TaskItem({ tarea, onAlternar, onEliminar, onEditar }) {
  const [editando, setEditando] = useState(false);
  const [textoEdit, setTextoEdit] = useState(tarea.texto);
  const [descEdit, setDescEdit] = useState(tarea.descripcion || "");
  const [fechaEdit, setFechaEdit] = useState(tarea.fecha || "");

  const handleGuardar = () => {
    if (textoEdit.trim() !== "") {
      onEditar(tarea.id, textoEdit, descEdit, fechaEdit);
      setEditando(false);
    }
  };

  // Restaurar estados originales al cancelar
  const handleCancelar = () => {
    setTextoEdit(tarea.texto);
    setDescEdit(tarea.descripcion || "");
    setFechaEdit(tarea.fecha || "");
    setEditando(false);
  };

  if (editando) {
    return (
      <li className="item-tarea-editando">
        <input
          type="text"
          value={textoEdit}
          onChange={(e) => setTextoEdit(e.target.value)}
          placeholder="Título"
        />
        <input
          type="text"
          value={descEdit}
          onChange={(e) => setDescEdit(e.target.value)}
          placeholder="Descripción"
        />
        <input
          type="date"
          value={fechaEdit}
          onChange={(e) => setFechaEdit(e.target.value)}
        />
        <button onClick={handleGuardar}>Guardar</button>
        <button onClick={handleCancelar}>Cancelar</button>
      </li>
    );
  }

  return (
    <li>
      <div className="item-tarea" onClick={() => onAlternar(tarea.id)}>
        <span className={`check ${tarea.completada ? "marcado" : ""}`}>
          {tarea.completada && "✓"}
        </span>
        <div className="contenido-tarea">
          <span className={`texto ${tarea.completada ? "completada" : ""}`}>
            {tarea.texto}
          </span>
          {tarea.descripcion && (
            <p className="descripcion-tarea">{tarea.descripcion}</p>
          )}
          {tarea.fecha && <p className="fecha-tarea">{tarea.fecha}</p>}
        </div>
      </div>
      <button onClick={() => setEditando(true)}>✎</button>
      <button onClick={() => onEliminar(tarea.id)}>X</button>
    </li>
  );
}

export default TaskItem;
