import { useState } from "react";

function TaskItem({ tarea, onAlternar, onEliminar, onEditar }) {
  const [editando, setEditando] = useState(false);
  const [textoEdit, setTextoEdit] = useState(tarea.texto);
  const [descEdit, setDescEdit] = useState(tarea.descripcion || "");
  const [fechaEdit, setFechaEdit] = useState(tarea.fecha || "");
  const [anticipacionEdit, setAnticipacionEdit] = useState(
    tarea.anticipacion || 15,
  );

  const handleGuardar = () => {
    if (textoEdit.trim() !== "") {
      onEditar(
        tarea.id,
        textoEdit,
        descEdit,
        fechaEdit,
        Number(anticipacionEdit),
      );
      setEditando(false);
    }
  };

  const handleCancelar = () => {
    setTextoEdit(tarea.texto);
    setDescEdit(tarea.descripcion || "");
    setFechaEdit(tarea.fecha || "");
    setAnticipacionEdit(tarea.anticipacion || 15);
    setEditando(false);
  };

  if (editando) {
    return (
      <li className="item-tarea-editando">
        <p className="eyebrow">Editando tarea</p>
        <input
          type="text"
          value={textoEdit}
          onChange={(e) => setTextoEdit(e.target.value)}
          placeholder="Título"
          aria-label="Título de la tarea"
        />
        <input
          type="text"
          value={descEdit}
          onChange={(e) => setDescEdit(e.target.value)}
          placeholder="Descripción"
          aria-label="Descripción de la tarea"
        />
        <input
          type="datetime-local"
          value={fechaEdit}
          onChange={(e) => setFechaEdit(e.target.value)}
        />
        <select
          value={anticipacionEdit}
          onChange={(e) => setAnticipacionEdit(e.target.value)}
        >
          <option value="15">Avisar 15 min antes</option>
          <option value="30">Avisar 30 min antes</option>
          <option value="60">Avisar 1 hora antes</option>
          <option value="1440">Avisar 1 día antes</option>
        </select>
        <div>
          <button onClick={handleGuardar} type="button">Guardar cambios</button>
          <button onClick={handleCancelar} type="button">Cancelar</button>
        </div>
      </li>
    );
  }

  return (
    <li>
      <div className="item-tarea" onClick={() => onAlternar(tarea.id)} role="button" tabIndex="0" onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onAlternar(tarea.id); }}>
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
          {tarea.fecha && (
            <p className="fecha-tarea">
              {new Date(tarea.fecha).toLocaleString("es-PE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      </div>
      <div className="acciones-tarea">
        <button onClick={(e) => { e.stopPropagation(); setEditando(true); }} aria-label={`Editar ${tarea.texto}`} type="button">✎</button>
        <button onClick={(e) => { e.stopPropagation(); onEliminar(tarea.id); }} aria-label={`Eliminar ${tarea.texto}`} type="button">×</button>
      </div>
    </li>
  );
}

export default TaskItem;
