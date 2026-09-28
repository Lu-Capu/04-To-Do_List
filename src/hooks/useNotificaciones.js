import { useCallback, useEffect, useRef, useState } from "react";

const LIMITE_SETTIMEOUT = 2147483647;
const CLAVE_AVISOS = "avisos_enviados";
const MAX_AVISOS = 200;
const MAX_REGISTRO = 12;

const soportadas = () =>
  typeof window !== "undefined" && "Notification" in window;

const contextoSeguro = () =>
  typeof window !== "undefined" && window.isSecureContext !== false;

const leerAvisos = () => {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_AVISOS) || "{}");
    return datos && typeof datos === "object" ? datos : {};
  } catch {
    return {};
  }
};

const guardarAvisos = (avisos) => {
  try {
    const claves = Object.keys(avisos);
    const recortado = {};
    for (const clave of claves.slice(-MAX_AVISOS)) {
      recortado[clave] = avisos[clave];
    }
    localStorage.setItem(CLAVE_AVISOS, JSON.stringify(recortado));
  } catch {
    // almacenamiento no disponible
  }
};

const obtenerRegistroSW = async () => {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const existente = await navigator.serviceWorker.getRegistration();
    if (existente) return existente;
    return await navigator.serviceWorker.register("/sw.js");
  } catch {
    return null;
  }
};

const formatearMargen = (minutos) => {
  if (minutos >= 1440) return `Vence en ${Math.round(minutos / 1440)} día(s).`;
  if (minutos >= 60) return `Vence en ${Math.round(minutos / 60)} hora(s).`;
  return `Vence en ${minutos} minuto(s).`;
};

const agendar = (timeouts, id, restante, alDisparar) => {
  const paso = Math.min(restante, LIMITE_SETTIMEOUT);
  const temporizador = setTimeout(() => {
    delete timeouts.current[id];
    const restanteRestante = restante - paso;
    if (restanteRestante > 0) {
      agendar(timeouts, id, restanteRestante, alDisparar);
    } else {
      alDisparar();
    }
  }, paso);
  timeouts.current[id] = temporizador;
};

export function useNotificaciones(tareas) {
  const timeouts = useRef({});
  const enviados = useRef(leerAvisos());
  const haySoporte = soportadas();
  const esSeguro = contextoSeguro();

  const [permiso, setPermiso] = useState(() =>
    haySoporte ? Notification.permission : "unsupported",
  );
  const [agenda, setAgenda] = useState([]);
  const [registro, setRegistro] = useState([]);
  const [ultimoFallo, setUltimoFallo] = useState(null);
  const [swActivo, setSwActivo] = useState(null);

  const permisoRef = useRef(permiso);
  const tareasRef = useRef(tareas);

  useEffect(() => {
    permisoRef.current = permiso;
    tareasRef.current = tareas;
  }, [permiso, tareas]);

  const anotar = useCallback((titulo, cuerpo, ok, detalle) => {
    setRegistro((prev) =>
      [
        {
          clave: `${Date.now()}-${Math.random()}`,
          titulo,
          cuerpo,
          ok,
          detalle,
          hora: new Date().toLocaleTimeString("es-PE"),
        },
        ...prev,
      ].slice(0, MAX_REGISTRO),
    );
    setUltimoFallo(ok ? null : { titulo, detalle });
  }, []);

  const enviar = useCallback(
    async (titulo, cuerpo, etiqueta) => {
      if (!haySoporte) {
        return { ok: false, detalle: "El navegador no soporta notificaciones" };
      }
      if (Notification.permission !== "granted") {
        return {
          ok: false,
          detalle: `Permiso actual = "${Notification.permission}"`,
        };
      }

      const opciones = {
        body: cuerpo,
        icon: "/logo-negro.png",
        tag: etiqueta,
      };

      const registroSW = await obtenerRegistroSW();
      setSwActivo(!!registroSW);

      let falloSW = null;
      if (registroSW) {
        try {
          await registroSW.showNotification(titulo, opciones);
          return { ok: true, detalle: "Mostrada con el service worker" };
        } catch (error) {
          falloSW = error;
        }
      }

      try {
        new Notification(titulo, opciones);
        return { ok: true, detalle: "Mostrada con new Notification()" };
      } catch (error) {
        const previo = falloSW
          ? ` (con service worker: ${falloSW.message})`
          : "";
        return {
          ok: false,
          detalle: `new Notification() falló: ${error.message}${previo}`,
        };
      }
    },
    [haySoporte],
  );

  const cancelar = useCallback((id) => {
    const temporizador = timeouts.current[id];
    if (temporizador) {
      clearTimeout(temporizador);
      delete timeouts.current[id];
      setAgenda((prev) => prev.filter((a) => a.id !== id));
    }
  }, []);

  const avisar = useCallback(
    async (tarea, objetivo, vencido) => {
      const id = String(tarea.id);
      if (enviados.current[id] === objetivo) return;
      enviados.current[id] = objetivo;
      guardarAvisos(enviados.current);

      const titulo = vencido
        ? `Tarea vencida: ${tarea.texto}`
        : `¡Tarea próxima a vencer: ${tarea.texto}`;
      const cuerpo = vencido
        ? "Su fecha límite ya pasó. Márcala como completada si ya la hiciste."
        : formatearMargen(Number(tarea.anticipacion) || 15);

      setAgenda((prev) => prev.filter((a) => a.id !== id));
      const r = await enviar(titulo, cuerpo, `tarea-${id}`);
      anotar(titulo, cuerpo, r.ok, r.detalle);
    },
    [anotar, enviar],
  );

  const programar = useCallback(
    (tarea) => {
      const id = String(tarea.id);
      cancelar(id);

      if (!tarea.fecha || tarea.completada) return;
      const limite = new Date(tarea.fecha).getTime();
      if (Number.isNaN(limite)) return;

      const minutosAntes = Number(tarea.anticipacion) || 15;
      const objetivo = limite - minutosAntes * 60000;
      const restante = objetivo - Date.now();

      if (restante <= 0) {
        void avisar(tarea, objetivo, true);
        return;
      }

      setAgenda((prev) => [
        ...prev.filter((a) => a.id !== id),
        {
          id,
          texto: tarea.texto,
          restante,
          cuando: new Date(objetivo).toLocaleString("es-PE"),
        },
      ]);
      agendar(timeouts, id, restante, () => avisar(tarea, objetivo, false));
    },
    [avisar, cancelar],
  );

  useEffect(() => {
    if (permiso !== "granted") return;

    Object.values(timeouts.current).forEach(clearTimeout);
    timeouts.current = {};
    tareas.forEach((t) => programar(t));

    return () => {
      Object.values(timeouts.current).forEach(clearTimeout);
      timeouts.current = {};
      setAgenda([]);
    };
  }, [tareas, permiso, programar]);

  useEffect(() => {
    const alVolver = () => {
      if (document.visibilityState !== "visible") return;
      if (permisoRef.current !== "granted") return;
      tareasRef.current.forEach((t) => programar(t));
    };
    document.addEventListener("visibilitychange", alVolver);
    return () => document.removeEventListener("visibilitychange", alVolver);
  }, [programar]);

  const solicitarPermiso = useCallback(async () => {
    if (!haySoporte) {
      setPermiso("unsupported");
      return "unsupported";
    }
    let resultado = Notification.permission;
    if (resultado === "default") {
      try {
        resultado = await Notification.requestPermission();
      } catch {
        resultado = Notification.permission;
      }
    }
    setPermiso(resultado);
    return resultado;
  }, [haySoporte]);

  const notificar = useCallback(
    async (titulo, cuerpo, etiqueta = "manual") => {
      const r = await enviar(titulo, cuerpo, etiqueta);
      anotar(titulo, cuerpo, r.ok, r.detalle);
      return r.ok;
    },
    [anotar, enviar],
  );

  return {
    permiso,
    soportadas: haySoporte,
    contextoSeguro: esSeguro,
    motivoBloqueo: !haySoporte
      ? "unsupported"
      : !esSeguro
        ? "insecure"
        : permiso === "denied"
          ? "denied"
          : null,
    solicitarPermiso,
    notificar,
    cancelar,
    agenda,
    registro,
    ultimoFallo,
    swActivo,
  };
}
