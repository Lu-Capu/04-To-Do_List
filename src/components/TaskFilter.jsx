function TaskFilter({ setFiltro, onLimpiar }) {
  return (
    <>
      <div className="contenedor-Filtro">
        <button className="Filtro-Toda" onClick={() => setFiltro("todas")}>
          Todas
        </button>
        <button
          className="Filtro-Pendiente"
          onClick={() => setFiltro("pendientes")}
        >
          Pendientes
        </button>
        <button
          className="Filtro-Completada"
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
