# Lista de Tareas · React PWA

Gestor de tareas instalable como aplicación (PWA), construido con React 19 y
Vite. Persistencia en `localStorage`, filtros, búsqueda, edición en línea y
**notificaciones del navegador** que avisan antes de que venza cada tarea.

![Portada](assets/portada.png)
<!-- 👆 Reemplaza esta línea por tu captura. -->

## 🛠️ Tecnologías

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-vite--plugin--pwa-5A0FC8?style=for-the-badge)

## ✨ Características

- **CRUD completo:** agregar, editar en línea, marcar como completada y eliminar
- **Persistencia en `localStorage`:** las tareas sobreviven a recargar o cerrar
  la pestaña, sin backend
- **Recordatorios con Notifications API:** cada tarea con fecha dispara un
  aviso 15 min, 30 min, 1 hora o 1 día antes de vencer
- **Aviso de tarea vencida:** si la fecha límite ya pasó, notifica en vez de
  programar un temporizador imposible
- **PWA instalable:** `vite-plugin-pwa` + Workbox con `autoUpdate`, manifiesto
  propio e iconos 192/512, así se puede añadir a la pantalla de inicio
- **Filtros** (todas / pendientes / completadas) y **búsqueda** por título y
  descripción
- **Barra de progreso** calculada sobre el total de tareas
- **Limpiar completadas** en un clic, con contador
- **Panel de diagnóstico** integrado: permiso actual, contexto seguro, estado
  del service worker, avisos agendados e historial de envíos
- **Mensajes de ayuda contextuales** según por qué fallan las notificaciones
  (contexto inseguro, permiso denegado o navegador sin soporte)

## 🚀 Instalación y uso

```bash
git clone https://github.com/Lu-Capu/react-todo-pwa.git
cd react-todo-pwa
npm install
npm run dev
```

Abre `http://localhost:5173`.

> ⚠️ Las notificaciones del navegador **solo funcionan en contexto seguro**:
> `https://` o `http://localhost`. Si abres la app por la IP de red
> (`http://192.168.x.x:5173`), el botón dirá "Abrir en localhost".

### Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Compila a `dist/` |
| `npm run preview` | Sirve `dist/` para probar el build |
| `npm run lint` | ESLint sobre todo el proyecto |

## 📁 Estructura

```
src/
├── main.jsx                  # Punto de entrada
├── App.jsx                   # Estado global, búsqueda, filtros y progreso
├── App.css
├── index.css
├── components/
│   ├── TaskForm.jsx          # Alta de tareas (título, fecha, anticipación)
│   ├── TaskList.jsx          # Render de la lista
│   ├── TaskItem.jsx          # Vista + modo edición de cada tarea
│   └── TaskFilter.jsx        # Filtros y "limpiar completadas"
└── hooks/
    └── useNotificaciones.js  # Lógica de permisos, agenda y envío
public/                      # logo-negro.png e iconos del manifiesto
```

## 📸 Capturas

| Vista | Imagen |
|---|---|
| Vista principal | `assets/portada.png` |
| Editando tarea | `assets/edicion.png` |
| Panel de diagnóstico | `assets/diagnostico.png` |
| Instalada como PWA | `assets/pwa.png` |

## 🔗 Demo en vivo

[▶ Ver demo](https://lu-capu.github.io/react-todo-pwa/) · [💻 Ver código](https://github.com/Lu-Capu/react-todo-pwa)

## 📚 Qué aprendí

- **Estrategia doble para notificar:** primero `registration.showNotification()`
  y, si falla, `new Notification()` como respaldo. Reporta el motivo exacto en
  lugar de tragarse el error en silencio
- **`setTimeout` tiene un techo de 2³¹−1 ms (~24.8 días).** Cualquier alarma
  más larga se agenda por trozos: cada tramo, al dispararse, se reprograma por
  el resto (`useNotificaciones.js:53`)
- **`visibilitychange` para reprogramar:** las alarmas de `setTimeout` mueren si
  la pestaña queda en segundo plano o el equipo se suspende, así que al volver a
  la pestaña se recalcula la agenda desde cero
- **Deduplicación persistente:** un registro en `localStorage` con el
  `id + timestamp` objetivo evita repetir el mismo aviso al recargar, y se
  recorta a los últimos 200 para que no crezca sin límite
- **React Compiler** vía `@rolldown/plugin-babel` con `reactCompilerPreset()`
- **`useCallback` en los handlers** para que el efecto que reprogama las
  alarmas no se dispare en cada render
- **Estado derivado, no duplicado:** búsqueda y filtro se calculan sobre el
  mismo array de tareas; `localStorage` se escribe con un `useEffect` que
  depende de `tareas`
- **Diagnóstico integrado en la UI:** en problemas de permisos es casi imposible
  depurar a ciegas, así que la app expone permiso, contexto seguro, estado del
  service worker y los últimos envíos con su resultado

## 📄 Licencia

[MIT](LICENSE)