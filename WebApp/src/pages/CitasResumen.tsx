
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
import FormFilterCita from '../components/Forms/FormFilterCita.tsx';
import type { CitaFiltro } from '../components/Forms/FormFilterCita.tsx';

dayjs.locale('es');

export default function CitasResumen() {
  const { error } = useNotify();

  // Estados principales
  const [citas, setCitas] = useState<CitaApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [PagePrompt, setPagePrompt] = useState<PagePrompt>({ pageNumber: 1, pageSize: 10, TotalRecords: 0 });
  
  // Estados para Filtros
const [showFilter, setShowFilter] = useState(false);
 const [filtroCita, setFiltroCita] = useState<CitaFiltro>({});

 const [selectedCita, setSelectedCita] = useState<CitaEvent | null>(null);

 const clearFilters = () => {
   setFiltroCita({});
   setPagePrompt((page) => ({ ...page, pageNumber: 1 }));
   getCitas({}, 1);
   setShowFilter(false);
 };

 const getCitas = async (filtro?: CitaFiltro, pageNumber = PagePrompt.pageNumber) => {
   try {
     setIsLoading(true);
     const filtroUsar = filtro ? { ...filtroCita, ...filtro } : filtroCita;
     if (filtro) setFiltroCita(filtroUsar);

     const response = await api.get(`/Citas`, {
       params: {
         pageNumber,
         pageSize: PagePrompt.pageSize,
         fechaDesde: filtroUsar.FechaDesde ?? null,
         fechaHasta: filtroUsar.FechaHasta ?? null,
         pacienteNombre: filtroUsar.PacienteNombre ?? null,
         estadoCitaCodigo: filtroUsar.EstadoCitaCodigo ?? null,
         tipoCitaId: filtroUsar.TipoCitaId ?? null
       },
     });

     setPagePrompt({
       ...PagePrompt,
       pageNumber,
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

 const applyFilters = (filtro: CitaFiltro) => {
   setFiltroCita(filtro);
   setPagePrompt((page) => ({ ...page, pageNumber: 1 }));
   getCitas(filtro, 1);
   setShowFilter(false);
 };

 useEffect(() => {
   getCitas();
 }, [PagePrompt.pageNumber]);

 const obtenerColorEstadoClase = (codigo: string) => {
   switch (codigo) {
     case 'A': return 'bggreen100 textgreen700 bordergreen200'; // Atendido
     case 'P': return 'bgblue100 textblue700 borderblue200'; // Pendiente
     case 'C': return 'bgred100 textred700 borderred200'; // Cancelado
     case 'R': return 'bgorange100 textorange700 borderorange200'; // Reagendado
     default: return 'bggray100 textgray700 bordergray200'; // Desconocido
   }
 };

 // Configuración de las columnas de la tabla
 const columnas = [
   { header: 'ID', key: 'id', render: (c: CitaApiResponse) => `#${c.id}` },
   { header: 'Paciente', key: 'pacienteNombre' },
   { header: 'Tipo de Cita', key: 'tiposCita', render: (c: CitaApiResponse) => c.tiposCita?.map(tc => tc.tipoCitaNombre).join(', ') ?? 'N/A' },
   {
     header: "Fecha y Hora",
     key: "fechaInicio",
     render: (c: CitaApiResponse) => {
       const start = dayjs(c.fechaInicio);
       const end = dayjs(c.fechaFin).isValid() ? dayjs(c.fechaFin) : start.add(60, 'minute');
       return (
         <div className="flex flexcol textsm">
           <span className="fontmedium textslate700">{start.format('DD/MM/YYYY')}</span>
           <span className="textslate500">{start.format('HH:mm')} {end.format('HH:mm')}</span>
         </div>
       );
     }
   },
   {
     header: 'Estado', key: 'estadoCitaDescripcion',
     render: (c: CitaApiResponse) => (
       <span className={`px2 py1 roundedfull textxs fontsemibold border ${obtenerColorEstadoClase(c.estadoCitaCodigo)}`}>
         {c.estadoCitaDescripcion}
       </span>
     )
   },
   {
     header: 'Acciones',
     key: 'acciones',
     render: (c: CitaApiResponse) => (
       <button 
         className="textblue600 hover:textblue800 fontmedium transitioncolors flex itemscenter gap1"
         onClick={() => {
           setSelectedCita({
             ...selectedCita
             , id: c.id
             , title: `Cita #${c.id} ${c.pacienteNombre}`
             , start: dayjs(c.fechaInicio).toDate(), end: dayjs(c.fechaFin).toDate()
             , pacienteId: c.pacienteId
             , observaciones: c.observaciones
             , pacienteNombre: c.pacienteNombre
             , estadoCitaCodigo: c.estadoCitaCodigo
             , estadoCitaDescripcion: c.estadoCitaDescripcion
             , fechaText: `${dayjs(c.fechaInicio).format('DD/MM/YYYY')} ${dayjs(c.fechaInicio).format('HH:mm')} ${dayjs(c.fechaFin).format('HH:mm')}`
             , Recibo: c.citaRecibo
             , tiposCita: c.tiposCita
             , usuarioCreacion: c.usuarioCreacion
           });
         }}
       >
         <Eye className="w5 h5" />
         <span className="textsm">Ver</span>
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
   <div className="relative fontsans antialiased textgray900">
     <h1 className="text2xl fontbold textgray800">Gestión de Citas</h1>
     
     {/* Botonera Superior */}
     <div className='flex py4 gap3'>
       {/* <button 
         className="flex w50 itemscenter justifybetween p2 bgwhite border borderslate200 rounded3xl hover:bgslate50 hover:borderslate300 active:bgslate100 transitionall group"
         onClick={() => handleOpenFormCita()}
       >
         <div className="flex itemscenter gap3">
           <div className="textblue600"><CalendarPlus className="w5 h5" /></div>
           <span className="fontsemibold textslate700">Nueva Cita</span>
         </div>
         <ChevronRight className="w5 h5 textslate400 grouphover:textslate600" />
       </button>    */}

       <button 
         className="flex itemscenter justifybetween p2 bgwhite border borderslate200 roundedxl hover:bgslate50 hover:borderslate300 active:bgslate100 transitionall group" 
         onClick={() => getCitas()} 
       >
         <span className="mr2"><Search size={16} /></span>
         <span className="fontsemibold textslate700">Buscar</span>
       </button>

       <div>
         {/* Popover para filtros de búsqueda */}
         <Popover 
           classChild="flex itemscenter justifybetween p2 bgwhite border borderslate200 roundedxl hover:bgslate50 hover:borderslate300 active:bgslate100 transitionall group fontsemibold textslate700"
           children={
             <div className="textsm textslate600">
               <FormFilterCita ApplyFilters={applyFilters} filtroActual={filtroCita} onCancel={clearFilters} />
             </div>
           }
           isOpen={showFilter} 
           onToggle={() => setShowFilter(!showFilter)} 
         />
       </div>
     </div>
     
     <hr className="mb4 borderslate200" />
     
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
