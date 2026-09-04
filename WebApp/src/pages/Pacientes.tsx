import Tabla from '../components/common/Table.tsx';
import { useState, useEffect } from 'react';
import Modal from '../components/common/Modal.tsx';
import FormPatient from '../components/Forms/FormPatient';
import type { Paciente, PagePrompt } from '../types/index.ts';
import { UserRoundPlus, Search, UserPen, CalendarClock, ChevronRight, BookUser } from 'lucide-react';
import api from '../api/axiosConfig.ts';
import { AxiosError } from 'axios';
import Popover from '../components/common/Popover.tsx';
import FormFilterPatient from '../components/Forms/FormFilterPatient.tsx';
import type { PacienteFiltro } from '../types/index.ts';
import FormAppointment from '../components/Forms/FormAppointment.tsx';
import { useNotify } from '../components/Context/NotifyContext';
import { NavLink } from 'react-router-dom';

export default function PacientesPage() {

  const { success, error } = useNotify();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenCita, setIsModalOpenCita] = useState(false);
  const [selectedPacienteId, setSelectedPacienteId] = useState<number | undefined>(undefined);
  const [PagePrompt, setPagePrompt] = useState<PagePrompt>({ pageNumber: 1, pageSize: 10, TotalRecords: 0 });
  const [showFilter, setShowFilter] = useState(false);
  const [filtroPaciente, setFiltroPaciente] = useState<PacienteFiltro>({ Nombre: undefined, Apellido: undefined });

  const clearFilters = () => {
    setFiltroPaciente({ Nombre: undefined, Apellido: undefined });
    getPacientes({ Nombre: undefined, Apellido: undefined });
    setShowFilter(!showFilter)
  };

  const getPacientes = async (filtro?: PacienteFiltro) => {
    try {
      setIsLoading(true);
      const filtroUsar = filtro ? { ...filtroPaciente, ...filtro } : filtroPaciente;

      if (filtro) setFiltroPaciente(filtroUsar);

      const response = await api.get(`/Pacientes`, {
        params: {
          pageNumber: PagePrompt.pageNumber,
          pageSize: PagePrompt.pageSize,
          nombre: filtroUsar.Nombre ?? null,
          apellido: filtroUsar.Apellido ?? null
        },
      });

      setPagePrompt({
        ...PagePrompt,
        TotalRecords: response.data.totalRecords
      });

      setIsLoading(false);
      return setPacientes(response.data.data);

    } catch (err: AxiosError | any) {
      if (err.response?.status === 401) {
        error({ titulo: "Error", descripcion: "Usuario no autorizado" })
      }
      console.error("Error al obtener pacientes:", err);
    }
  };

  useEffect(() => {
    getPacientes();
  }, [PagePrompt.pageNumber]);

  const columnas = [
    { header: 'Nombre Completo', key: 'nombre', render: (p: Paciente) => `${p.nombre} ${p.apellido}` },
    { header: 'Teléfono', key: 'telefono' },
    { header: 'Email', key: 'email' },
    {
      header: "Fecha de Nacimiento",
      key: "fechaNacimiento",
      render: (p: Paciente) => {
        const fecha = new Date((p as any).fechaNacimiento);
        if (fecha.getFullYear() === 1) {
          return <span className="text-gray-400">N/A</span>;
        }
        return fecha.toLocaleDateString();
      }
    },
    {
      header: 'Identificación', key: 'identificacion'
    },
    {
      header: 'Edad', key: 'Edad',
      render: (p: Paciente) => {
        const fechaNacimiento = new Date((p as any).fechaNacimiento);
        const hoy = new Date();
        const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        return edad;
      }
    },
    {
      header: 'Acciones',
      key: 'acciones',
      render: (p: Paciente) => (
        <> 
          <button className="text-blue-600 hover:text-blue-800 font-medium" onClick={() => handleOpenModal(p.id)}><UserPen /></button>
          <button className="ml-4 text-green-600 hover:text-green-800 font-medium" onClick={() => handleOpenModalCita(p.id)}><CalendarClock /></button>
          <NavLink className="ml-4 text-green-600 hover:text-green-800 font-medium" to={`/historialClinico/${p.id}`}>
            <BookUser />
          </NavLink>
        </>
      )
    },
  ];

  //Abre el modal para agregar o editar un paciente
  const handleOpenModal = (id?: number) => {
    setSelectedPacienteId(id);
    setIsModalOpen(!isModalOpen);
  };

  // Abre el modal para gestionar Cita
  const handleOpenModalCita = (id?: number) => {
    setSelectedPacienteId(id);
    setIsModalOpenCita(!isModalOpenCita);
  };

  //Al agregar o editar paciente.
  const handleFormSuccess = (id: number, isEdit: boolean) => {
    setIsModalOpen(!isModalOpen);
    success({
      titulo: "¡Operación exitosa!",
      descripcion: `Paciente ${isEdit ? "actualizado" : "agregado"} correctamente con ID: ${id}`,
    });
    getPacientes();
  }
  
  //Al agregar o editar cita.
  const handleFormSuccessCita = (id: number, isEdit: boolean) => {
    setIsModalOpenCita(!isModalOpenCita);
    success({
      titulo: "¡Operación exitosa!",
      descripcion: `Cita ${isEdit ? "actualizada" : "agregada"} correctamente con ID: ${id}`,
    });
    getPacientes();
  }

  return (
    <div className="relative">

      <Modal isOpen={isModalOpen} onClose={()=>{setIsModalOpen(!isModalOpen)}}
        children={<FormPatient OnSuccess={handleFormSuccess}
          idPaciente={selectedPacienteId} />} />

      <Modal isOpen={isModalOpenCita} onClose={()=>{setIsModalOpenCita(!isModalOpen)}}
        children={<FormAppointment OnSuccess={handleFormSuccessCita} idPaciente={selectedPacienteId} />} />

      <h1 className="text-2xl font-bold text-gray-800 ">Gestión de Pacientes</h1>
      <div className='flex p-2'>
        <button className="flex w-50  items-center justify-between p-2 bg-white border border-slate-200 rounded-3xl
          hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all group"
          onClick={() => handleOpenModal()}>
          <div className="flex items-center gap-3">
            <div className="text-blue-600"><UserRoundPlus className="w-5 h-5" /></div>
            <span className="font-semibold text-slate-700">Nuevo Paciente</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
        </button>   

        <button className="flex w-25 items-center justify-between p-2 bg-white border border-slate-200 rounded-3xl
          hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all group" onClick={() => getPacientes()} >
          <span className="font-semibold text-slate-700">Buscar</span>
          <span className="pl-2 inline-block"><Search size={16} strokeWidth={2.5} /></span>
        </button>

        <div>
          <Popover classChild="flex w-25 items-center justify-between p-2 bg-white border border-slate-200 rounded-3xl
          hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all group font-semibold text-slate-700"
            children={<FormFilterPatient ApplyFilters={getPacientes} filtroActual={filtroPaciente}
              onCancel={clearFilters} />}
            isOpen={showFilter} onToggle={() => setShowFilter(!showFilter)} />

        </div>
      </div>
      <hr className="my-4" />
      <Tabla columns={columnas} data={pacientes} isLoading={isLoading}
        PagePromts={PagePrompt} onPageChange={(page) => setPagePrompt({ ...PagePrompt, pageNumber: page })}
      />
    </div>
  );

};
