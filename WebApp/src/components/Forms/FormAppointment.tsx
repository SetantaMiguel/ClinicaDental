import { useEffect, useState } from "react";
import TipoCitaComboBox from "../CombosBox/TipoCitaComboBox";
import PacienteComboBox from "../CombosBox/PacienteComboBox";
import type { Cita } from "../../types/index.ts";
import api from '../../api/axiosConfig';
import { useNotify } from '../Context/NotifyContext';

interface FormAppointmentProps {
  OnSuccess: (id: number, bEdicion: boolean) => void;
  idPaciente?: number;
  idCita?: number;
}

const initialCita: Cita = {
  fechaInicio: '',
  horaInicio: '',
  fechaFin: '',
  horaFin: '',
  id: 0,
  idPaciente: 0,
  tipoCitaId: 0,
  observaciones: ''
};

const DURACIONES_PREDEFINIDAS = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 60, label: '1 hora' },
  { value: 120, label: '2 horas' },
  { value: 180, label: '3 horas' },
];

const formatearFecha = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatearHora = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};


export default function FormAppointment({ OnSuccess, idPaciente, idCita }: FormAppointmentProps) {
  const { success, error } = useNotify();
  const [paso, setPaso] = useState<1 | 2>(1);
  const [tipoCitaNombre, setTipoCitaNombre] = useState<string>('—');
  const [cita, setCita] = useState<Cita>(initialCita);
  const [pacienteNombre, setPacienteNombre] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [duracionMinutos, setDuracionMinutos] = useState<number>(30);

  useEffect(() => {
    if (idPaciente) {
      setCita((prev) => ({ ...prev, idPaciente: idPaciente }));
    }

    if (idCita) {

      const fetchCita = async () => {
        try {

          setIsLoading(true);
          const response = await api.get(`/Citas/${idCita}`);
          const rawData = response.data;

          const startDate = new Date(rawData.fechaInicio);
          const endDate = new Date(rawData.fechaFin);

          // 2. Mapeamos y transformamos los valores a nuestra interfaz Cita
          const citaData: Cita = {
            id: rawData.id,
            idPaciente: rawData.pacienteId,
            tipoCitaId: rawData.tipoCitaId,

            // 3. Separamos la fecha y la hora usando tus funciones
            fechaInicio: formatearFecha(startDate),
            horaInicio: formatearHora(startDate),
            fechaFin: formatearFecha(endDate),
            horaFin: formatearHora(endDate),

            observaciones: rawData.observaciones || ''
          };
          setDuracionMinutos((endDate.getTime() - startDate.getTime()) / (1000 * 60)); // Calcula la duración en minutos
          setCita(citaData);
        } catch (err) {
          error({
            titulo: 'Error al cargar la cita',
            descripcion: 'No se pudo cargar la información de la cita.',
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchCita();
    }
  }, [idPaciente, idCita]);

  useEffect(() => {
    if (!cita.fechaInicio || !cita.horaInicio) return;

    const [anio, mes, dia] = cita.fechaInicio.split('-').map(Number);
    const [hora, minuto] = cita.horaInicio.split(':').map(Number);
    const fechaInicio = new Date(anio, mes - 1, dia, hora, minuto, 0, 0);
    const fechaFin = new Date(fechaInicio.getTime() + duracionMinutos * 60 * 1000);

    setCita((prev) => ({
      ...prev,
      fechaFin: formatearFecha(fechaFin),
      horaFin: formatearHora(fechaFin),
    }));
  }, [cita.fechaInicio, cita.horaInicio, duracionMinutos]);

  const handleCambioTipoCita = (id: number, nombre: string) => {
    setCita((prev) => ({ ...prev, tipoCitaId: id }));
    setTipoCitaNombre(nombre);
  };

  const handleCambioPaciente = (id: number, nombre: string) => {
    setCita((prev) => ({ ...prev, idPaciente: id }));
    setPacienteNombre(nombre);
  };

  const irAlResumen = () => {
    console.log('Datos de la cita:', cita);
    if (!cita.idPaciente || !cita.tipoCitaId || !cita.fechaInicio || !cita.horaInicio) {
      error({
        titulo: 'Campos incompletos',
        descripcion: 'Verifica haber seleccionado paciente, tipo de cita, fecha y hora.',
      });
      return;
    }
    setPaso(2);
  };

  const volverAlFormulario = () => setPaso(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cita.idPaciente || !cita.tipoCitaId || !cita.fechaInicio || !cita.horaInicio) return;

    const [anio, mes, dia] = cita.fechaInicio.split('-').map(Number);
    const [hora, minuto] = cita.horaInicio.split(':').map(Number);
    const fechaInicio = new Date(anio, mes - 1, dia, hora, minuto, 0, 0);
    const fechaFin = new Date(fechaInicio.getTime() + duracionMinutos * 60 * 1000);

    try {
      setIsLoading(true);

      const payload = {
        id: cita.id,
        PacienteId: cita.idPaciente,
        TipoCitaId: cita.tipoCitaId,
        FechaInicio: fechaInicio.toISOString(),
        FechaFin: fechaFin.toISOString(),
        Observaciones: cita.observaciones?.trim() || null,
      };
      const isEdicion = Boolean(idCita) || cita.id > 0;

      if (isEdicion) {
        // Ejecutamos PUT para actualizar
        await api.put(`/Citas/${cita.id}`, payload);

        // Enviamos true a OnSuccess para notificarle al padre que fue una edición
        OnSuccess(cita.id, true);

        success({
          titulo: '¡Cita actualizada!',
          descripcion: 'La cita fue modificada correctamente.',
        });
      } else {
        // Ejecutamos POST para crear
        const response = await api.post('/Citas', payload);

        // Enviamos false porque es una creación nueva
        OnSuccess(response.data?.id ?? cita.idPaciente, false);

        success({
          titulo: '¡Cita programada!',
          descripcion: 'La cita fue creada correctamente.',
        });
      }
      setCita({ ...initialCita, idPaciente: idPaciente ?? 0 });
      setTipoCitaNombre('—');
      setPacienteNombre('');
      setPaso(1);
    } catch (err: any) {
      console.error('Error al guardar la cita:', err);
      error({
        titulo: 'Error',
        descripcion: err.response?.data?.message || 'No se pudo guardar la cita.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName = "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900";
  const labelClassName = "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <div className="mx-auto w-full max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            {paso === 1 ? (idCita ? 'Reprogramar Cita' : 'Programar Cita') : 'Confirmar Detalles'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {paso === 1
              ? 'Ingresa los datos correspondientes para agendar la cita.'
              : 'Revisa cuidadosamente la información antes de guardar.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
          <span className={paso === 1 ? 'text-gray-900' : ''}>1. Datos</span>
          <span className="text-gray-300">/</span>
          <span className={paso === 2 ? 'text-gray-900' : ''}>2. Resumen</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {paso === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">

              <div>
                <PacienteComboBox
                  value={cita.idPaciente}
                  onChange={handleCambioPaciente}
                  valueText={pacienteNombre}
                />
              </div>

              <div>
                <TipoCitaComboBox
                  value={cita.tipoCitaId}
                  onChange={handleCambioTipoCita}
                />
              </div>

              <div>
                <label className={labelClassName}>Fecha de inicio <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={cita.fechaInicio || ''}
                  onChange={(e) => setCita((prev) => ({ ...prev, fechaInicio: e.target.value }))}
                  className={inputClassName}
                  required
                />
              </div>

              <div>
                <label className={labelClassName}>Hora de inicio <span className="text-red-500">*</span></label>
                <input
                  type="time"
                  value={cita.horaInicio || ''}
                  onChange={(e) => setCita((prev) => ({ ...prev, horaInicio: e.target.value }))}
                  className={inputClassName}
                  required
                />
              </div>

              <div>
                <label className={labelClassName}>Duración estimada <span className="text-red-500">*</span></label>
                <select
                  value={duracionMinutos}
                  onChange={(e) => setDuracionMinutos(Number(e.target.value))}
                  className={inputClassName}
                >
                  {DURACIONES_PREDEFINIDAS.map((duracion) => (
                    <option key={duracion.value} value={duracion.value}>
                      {duracion.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 mt-2">
                <label className={labelClassName}>Observaciones (Opcional)</label>
                <textarea
                  rows={3}
                  value={cita.observaciones || ''}
                  onChange={(e) => setCita((prev) => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Añade detalles adicionales sobre la consulta..."
                  className={`${inputClassName} resize-none`}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={irAlResumen}
                className="w-full rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 md:w-auto"
              >
                Continuar al resumen
              </button>
            </div>
          </div>
        )}

        {paso === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <dl className="divide-y divide-gray-100 text-sm">
                <div className="grid grid-cols-3 gap-4 px-5 py-4 bg-gray-50/50">
                  <dt className="font-medium text-gray-500">Paciente</dt>
                  <dd className="col-span-2 font-semibold text-gray-900">{pacienteNombre || `#${cita.idPaciente}`}</dd>
                </div>
                <div className="grid grid-cols-3 gap-4 px-5 py-4">
                  <dt className="font-medium text-gray-500">Tipo de cita</dt>
                  <dd className="col-span-2 font-semibold text-gray-900">{tipoCitaNombre}</dd>
                </div>
                <div className="grid grid-cols-3 gap-4 px-5 py-4 bg-gray-50/50">
                  <dt className="font-medium text-gray-500">Horario de inicio</dt>
                  <dd className="col-span-2 text-gray-900">{cita.fechaInicio} a las {cita.horaInicio}</dd>
                </div>
                <div className="grid grid-cols-3 gap-4 px-5 py-4">
                  <dt className="font-medium text-gray-500">Horario de fin</dt>
                  <dd className="col-span-2 text-gray-900">{cita.fechaFin} a las {cita.horaFin}</dd>
                </div>
                {cita.observaciones && (
                  <div className="grid grid-cols-3 gap-4 px-5 py-4 bg-gray-50/50">
                    <dt className="font-medium text-gray-500">Observaciones</dt>
                    <dd className="col-span-2 text-gray-700">{cita.observaciones}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
              <button
                type="button"
                onClick={volverAlFormulario}
                className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Volver a editar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Guardando...' : 'Confirmar y guardar'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}