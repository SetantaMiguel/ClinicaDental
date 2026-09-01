import { Calendar, dayjsLocalizer, Views, type View } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarCustom.css';
import { useCallback, useEffect, useState } from 'react';
import api from '../../../api/axiosConfig';
import Modal from '../Modal';
import { ChevronRight, Plus } from 'lucide-react';
import type { CitaApiResponse, CitaEvent } from '../../../types/index'
import { useNotify } from '../../Context/NotifyContext';
import FormAppointment from '../../Forms/FormAppointment';
import { DetalleCitaCard } from './DetalleCitaCard';

dayjs.locale('es');

const localizer = dayjsLocalizer(dayjs);

export default function CalendarioCitas() {
  const { error: notifyError } = useNotify();
  const [viewDate, setViewDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [eventos, setEventos] = useState<CitaEvent[]>([]);
  const [selectedCita, setSelectedCita] = useState<CitaEvent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormCitaNuevoOpen, setIsFormCitaNuevoOpen] = useState(false);

  const cargarCitas = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/Citas');
      const citas = response.data.data as CitaApiResponse[];

      const mappedEvents = citas.map((cita) => {
        const start = dayjs(cita.fechaInicio).isValid() ? dayjs(cita.fechaInicio).toDate() : new Date();
        const end = dayjs(cita.fechaFin).isValid() ? dayjs(cita.fechaFin).toDate() : dayjs(start).add(60, 'minute').toDate();
        const pacienteNombre = cita.pacienteNombre;
        const tipoCitaNombre = cita.tipoCitaNombre;

        return {
          id: cita.id,
          title: `${tipoCitaNombre} - ${pacienteNombre} Cita #${cita.id}`,
          start,
          end,
          pacienteId: cita.pacienteId,
          tipoCitaId: cita.tipoCitaId,
          observaciones: cita.observaciones,
          pacienteNombre,
          tipoCitaNombre,
          estadoCitaCodigo: cita.estadoCitaCodigo,
          estadoCitaDescripcion: cita.estadoCitaDescripcion,
          fechaText: `${dayjs(start).format('DD/MM/YYYY')} ${dayjs(start).format('HH:mm')} - ${dayjs(end).format('HH:mm')}`,
          Recibo: cita.citaRecibo
        };
      });

      setEventos(mappedEvents);
    } catch (err) {
      console.error('Error al cargar citas:', err);
      notifyError({
        titulo: 'Error',
        descripcion: 'No se pudieron cargar las citas. Intente nuevamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSuccessCita = async () => {
    setIsFormCitaNuevoOpen(false);
    setSelectedCita(null);
    cargarCitas();
  }

  useEffect(() => {
    cargarCitas();
  }, []);

  const obtenerColorEstado = (codigo: string) => {
    switch (codigo) {
      case 'A': return '#16a34a'; // Atendido (Verde)
      case 'P': return '#2e57df'; // Pendiente (Azul)
      case 'C': return '#dc2626b0'; // Cancelado (Rojo)
      case 'R': return '#ea580c'; // Reagendado (Naranja)
      default: return '#6b7280'; // Gris (Desconocido)
    }
  };

  const handleSelectEvent = useCallback((evento: CitaEvent) => {
    setSelectedCita(evento);
  }, []);

  const handleSelectSlot = useCallback(() => {

  }, []);

  const handleViewChange = useCallback((newView: View) => {
    setCurrentView(newView);
  }, []);

  const handleNavigate = useCallback((newDate: Date) => {
    setViewDate(newDate);
  }, []);

  const eventPropGetter = useCallback((evento: CitaEvent) => ({
    style: {
      backgroundColor: obtenerColorEstado(evento.estadoCitaCodigo),
      borderRadius: '6px',
      border: 'none',
      color: 'white',
      opacity: 0.95,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '2px 6px',
    },
  }), []);

  return (
    <div className="h-[80vh] font-sans antialiased text-gray-900 relative">
      <button className="flex w-50 mb-2 items-center justify-between p-2 bg-white border border-slate-200 rounded-3xl
         hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all group"
        onClick={() => setIsFormCitaNuevoOpen(true)}>
        <div className="flex items-center gap-3">
          <div className="text-blue-600"><Plus className="w-5 h-5" /></div>
          <span className="font-semibold text-slate-700">Nueva Cita</span>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
      </button>

      {isLoading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <span className="text-blue-600 font-semibold animate-pulse">Cargando citas...</span>
        </div>
      )}

      <Calendar
        localizer={localizer}
        events={eventos}
        defaultView={Views.MONTH}
        date={viewDate}
        view={currentView}
        onView={handleViewChange}
        onNavigate={handleNavigate}
        step={30}
        timeslots={1}
        dayLayoutAlgorithm="no-overlap"
        eventPropGetter={eventPropGetter}
        style={{ height: '100%' }}
        messages={{
          next: 'Sig.',
          previous: 'Ant.',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          showMore: (total) => `+${total} más`,
        }}
        views={[Views.MONTH, Views.DAY, Views.AGENDA]}
        onSelectEvent={handleSelectEvent}
        selectable={true}
        onSelectSlot={handleSelectSlot}
      />

      <Modal isOpen={Boolean(selectedCita)} onClose={() => {
        setSelectedCita(null);
      }}>
        <DetalleCitaCard
          onCargarCitas={cargarCitas}
          selectedCita={selectedCita}
          setSelectedCita={setSelectedCita}
          key={selectedCita?.id} />
      </Modal>

      <Modal isOpen={isFormCitaNuevoOpen} onClose={() => setIsFormCitaNuevoOpen(false)}>
        <FormAppointment OnSuccess={handleFormSuccessCita} idCita={0} />
      </Modal>
    </div>
  );
}