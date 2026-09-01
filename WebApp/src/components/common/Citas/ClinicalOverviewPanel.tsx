import {
    Users,
    DollarSign,
    CalendarDays,
    Plus,
    UserPlus,
    FileText,
    ChevronRight
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Modal from '../Modal';
import FormAppointment from '../../Forms/FormAppointment';
import FormPatient from '../../Forms/FormPatient';
import { useNotify } from '../../Context/NotifyContext';
import api from '../../../api/axiosConfig';
import MonthYearPicker from './MonthYearPicker';
import LoadingDental from '../LoadingDental';
import ValidaMesAnterior from './ValidaMesAnterior';
import CitasRecientes from './CitasRecientes';

const formatToYYYYMM = (date: Date) => {
    const year = date.getFullYear();
    // Se suma 1 porque los meses en JavaScript van de 0 a 11
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}${month}`;
};

// Representa cada elemento dentro de la lista de monedas
export interface TotalMoneda {
    idMoneda: number;
    sumaTotal: number;
    moneda: string;
    changeMes: number;
}

// Representa el nodo "Recibo"
export interface ReciboResumen {
    totalMonedas: TotalMoneda[];
}

// Representa el nodo "Citas"
export interface CitasResumen {
    total: number;
    porcentajeCitasMes: number;
}

export interface PacientesResumen {
    total: number;
    porcentajePacientesMes: number;
}

// Interfaz principal que usarás en tu estado (useState)
export interface DashboardResumen {
    citas: CitasResumen;
    recibo: ReciboResumen;    
    pacientes:PacientesResumen;
}


export default function ClinicalOverviewPanel() {
    const { success } = useNotify();
    const [isFormCitaNuevoOpen, setIsFormCitaNuevoOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [anioMes, setAnioMes] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [dashboardData, setDashboardData] = useState<DashboardResumen | null>(null);
    const [isLoading, setIsSetLoading] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    useEffect(() => {
        fechtDat();
    }, [anioMes])

    useEffect(()=>{
       setAnioMes(formatToYYYYMM(selectedDate));
    },[])

    // Dashboard
    const fechtDat = async () => {
        try {

            if(!anioMes) return;
            setIsSetLoading(true);
            const response = await api.get(`/Dashboard/${anioMes}`);
            setDashboardData(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSetLoading(false);
        }

    }

    const handleChangeMonthPicker = (date: Date) => {
        setSelectedDate(date);
        setAnioMes(formatToYYYYMM(date));
    }

    const handleFormSuccess = (id: number, isEdit: boolean) => {
        setIsModalOpen(false);
        success({
            titulo: "¡Operación exitosa!",
            descripcion: `Paciente ${isEdit ? "actualizado" : "agregado"} correctamente con ID: ${id}`,
        });
    }
    return (
        // Contenedor principal simulando el fondo de la pantalla
        <div className="">
            {isLoading ? (
                <div className='p-30'>
                    <LoadingDental isLoading={isLoading} pantallaCompleta={false} />
                </div>
            ) : (
                <div >
                    {/* Cabecera del Panel */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                                Resumen Clínico
                            </h1>
                            <p className="text-slate-500 mt-1 font-medium">
                                Últimos 30 días
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <MonthYearPicker onChange={handleChangeMonthPicker} selectedDate={selectedDate} />
                        </div>
                    </div>

                    {/* ---------------------------------------------------- */}
                    {/* Rejilla de Métricas Principales */}
                    {/* ---------------------------------------------------- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                        {/* Tarjeta 1: Pacientes */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pacientes Atendidos</h3>
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <div className="mb-2">
                                <span className="text-4xl font-bold text-slate-800">{dashboardData?.pacientes.total}</span>
                            </div>
                            <ValidaMesAnterior value={dashboardData?.pacientes.porcentajePacientesMes ?? 0} />
                        </div>

                        {/* Tarjeta 2: Ingresos (Multi-moneda) */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Ingresos Totales</h3>
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <DollarSign className="w-5 h-5 text-emerald-600" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 mb-2">
                                <div className="flex flex-col gap-1 mb-2">
                                    {/* 1. Aseguramos que sea un arreglo, 2. Lo copiamos, 3. Lo ordenamos, 4. Lo mapeamos */}
                                    {[...(dashboardData?.recibo?.totalMonedas || [])]
                                        .sort((a, b) => a.idMoneda - b.idMoneda)
                                        .map((moneda) => (
                                            <div key={moneda.idMoneda} className="flex items-baseline">
                                                <span className="text-lg font-medium text-slate-400 w-8">
                                                    {moneda.moneda}
                                                </span>
                                                <span className="text-2xl pl-1 font-bold text-slate-800 flex items-center gap-2">
                                                    {moneda?.sumaTotal ?? 0}
                                                    {/* Renderizamos tu componente personalizado */}
                                                    <ValidaMesAnterior value={moneda.changeMes} />
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta 3: Citas */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Citas Programadas</h3>
                                <div className="p-2 bg-rose-50 rounded-lg">
                                    <CalendarDays className="w-5 h-5 text-rose-600" />
                                </div>
                            </div>
                            <div className="mb-2">
                                <span className="text-4xl font-bold text-slate-800">{dashboardData?.citas.total}</span>
                            </div>
                            <ValidaMesAnterior value={dashboardData?.citas.porcentajeCitasMes ?? 0} />
                        </div>

                    </div>

                    {/* ---------------------------------------------------- */}
                    {/* Sección Inferior: Acciones y Actividad */}
                    {/* ---------------------------------------------------- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Columna Izquierda: Acciones Rápidas */}
                        <div className="lg:col-span-1">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Acciones Rápidas</h2>
                            <div className="flex flex-col gap-3">
                                <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl 
                                            hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all group"
                                    onClick={() => setIsFormCitaNuevoOpen(true)}>
                                    <div className="flex items-center gap-3">
                                        <div className="text-blue-600"><Plus className="w-5 h-5" /></div>
                                        <span className="font-semibold text-slate-700">Nueva Cita</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                                </button>

                                <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 
                                        hover:border-slate-300 active:bg-slate-100 transition-all group"
                                    onClick={handleOpenModal}>
                                    <div className="flex items-center gap-3">
                                        <div className="text-emerald-600"><UserPlus className="w-5 h-5" /></div>
                                        <span className="font-semibold text-slate-700">Registrar Paciente</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                                </button>

                                <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="text-amber-600"><FileText className="w-5 h-5" /></div>
                                        <span className="font-semibold text-slate-700">Ver Reportes</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                                </button>
                            </div>
                        </div>

                        {/* Columna Derecha: Actividad Reciente */}
                        <div className="lg:col-span-2">
                            <CitasRecientes />
                        </div>

                    </div>
                </div>
            )}
            <Modal isOpen={isFormCitaNuevoOpen} onClose={() => setIsFormCitaNuevoOpen(false)}>
                <FormAppointment OnSuccess={() => setIsFormCitaNuevoOpen(false)} idCita={0} />
            </Modal>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
                children={<FormPatient OnSuccess={handleFormSuccess}
                    idPaciente={0} />} />
        </div>
    );
}