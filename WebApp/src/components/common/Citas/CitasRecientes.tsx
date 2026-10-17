import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../../api/axiosConfig";
import { useNotify } from "../../Context/NotifyContext";
import type { CitaApiResponse } from "../../../types";

const formatearFecha = (fecha: string) => {
    const d = dayjs(fecha);
    // Cambiamos 'HH' por 'hh' y añadimos 'A' al final
    return d.isValid() ? d.format("DD/MM/YYYY · hh:mm A") : "—";
};

const obtenerIniciales = (nombre?: string) =>
    (nombre ?? "?")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((palabra) => palabra[0].toUpperCase())
        .join("");

// true si "ahora" está entre el inicio y el fin de la cita
const estaEnCurso = (cita: CitaApiResponse, ahora: dayjs.Dayjs) => {
    const inicio = dayjs(cita.fechaInicio);
    const fin = dayjs(cita.fechaFin);
    if (!inicio.isValid() || !fin.isValid()) return false;
    return !ahora.isBefore(inicio) && ahora.isBefore(fin);
};

export default function CitasRecientes() {
    const { error } = useNotify();
    const [citas, setCitas] = useState<CitaApiResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [ahora, setAhora] = useState(() => dayjs());

    // Actualiza la hora del dispositivo cada 30 segundos
    useEffect(() => {
        const intervalo = setInterval(() => setAhora(dayjs()), 30_000);
        return () => clearInterval(intervalo);
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        const cargarRecientes = async () => {
            try {
                const response = await api.get("/Citas/Recientes", {
                    signal: controller.signal,
                });
                setCitas(response.data.data as CitaApiResponse[]);
            } catch (err) {
                if (controller.signal.aborted) return;
                error({ titulo: "Ocurrió un error al cargar las citas recientes" });
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        };

        cargarRecientes();
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Citas recientes</h2>
                <NavLink
                    to="/citas"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                    Ver todo
                </NavLink>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                {isLoading ? (
                    <ul className="divide-y divide-slate-100" aria-busy="true">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <li key={i} className="flex items-center gap-4 p-4">
                                <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
                                <div className="space-y-2">
                                    <div className="h-3 w-40 animate-pulse rounded bg-slate-100" />
                                    <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : citas.length === 0 ? (
                    <p className="p-8 text-center text-sm text-slate-500">
                        No hay citas recientes.
                    </p>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {citas.map((cita) => {
                            const enCurso = estaEnCurso(cita, ahora);

                            return (
                                <li
                                    key={cita.id}
                                    className={`flex items-center justify-between gap-4 p-4 transition-colors ${
                                        enCurso
                                            ? "border-l-4 border-l-emerald-500 bg-emerald-50"
                                            : "border-l-4 border-l-transparent"
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                                                enCurso
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-cyan-100 text-cyan-700"
                                            }`}
                                        >
                                            {obtenerIniciales(cita.pacienteNombre)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                {cita.pacienteNombre}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {formatearFecha(cita.fechaInicio)}
                                            </p>
                                        </div>
                                    </div>

                                    {enCurso && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                            <span className="relative flex h-2 w-2">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                            </span>
                                            En curso
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </section>
    );
}