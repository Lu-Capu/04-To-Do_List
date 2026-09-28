# Lista de tareas

Aplicación web responsive para organizar tareas diarias desde una interfaz clara y enfocada. Las tareas se guardan en el navegador, por lo que permanecen disponibles al volver a abrir la aplicación en el mismo dispositivo.

## Funcionalidades

- Crear tareas con título, descripción opcional, fecha y hora.
- Configurar un recordatorio con notificaciones del navegador.
- Marcar tareas como completadas y consultar el progreso.
- Filtrar entre todas, pendientes y completadas.
- Buscar por título o descripción.
- Editar o eliminar tareas y limpiar las completadas.
- Diseño responsive con controles accesibles y soporte para reducir animaciones.

## Tecnologías

- [React](https://react.dev/) 19
- [Vite](https://vite.dev/)
- JavaScript (ES modules)
- CSS nativo
- `localStorage` y Notifications API del navegador

## Instalación y uso

Necesitas Node.js instalado. Desde la raíz del proyecto:

```bash
npm install
npm run dev
```

Abre la dirección local que muestre Vite (normalmente `http://localhost:5173`). Para generar una versión de producción:

```bash
npm run build
npm run preview
```

También puedes ejecutar las validaciones disponibles:

```bash
npm run lint
```

## Notificaciones

El botón **Activar recordatorios** solicita permiso al navegador. Las notificaciones se programan mientras la aplicación permanece abierta; el navegador puede limitar recordatorios cuando la pestaña o el dispositivo están suspendidos.

## Vista previa

La interfaz utiliza un panel oscuro con acentos verdes, barra de progreso, filtros segmentados, búsqueda y un formulario de creación integrado. No se incluyen capturas para evitar representar una vista distinta a la versión que se esté ejecutando.
