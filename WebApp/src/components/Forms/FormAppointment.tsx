import { useState } from "react";
import TipoCitaComboBox from "../CombosBox/TipoCitaComboBox";
import PacienteComboBox from "../CombosBox/PacienteComboBox";
import type { Cita } from "../../types/index.ts";

interface FormAppointmentProps {
  OnSuccess: (id: number, bEdicion: boolean) => void;
  idPaciente?: number;
}
const initialCita: Cita = {
    fecha: '',
    hora: '',
    id: 0,
    idPaciente: 0,
    tipoCitaId: 0,
    observaciones: ''
};



export default function FormAppointment(_props: FormAppointmentProps) {
    // Estado para controlar el paso actual (1 = Formulario, 2 = Resumen)
    const [paso, setPaso] = useState<1 | 2>(1);

    // Estados para los campos del formulario
    const [tipoCitaNombre, setTipoCitaNombre] = useState<string>('—');
    const [Cita, setCita] = useState<Cita | null>(initialCita);
    const [pacienteNombre, setPacienteNombre] = useState<string>('');

    const handleCambioTipoCita = (id: number, nombre: string) => {
        setCita((prev) => prev ? { ...prev, tipoCitaId: id } : null);
        setTipoCitaNombre(nombre);
    };

    const handleCambioPaciente = (id: number) => {
        setCita((prev) => prev ? { ...prev, idPaciente: id } : null);
    };

    // Funciones de navegación
    const irAlResumen = () => {
        // Aquí podrías agregar validaciones antes de avanzar
        if (!Cita?.idPaciente || !Cita.tipoCitaId || !Cita.fecha || !Cita.hora) {
            return alert("Por favor, completa todos los campos obligatorios antes de continuar.");

            return;
        }
        setPaso(2);
    };

    const volverAlFormulario = () => {
        setPaso(1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Guardando cita con los siguientes datos:", {
            idPaciente: Cita?.idPaciente,
            tipoCitaId: Cita?.tipoCitaId,
            fecha: Cita?.fecha,
            hora: Cita?.hora,
            observaciones: Cita?.observaciones
        });
        // Aquí iría tu lógica de guardado en la API
        // _props.OnSuccess(nuevoId, false);
    };

    return (
        <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* Encabezado dinámico según el paso */}
            <div className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-800">
                    {paso === 1 ? 'Nueva cita' : 'Resumen de la cita'} 
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    {paso === 1
                        ? 'Completa los datos para la creación de una cita odontológica.'
                        : 'Verifica que la información sea correcta antes de guardar.'}
                </p>
            </div>

            <form onSubmit={handleSubmit}>

                {/* ================= PASO 1: FORMULARIO ================= */}
                {paso === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">

                        <PacienteComboBox
                            value={Cita?.idPaciente}
                            onChange={handleCambioPaciente}
                            valueText={pacienteNombre}
                        />
                         <p className="text-sm text-slate-500">Paciente seleccionado: {pacienteNombre}</p>
                        <TipoCitaComboBox
                            value={Cita?.tipoCitaId}
                            onChange={handleCambioTipoCita}
                        />

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Fecha y hora *</label>
                            <div className="grid gap-3 md:grid-cols-2">
                                <input
                                    type="date"
                                    value={Cita?.fecha || ''}
                                    onChange={(e) => setCita((prev) => prev ? { ...prev, fecha: e.target.value } : null)}

                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />
                                <input
                                    type="time"
                                    value={Cita?.hora || ''}
                                    onChange={(e) => setCita((prev) => prev ? { ...prev, hora: e.target.value } : null)}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Observaciones (Opcional)</label>
                            <textarea
                                rows={3}
                                value={Cita?.observaciones || ''}
                                onChange={(e) => setCita((prev) => prev ? { ...prev, observaciones: e.target.value } : null)}
                                placeholder="Escribe una observación breve..."
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={irAlResumen}
                                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                )}

                {/* ================= PASO 2: RESUMEN ================= */}
                {paso === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                            <h3 className="text-sm font-semibold text-slate-700 mb-4 border-b border-slate-200 pb-2">Detalles confirmados</h3>

                            <div className="space-y-3 text-sm text-slate-600">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg bg-white px-4 py-3 shadow-sm border border-slate-100">
                                    <span className="text-slate-500">Paciente</span>
                                    <span className="font-semibold text-slate-800">{Cita?.idPaciente}</span>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg bg-white px-4 py-3 shadow-sm border border-slate-100">
                                    <span className="text-slate-500">Tipo de cita</span>
                                    <span className="font-semibold text-slate-800">{tipoCitaNombre}</span>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg bg-white px-4 py-3 shadow-sm border border-slate-100">
                                    <span className="text-slate-500">Fecha y Hora</span>
                                    <span className="font-semibold text-slate-800">{Cita?.fecha} a las {Cita?.hora}</span>
                                </div>

                                {Cita?.observaciones && (
                                    <div className="flex flex-col rounded-lg bg-white px-4 py-3 shadow-sm border border-slate-100 mt-2">
                                        <span className="text-slate-500 mb-1">Observaciones</span>
                                        <span className="text-slate-800">{Cita?.observaciones}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                            <button
                                type="button"
                                onClick={volverAlFormulario}
                                className="w-full sm:w-1/3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Volver a editar
                            </button>

                            <button
                                type="submit"
                                className="w-full sm:w-2/3 rounded-lg bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                            >
                                Confirmar y Guardar cita
                            </button>
                        </div>
                    </div>
                )}

            </form>

        </div>
    );
}