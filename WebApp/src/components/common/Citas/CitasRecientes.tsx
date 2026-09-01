import { ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import api from "../../../api/axiosConfig";
import { useNotify } from "../../Context/NotifyContext";
import { useEffect, useState } from "react";
import type { CitaApiResponse } from "../../../types";
import dayjs from 'dayjs';

dayjs.locale('es');

export default function CitasRecientes() {
    const { error } = useNotify();
    const [citas, setCitas] = useState<CitaApiResponse[]>([]);
    const fecha = new Date();

    const cargarRecientes = async () => {
        try {

            const response = await api.get('/Citas/Recientes');
            const data = response.data.data as CitaApiResponse[];

            const citasT = data.map((cita) => {
                return {
                    ...cita,
                    fechaInicioDate: dayjs(cita.fechaInicio).isValid() ? dayjs(cita.fechaInicio).toDate() : new Date()
                };
            });

            setCitas(citasT);

        } catch (err) {
            error({ titulo: "Ocurrio error al cargar recientes" });
        }
    };

    useEffect(() => {
        cargarRecientes();
    }, [])

    return (
        <>
            {/* Columna Derecha: Actividad Reciente */}
            <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-800">Citas Reciente {dayjs(fecha).format('DD/MM/YYYY')}</h2>
                    <NavLink className="text-sm font-semibold text-blue-600 hover:text-blue-700" to='/citas'> Ver todo</NavLink>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <ul className="divide-y divide-slate-100">
                        {/* Lista */}
                        {citas.map((cita) => (
                            <li key={cita.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">{cita.id}</div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{cita.pacienteNombre}</p>
                                        <p className="text-sm text-slate-500">{cita.tipoCitaNombre} • {dayjs(cita.fechaInicioDate).format('DD/MM/YYYY')}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </>
    );

};