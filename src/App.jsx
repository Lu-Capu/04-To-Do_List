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

  const [filtro, setFiltro] = useState("todas");

  const handleAgregarTarea = (objetoTarea) => {
    setTareas([...tareas, objetoTarea]);
  };

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
      tareas.map((t) =>
        t.id === id ? { ...t, texto, descripcion, fecha } : t,
      ),
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
