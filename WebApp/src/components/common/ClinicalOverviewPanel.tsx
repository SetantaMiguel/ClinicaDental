import {
    MoreVertical,
    Users,
    DollarSign,
    CalendarDays,
    TrendingUp,
    TrendingDown,
    Plus,
    UserPlus,
    FileText,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import Modal from './Modal';
import FormAppointment from '../Forms/FormAppointment';
import FormPatient from '../Forms/FormPatient';
import { useNotify } from '../Context/NotifyContext';
import api from '../../api/axiosConfig'; 
import { NavLink } from 'react-router-dom';

export default function ClinicalOverviewPanel() {
    const [isFormCitaNuevoOpen, setIsFormCitaNuevoOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
      const { success } = useNotify();

    const fechtDat  = async () => {
        try {
            
        } catch (error) {
            
        }

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

            {/* Tarjeta Principal (Superficie Material) */}
            <div className="">

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
                        <div className="w-12 h-12 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                            DR
                        </div>
                        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                            <MoreVertical className="w-6 h-6" />
                        </button>
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
                            <span className="text-4xl font-bold text-slate-800">456</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <span className="flex items-center text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                                <TrendingUp className="w-4 h-4 mr-1" /> +5%
                            </span>
                            <span className="text-slate-400 ml-2">vs. mes anterior</span>
                        </div>
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
                            <div className="flex items-baseline">
                                <span className="text-lg font-medium text-slate-400 w-8">$</span>
                                <span className="text-2xl font-bold text-slate-800">24,500</span>
                            </div>
                            <div className="flex items-baseline">
                                <span className="text-lg font-medium text-slate-400 w-8">C$</span>
                                <span className="text-2xl font-bold text-slate-800">980,000</span>
                            </div>
                        </div>
                        <div className="flex items-center text-sm pt-2 border-t border-slate-50 mt-1">
                            <span className="flex items-center text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                                <TrendingUp className="w-4 h-4 mr-1" /> +8%
                            </span>
                            <span className="text-slate-400 ml-2">vs. mes anterior</span>
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
                            <span className="text-4xl font-bold text-slate-800">1,200</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <span className="flex items-center text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-md">
                                <TrendingDown className="w-4 h-4 mr-1" /> -2%
                            </span>
                            <span className="text-slate-400 ml-2">vs. mes anterior</span>
                        </div>
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
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-800">Actividad Reciente</h2>
                            <NavLink className="text-sm font-semibold text-blue-600 hover:text-blue-700" to='/citas'> Ver todo</NavLink>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <ul className="divide-y divide-slate-100">
                                {/* Item 1 */}
                                <li className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">MG</div>
                                        <div>
                                            <p className="font-semibold text-slate-800">María González</p>
                                            <p className="text-sm text-slate-500">Cita de seguimiento • 09:15 AM</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
                                </li>

                                {/* Item 2 */}
                                <li className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">JP</div>
                                        <div>
                                            <p className="font-semibold text-slate-800">Juan Pérez</p>
                                            <p className="text-sm text-slate-500">Nuevo registro • 10:00 AM</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
                                </li>

                                {/* Item 3 */}
                                <li className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">RD</div>
                                        <div>
                                            <p className="font-semibold text-slate-800">Roberto Díaz</p>
                                            <p className="text-sm text-slate-500">Pago registrado • 11:30 AM</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
            <Modal isOpen={isFormCitaNuevoOpen} onClose={() => setIsFormCitaNuevoOpen(false)}>
                <FormAppointment OnSuccess={() => { }} idCita={0} />
            </Modal>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
                children={<FormPatient OnSuccess={handleFormSuccess}
                    idPaciente={0} />} />
        </div>
    );
}