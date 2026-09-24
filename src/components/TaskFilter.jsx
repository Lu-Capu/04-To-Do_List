function TaskFilter({ filtro, setFiltro, onLimpiar, completadas }) {
  return (
    <>
      <div className="contenedor-Filtro" role="group" aria-label="Filtrar tareas">
        <button
          className={filtro === "todas" ? "activo" : ""}
          onClick={() => setFiltro("todas")}
        >
          Todas
        </button>
        <button
          className={filtro === "pendientes" ? "activo" : ""}
          onClick={() => setFiltro("pendientes")}
        >
          Pendientes
        </button>
        <button
          className={filtro === "completadas" ? "activo" : ""}
          onClick={() => setFiltro("completadas")}
        >
          Completadas
        </button>
      </div>
      <button className="boton-Filtrar" onClick={onLimpiar} disabled={!completadas} type="button">
        Limpiar completadas {completadas > 0 && <span>({completadas})</span>}
      </button>
    </>
  );
}

export default TaskFilter;
