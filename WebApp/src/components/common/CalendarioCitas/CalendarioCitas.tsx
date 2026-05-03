import { Calendar, dayjsLocalizer, Views, type View } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importar idioma español
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarCustom.css'; 
import { useCallback, useState } from 'react';

// Configurar Dayjs para que use español globalmente
dayjs.locale('es');

// Crear el localizador
const localizer = dayjsLocalizer(dayjs);

export default function CalendarioCitas() {

  const [viewDate, setViewDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.WEEK); 
  // Ejemplo de eventos usando Dayjs para crearlos
  const eventos = [
    {
      title: 'Limpieza Dental - Ana Leyton',
      start: dayjs('2026-02-23T09:00:00').toDate(),
      end: dayjs('2026-02-23T10:00:00').toDate(),
    },
    {
      title: 'Extracción - Roberto Somoza',
      start: dayjs('2026-02-23T11:30:00').toDate(),
      end: dayjs('2026-02-23T13:00:00').toDate(),
    }
  ];
  
  const handleSelectEvent = (evento: any) => {
      // Aquí puedes abrir un Modal con la información del paciente
      console.log("Cita seleccionada:", evento.title);
      alert(`Paciente: ${evento.title}\nTratamiento: ${evento.tratamiento}`);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
      // Aquí abrirías el formulario para crear una nueva cita
      console.log("Espacio seleccionado:", slotInfo.start);
  };  
  
// Usamos useCallback para mejorar el rendimiento al cambiar de vista
  const handleViewChange = useCallback((newView: View) => {
    setCurrentView(newView);
  }, []);

  const handleNavigate = useCallback((newDate: Date) => {
    setViewDate(newDate);
  }, []);

  return (
    <div className="h-[80vh] font-sans antialiased text-gray-900">
      <Calendar
        localizer={localizer}
        events={eventos}
        defaultView={Views.WEEK}
        date={viewDate}
        view={currentView}
        onView={handleViewChange}
        onNavigate={handleNavigate}
        // Configuración de horas para la clínica (8 AM a 6 PM)
        style={{ height: '100%' }}
        messages={{
          next: "Sig.",
          previous: "Ant.",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda"
        }}
        onSelectEvent={handleSelectEvent}
        selectable={true}
        onSelectSlot={handleSelectSlot}
      />
    </div>
  );
}