import TaskItem from "./TaskItem";

function TaskList({ tareas, onAlternar, onEliminar, onEditar }) {
  return (
    <ul>
      {tareas.map((tarea) => (
        <TaskItem
          key={tarea.id}
          tarea={tarea}
          onAlternar={onAlternar}
          onEliminar={onEliminar}
          onEditar={onEditar}
        />
      ))}
    </ul>
  );
}

export default TaskList;
