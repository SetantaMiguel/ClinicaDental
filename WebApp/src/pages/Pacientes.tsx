import Tabla from '../components/general/Table';
import { useState, useEffect } from 'react';
import Modal from '../components/general/Modal';
import FormPatient from '../components/Forms/FormPatient';
import Notify from '../components/general/Notify';
import type { Paciente,PagePrompt,notifyMessage } from '../types/index.ts';
import { UserRoundPlus, Search, UserPen, Eye }  from 'lucide-react';
import api from '../api/axiosConfig.ts';
import { AxiosError } from 'axios';

export default function PacientesPage() {

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState<notifyMessage>({ titulo: "", descripcion: "",isOpen: false,tipo:"success",position:"bottom-right",onClose(){} });
  const [selectedPacienteId, setSelectedPacienteId] = useState<number | undefined>(undefined);
  const [PagePrompt, setPagePrompt] = useState<PagePrompt>({ pageNumber: 1, pageSize: 5, TotalRecords: 0 });


  const getPacientes = async (page: number) => {
    try {
      setPagePrompt({ ...PagePrompt, pageNumber: page });
      setIsLoading(true);
      
      const response = await api.get(`/Pacientes?pageNumber=${PagePrompt.pageNumber}&pageSize=${PagePrompt.pageSize}`);
     
      setPagePrompt({
        ...PagePrompt,
        TotalRecords: response.data.totalRecords
      });

      setIsLoading(false);
      return setPacientes(response.data.data); 

    } catch (error : AxiosError | any)  {
      if(error.response?.status === 401) {
          setNotifyMessage({...notifyMessage, titulo:"Error", descripcion:"Usuario no autorizado", isOpen:true,tipo:"error"}) 
      }   
      console.error("Error al obtener pacientes:", error);
      //throw error;
    }
  };

  useEffect(() => {
    getPacientes(PagePrompt.pageNumber);
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
        if (fecha.getFullYear() === 1 ){
          return <span className="text-gray-400">N/A</span>;
        } 
        return fecha.toLocaleDateString();
      }
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
      render: (p : Paciente) => (
        <>
          <button className="text-blue-600 hover:text-blue-800 font-medium" onClick={() => handleOpenModal(p.id)}><UserPen /></button>
          <button className="ml-4 text-green-600 hover:text-green-800 font-medium"><Eye /></button>
        </>
      ) 
    },
  ];
  
  // Uso del Modal
  const handleOpenModal = (id?:number) => {
    setSelectedPacienteId(id);        
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  }
  
  const handleFormSuccess = (id: number, isEdit: boolean) => {
      handleCloseModal();
      setNotifyMessage({ titulo: "¡Operación exitosa!",
            descripcion: `Paciente ${isEdit ? "actualizado" : "agregado"} correctamente con ID: ${id}`,
            isOpen: true,
            tipo:"success" });
      getPacientes(PagePrompt.pageNumber);
  }

  return (
    <div className="p-6">
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} children={<FormPatient OnSuccess={handleFormSuccess} idPaciente={selectedPacienteId} />}  />
      <Notify 
            descripcion={notifyMessage.descripcion} 
            titulo={notifyMessage.titulo}
            tipo={notifyMessage.tipo}
            position={notifyMessage.position}
            isOpen={notifyMessage.isOpen}
            onClose={() => setNotifyMessage({...notifyMessage, isOpen: false})} />

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Pacientes</h1>
      <button className="
                  mt-4 mr-2 px-4 py-2  bg-blue-600 text-white shadow-md
                 rounded-lg hover:bg-blue-700 transition
                 " onClick={() => getPacientes(PagePrompt.pageNumber)} >
          Buscar
          <span className="ml-2 pt-1 inline-block"><Search size={16}  strokeWidth={2.5}  /></span>
      </button>
      <button className='mt-4 mr-2 px-4 py-2 bg-blue-600 text-white shadow-md rounded-lg hover:bg-blue-700 transition'
        onClick={() => handleOpenModal(undefined)}>
            Agregar Paciente
            <span className="ml-2 pt-1 inline-block"><UserRoundPlus size={16}  strokeWidth={2.5}  /></span>
      </button>
      <hr className="my-4"/>
      <Tabla columns={columnas} data={pacientes} isLoading={isLoading} 
            PagePromts={PagePrompt} onPageChange={(page) => setPagePrompt({...PagePrompt, pageNumber: page})}
             />
    </div>
  );
};
