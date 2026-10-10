import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

export interface CitaFiltro {
  FechaDesde?: string;
  FechaHasta?: string;
  PacienteNombre?: string;
  EstadoCitaCodigo?: string;
  TipoCitaId?: number;
}

interface TipoCitaOption {
  id: number;
  nombreCita: string;
}

interface FormFilterCitaProps {
  ApplyFilters: (filtro: CitaFiltro) => void;
  filtroActual: CitaFiltro;
  onCancel: () => void;
}

const estadosCita = [
  { codigo: 'P', descripcion: 'Pendiente' },
  { codigo: 'A', descripcion: 'Atendido' },
  { codigo: 'C', descripcion: 'Cancelado' },
  { codigo: 'R', descripcion: 'Reagendado' },
];

export default function FormFilterCita({ ApplyFilters, filtroActual, onCancel }: FormFilterCitaProps) {
  const [fechaDesde, setFechaDesde] = useState(filtroActual.FechaDesde ?? '');
  const [fechaHasta, setFechaHasta] = useState(filtroActual.FechaHasta ?? '');
  const [pacienteNombre, setPacienteNombre] = useState(filtroActual.PacienteNombre ?? '');
  const [estadoCitaCodigo, setEstadoCitaCodigo] = useState(filtroActual.EstadoCitaCodigo ?? '');
  const [tipoCitaId, setTipoCitaId] = useState(filtroActual.TipoCitaId?.toString() ?? '');
  const [tiposCita, setTiposCita] = useState<TipoCitaOption[]>([]);

  useEffect(() => {
    setFechaDesde(filtroActual.FechaDesde ?? '');
    setFechaHasta(filtroActual.FechaHasta ?? '');
    setPacienteNombre(filtroActual.PacienteNombre ?? '');
    setEstadoCitaCodigo(filtroActual.EstadoCitaCodigo ?? '');
    setTipoCitaId(filtroActual.TipoCitaId?.toString() ?? '');
  }, [filtroActual]);

  useEffect(() => {
    const cargarTiposCita = async () => {
      try {
        const response = await api.get('/CatalogoCita/Vigentes');
        setTiposCita(response.data);
      } catch (error) {
        console.error('Error al cargar tipos de cita:', error);
      }
    };

    cargarTiposCita();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    ApplyFilters({
      FechaDesde: fechaDesde || undefined,
      FechaHasta: fechaHasta || undefined,
      PacienteNombre: pacienteNombre.trim() || undefined,
      EstadoCitaCodigo: estadoCitaCodigo || undefined,
      TipoCitaId: tipoCitaId ? Number(tipoCitaId) : undefined,
    });
  };

  const inputClassName = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

  return (
    <form onSubmit={handleSubmit} className=" space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="cita-fecha-desde">Desde</label>
        <input id="cita-fecha-desde" type="date" className={inputClassName} value={fechaDesde}
          max={fechaHasta || undefined} onChange={(event) => setFechaDesde(event.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="cita-fecha-hasta">Hasta</label>
        <input id="cita-fecha-hasta" type="date" className={inputClassName} value={fechaHasta}
          min={fechaDesde || undefined} onChange={(event) => setFechaHasta(event.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="cita-paciente">Paciente</label>
        <input id="cita-paciente" type="search" className={inputClassName} value={pacienteNombre}
          onChange={(event) => setPacienteNombre(event.target.value)} placeholder="Nombre o apellido" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="cita-estado">Estado</label>
        <select id="cita-estado" className={inputClassName} value={estadoCitaCodigo}
          onChange={(event) => setEstadoCitaCodigo(event.target.value)}>
          <option value="">Todos los estados</option>
          {estadosCita.map((estado) => <option key={estado.codigo} value={estado.codigo}>{estado.descripcion}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="cita-tipo">Tipo de cita</label>
        <select id="cita-tipo" className={inputClassName} value={tipoCitaId}
          onChange={(event) => setTipoCitaId(event.target.value)}>
          <option value="">Todos los tipos</option>
          {tiposCita.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nombreCita}</option>)}
        </select>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="rounded px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">
          Limpiar
        </button>
        <button type="submit" className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
          Aplicar
        </button>
      </div>
    </form>
  );
}