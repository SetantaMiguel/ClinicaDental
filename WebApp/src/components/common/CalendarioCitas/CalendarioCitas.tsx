import { Calendar, dayjsLocalizer, Views, type View } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarCustom.css';
import { useCallback, useEffect, useState } from 'react';
import api from '../../../api/axiosConfig';
import Modal from '../Modal';
import { ChevronDown, CheckCircle, CalendarClock, XCircle, ChevronRight, Plus } from 'lucide-react';
import type { CitaEvent } from '../../../types/CitaEvent';
import { useConfirm } from '../../Context/ConfirmProvider';
import { useNotify } from '../../Context/NotifyContext';
import FormAppointment from '../../Forms/FormAppointment';
import ReciboCitaForm from '../../Forms/FormReciboCita';

dayjs.locale('es');

const localizer = dayjsLocalizer(dayjs);

interface CitaApiResponse {
  id: number;
  pacienteId: number;
  tipoCitaId: number;
  fechaInicio: string;
  fechaFin: string;
  observaciones?: string | null;
  pacienteNombre: string;
  tipoCitaNombre: string;
  estadoCitaCodigo: string;
  estadoCitaDescripcion: string;
  citaRecibo?: CitaReciboResponse;
}

interface CitaReciboResponse {
  idRecibo: number;
  medioPago: number;
  montoNeto: number;
  observaciones: string;
}

export default function CalendarioCitas() {
  const { error: notifyError, success: notifySuccess, info: notifyInfo } = useNotify();
  const [viewDate, setViewDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [eventos, setEventos] = useState<CitaEvent[]>([]);
  const [selectedCita, setSelectedCita] = useState<CitaEvent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormCitaOpen, setIsFormCitaOpen] = useState(false);
  const [isFormCitaNuevoOpen, setIsFormCitaNuevoOpen] = useState(false);
  const [paso, setPaso] = useState<1 | 2>(1);
  const [isShowButton, setIsShowButton] = useState(true);
  const { confirm } = useConfirm();

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
    if (evento.Recibo) {
      setIsShowButton(false);
    }
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

  const ReagendarCita = () => {
  };

  const MarcarAtendida = async () => {
    setPaso(2);
    setIsShowButton(false);
    if (!selectedCita) return;
  };

  const CancelarCita = async () => {
    if (!selectedCita) return;

    const isConfirmed = await confirm({
      title: "Cancelar Cita",
      message: `¿Estás seguro de que deseas cancelar la cita de ${selectedCita.pacienteNombre}?`,
      confirmText: "Sí, Cancelar",
      cancelText: "Cancelar"
    });

    if (!isConfirmed) {
      notifyInfo({
        titulo: 'Operación cancelada',
        descripcion: 'La cita no ha sido cancelada.',
      });
      return;
    }

    try {
      const response = await api.patch(`/Citas/Cancelar/${selectedCita.id}`);

      if (response.status === 200) {
        notifySuccess({
          titulo: 'Cita cancelada',
          descripcion: 'La cita ha sido cancelada exitosamente.',
        });

        setSelectedCita(null);
        await cargarCitas();
      }
    } catch (err) {
      console.error('Error al cancelar la cita:', err);
      notifyError({
        titulo: 'Error',
        descripcion: 'Ocurrió un problema al intentar cancelar la cita.',
      });
    }
  };

  const handleFormSuccessCita = async () => {
    setIsFormCitaOpen(false);
    setIsFormCitaNuevoOpen(false);
    setSelectedCita(null);
    await cargarCitas();
  }

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
        setPaso(1);
        setIsShowButton(true);
      }}>
        {selectedCita && (
          <div className="rounded-2xl bg-white p-5 text-slate-700 shadow-sm border border-slate-200">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  {paso === 1 ? `Cita #${selectedCita.id}` : 'Confirmar Detalles'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Información completa asociada a la cita seleccionada
                </p>
              </div>

              {/* Acciones / Estado */}
              <div>
                {selectedCita.estadoCitaCodigo === 'C' ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-red-50 text-red-600 border border-red-100">
                    Cita Cancelada
                  </span>
                ) : (
                  isShowButton && (
                    <div className="relative">
                      <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white shadow-sm rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium focus:ring-2 focus:ring-slate-400 focus:outline-none"
                      >
                        <span>Procesar Cita</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Menú Desplegable */}
                      {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50 transform origin-top-right transition-all">
                          <div className="p-1">
                            <button
                              onClick={() => {
                                setIsMenuOpen(false);
                                MarcarAtendida();
                              }}
                              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-green-700 rounded-md hover:bg-green-50 transition-colors font-medium"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Marcar Atendida
                            </button>

                            <button
                              onClick={() => {
                                setIsMenuOpen(false);
                                ReagendarCita();
                                setIsFormCitaOpen(true);
                              }}
                              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-orange-600 rounded-md hover:bg-orange-50 transition-colors font-medium"
                            >
                              <CalendarClock className="w-4 h-4" />
                              Reagendar
                            </button>

                            <div className="border-t border-slate-100 my-1"></div>

                            <button
                              onClick={() => {
                                CancelarCita();
                                setIsMenuOpen(false);
                              }}
                              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors font-medium"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancelar Cita
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Contenido Principal */}
            <div className="text-sm">
              {paso === 1 && (
                <div className="flex">
                  {/* Columna de Información */}
                  <div className={`${selectedCita.Recibo ? 'grid grid-cols-1 sm:grid-cols-2 flex-none' : 'flex-1 w-full'} `}>
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 transition hover:bg-slate-100/50 m-1">
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Paciente</span>
                      <span className="text-slate-800 font-semibold">{selectedCita.pacienteNombre}</span>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 transition hover:bg-slate-100/50 m-1">
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Fecha y hora</span>
                      <span className="text-slate-800 font-semibold">{selectedCita.fechaText || 'Fecha no disponible'}</span>
                    </div>

                    <div className={`m-1 rounded-xl bg-slate-50 p-4 border border-slate-100 transition hover:bg-slate-100/50 ${selectedCita.observaciones ? 'sm:col-span-1' : 'sm:col-span-2'}`}>
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Estado de la cita</span>
                      <span className="text-slate-800 font-semibold">{selectedCita.estadoCitaDescripcion || 'Estado no disponible'}</span>
                    </div>

                    {selectedCita.observaciones && (
                      <div className="m-1 rounded-xl bg-slate-50 p-4 border border-slate-100 transition hover:bg-slate-100/50 sm:col-span-2 lg:col-span-1">
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Observaciones</span>
                        <span className="text-slate-700 leading-relaxed">{selectedCita.observaciones}</span>
                      </div>
                    )}
                  </div>

                  {selectedCita.Recibo && (
                    <div className="flex-1 w-full lg:w-1/3 lg:border-l lg:border-slate-100 lg:pl-6">
                      <span className='text-xl font-bold tracking-tight text-slate-900'>Detalle de Pagos</span>
                      <ReciboCitaForm isReadOnly={true}
                        onSuccess={() => { }}
                        idCita={0}
                        idCitaRecibo={selectedCita.Recibo?.idRecibo}
                        idCatalogCita={0}
                      />
                    </div>
                  )}
                </div>
              )}

              {paso === 2 && (
                <div className="mt-4">

                  <ReciboCitaForm isReadOnly={false}
                    onSuccess={() => {
                      setSelectedCita(null);
                      setPaso(1);
                      setIsShowButton(true);
                      cargarCitas();
                    }}
                    idCita={selectedCita.id}
                    idCatalogCita={selectedCita.tipoCitaId}            
                    idCitaRecibo={0}        
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
      <Modal isOpen={isFormCitaNuevoOpen} onClose={() => setIsFormCitaNuevoOpen(false)}>
        <FormAppointment OnSuccess={handleFormSuccessCita} idCita={0} />
      </Modal>

      <Modal isOpen={isFormCitaOpen} onClose={() => setIsFormCitaOpen(false)}>
        <FormAppointment OnSuccess={handleFormSuccessCita} idCita={selectedCita?.id} />
      </Modal>
    </div>
  );
}