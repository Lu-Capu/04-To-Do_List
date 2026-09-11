function TaskFilter({ filtro, setFiltro, onLimpiar }) {
  return (
    <>
      <div className="contenedor-Filtro">
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
      <button className="boton-Filtrar" onClick={onLimpiar}>
        Limpiar completadas
      </button>
    </>
  );
}

export default TaskFilter;
