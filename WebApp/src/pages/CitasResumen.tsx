import Tabla from '../components/common/Table.tsx';
import { useState, useEffect } from 'react';
import Modal from '../components/common/Modal.tsx';
import type { CitaApiResponse, CitaEvent, PagePrompt } from '../types/index.ts';
import { Search, Eye} from 'lucide-react';
import api from '../api/axiosConfig.ts';
import { AxiosError } from 'axios';
import Popover from '../components/common/Popover.tsx';
import { useNotify } from '../components/Context/NotifyContext';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { DetalleCitaCard } from '../components/common/Citas/DetalleCitaCard.tsx';

dayjs.locale('es');

// Interfaz temporal para el filtro de citas (ajusta según tus necesidades)
export interface CitaFiltro {
  PacienteNombre?: string;
  EstadoCodigo?: string;
}

export default function CitasResumen() {
  const { error } = useNotify();

  // Estados principales
  const [citas, setCitas] = useState<CitaApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [PagePrompt, setPagePrompt] = useState<PagePrompt>({ pageNumber: 1, pageSize: 10, TotalRecords: 0 });
  
  // Estados para Filtros
  const [showFilter, setShowFilter] = useState(false);
  const [filtroCita, setFiltroCita] = useState<CitaFiltro>({ PacienteNombre: undefined, EstadoCodigo: undefined });

  const [selectedCita, setSelectedCita] = useState<CitaEvent | null>(null);

  const clearFilters = () => {
    setFiltroCita({ PacienteNombre: undefined, EstadoCodigo: undefined });
    getCitas({ PacienteNombre: undefined, EstadoCodigo: undefined });
    setShowFilter(!showFilter);
  };

  const getCitas = async (filtro?: CitaFiltro) => {
    try {
      setIsLoading(true);
      const filtroUsar = filtro ? { ...filtroCita, ...filtro } : filtroCita;
      if (filtro) setFiltroCita(filtroUsar);

      const response = await api.get(`/Citas`, {
        params: {
          pageNumber: PagePrompt.pageNumber,
          pageSize: PagePrompt.pageSize,
          pacienteNombre: filtroUsar.PacienteNombre ?? null,
          estadoCodigo: filtroUsar.EstadoCodigo ?? null
        },
      });

      setPagePrompt({
        ...PagePrompt,
        TotalRecords: response.data.totalRecords || response.data.data.length // Ajustar según tu API
      });

      setCitas(response.data.data);
    } catch (err: AxiosError | any) {
      if (err.response?.status === 401) {
        error({ titulo: "Error", descripcion: "Usuario no autorizado" });
      }
      console.error("Error al obtener citas:", err);
      error({ titulo: "Error", descripcion: "No se pudieron cargar las citas." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCitas();
  }, [PagePrompt.pageNumber]);

  const obtenerColorEstadoClase = (codigo: string) => {
    switch (codigo) {
      case 'A': return 'bg-green-100 text-green-700 border-green-200'; // Atendido
      case 'P': return 'bg-blue-100 text-blue-700 border-blue-200'; // Pendiente
      case 'C': return 'bg-red-100 text-red-700 border-red-200'; // Cancelado
      case 'R': return 'bg-orange-100 text-orange-700 border-orange-200'; // Reagendado
      default: return 'bg-gray-100 text-gray-700 border-gray-200'; // Desconocido
    }
  };

  // Configuración de las columnas de la tabla
  const columnas = [
    { header: 'ID', key: 'id', render: (c: CitaApiResponse) => `#${c.id}` },
    { header: 'Paciente', key: 'pacienteNombre' },
    { header: 'Tipo de Cita', key: 'tipoCitaNombre' },
    {
      header: "Fecha y Hora",
      key: "fechaInicio",
      render: (c: CitaApiResponse) => {
        const start = dayjs(c.fechaInicio);
        const end = dayjs(c.fechaFin).isValid() ? dayjs(c.fechaFin) : start.add(60, 'minute');
        return (
          <div className="flex flex-col text-sm">
            <span className="font-medium text-slate-700">{start.format('DD/MM/YYYY')}</span>
            <span className="text-slate-500">{start.format('HH:mm')} - {end.format('HH:mm')}</span>
          </div>
        );
      }
    },
    {
      header: 'Estado', key: 'estadoCitaDescripcion',
      render: (c: CitaApiResponse) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${obtenerColorEstadoClase(c.estadoCitaCodigo)}`}>
          {c.estadoCitaDescripcion}
        </span>
      )
    },
    {
      header: 'Acciones',
      key: 'acciones',
      render: (c: CitaApiResponse) => (
        <button 
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center gap-1"
          onClick={() => {
            setSelectedCita({
              ...selectedCita
              , id: c.id
              , title: `${c.tipoCitaNombre} - ${c.pacienteNombre} Cita #${c.id}`
              , start: dayjs(c.fechaInicio).toDate(), end: dayjs(c.fechaFin).toDate()
              , pacienteId: c.pacienteId
              , tipoCitaId: c.tipoCitaId
              , observaciones: c.observaciones
              , pacienteNombre: c.pacienteNombre
              , tipoCitaNombre: c.tipoCitaNombre
              , estadoCitaCodigo: c.estadoCitaCodigo
              , estadoCitaDescripcion: c.estadoCitaDescripcion
              , fechaText: `${dayjs(c.fechaInicio).format('DD/MM/YYYY')} ${dayjs(c.fechaInicio).format('HH:mm')} - ${dayjs(c.fechaFin).format('HH:mm')}`
              , Recibo: c.citaRecibo});
          }}
        >
          <Eye className="w-5 h-5" />
          <span className="text-sm">Ver</span>
        </button>
      )
    },
  ];

  // const handleOpenFormCita = (id?: number) => {
  //   setSelectedCitaId(id);
  //   setIsFormCitaOpen(true);
  // };

  // const handleCloseFormCita = () => {
  //   setIsFormCitaOpen(false);
  //   setSelectedCitaId(undefined);
  // };


  return (
    <div className="relative font-sans antialiased text-gray-900">
      <h1 className="text-2xl font-bold text-gray-800">Gestión de Citas</h1>
      
      {/* Botonera Superior */}
      <div className='flex py-4 gap-3'>
        {/* <button 
          className="flex w-50 items-center justify-between p-2 bg-white border border-slate-200 rounded-3xl hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all group"
          onClick={() => handleOpenFormCita()}
        >
          <div className="flex items-center gap-3">
            <div className="text-blue-600"><CalendarPlus className="w-5 h-5" /></div>
            <span className="font-semibold text-slate-700">Nueva Cita</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
        </button>    */}

        <button 
          className="flex w-25 items-center justify-between p-2 bg-white border border-slate-200 rounded-3xl hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all group" 
          onClick={() => getCitas()} 
        >
          <span className="font-semibold text-slate-700">Buscar</span>
          <span className="pl-2 inline-block"><Search size={16} strokeWidth={2.5} /></span>
        </button>

        <div>
          {/* Popover para filtros de búsqueda */}
          <Popover 
            classChild="flex w-25 items-center justify-between p-2 bg-white border border-slate-200 rounded-3xl hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all group font-semibold text-slate-700"
            children={
              <div className="p-4 text-sm text-slate-600">
                <p>Formulario de Filtros de Cita (Próximamente)</p>
                <button onClick={clearFilters} className="mt-2 text-blue-600 underline">Limpiar filtros</button>
              </div>
            }
            isOpen={showFilter} 
            onToggle={() => setShowFilter(!showFilter)} 
          />
        </div>
      </div>
      
      <hr className="mb-4 border-slate-200" />
      
      {/* Tabla Principal */}
      <Tabla 
        columns={columnas} 
        data={citas} 
        isLoading={isLoading}
        PagePromts={PagePrompt} 
        onPageChange={(page) => setPagePrompt({ ...PagePrompt, pageNumber: page })}
      />

      {/* Modal de Detalles de Cita (Lógica del Calendario) */}
      <Modal isOpen={Boolean(selectedCita)} 
        onClose={() => {
          setSelectedCita(null);
        }}
      >
        <DetalleCitaCard
          onCargarCitas={getCitas}
          selectedCita={selectedCita}
          setSelectedCita={setSelectedCita}
          key={selectedCita?.id} /> 
      </Modal>
    </div>
  );
}