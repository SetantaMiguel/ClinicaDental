import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    ChevronLeft, Edit2, Phone, Mail,
    Check,
    Clock,
} from 'lucide-react';
import type { PacienteHistory } from '../types';
import api from '../api/axiosConfig';
import LoadingDental from '../components/common/LoadingDental';
import { NavLink } from 'react-router-dom';
import { useNotify } from '../components/Context/NotifyContext';
import Modal from '../components/common/Modal';
import FormPatient from '../components/Forms/FormPatient';

const initialPatient: PacienteHistory = {
    nombre: "",
    telefono: "",
    email: "",
    id: 0,
    apellido: "",
    fechaNacimiento: null,
    identificacion: "",
    montoPago: 0,
    fechaCreacion: null,
    lastCita: null
};

const obtenerColorEstado = (codigo: string) => {
    switch (codigo) {
        case 'A': return 'bg-green-100 text-green-700 border-green-200'; // Atendido
        case 'P': return 'bg-blue-100 text-blue-700 border-blue-200'; // Pendiente
        case 'C': return 'bg-red-100 text-red-700 border-red-200'; // Cancelado
        case 'R': return 'bg-orange-100 text-orange-700 border-orange-200'; // Reagendado
        default: return 'bg-gray-100 text-gray-700 border-gray-200'; // Desconocido
    }
};

export default function ClinicalHistory() {

    const { success } = useNotify();
    const [activeTab, setActiveTab] = useState('evolución');
    const [patient, setPatient] = useState<PacienteHistory>(initialPatient);
    const [loading, setLoading] = useState<boolean>(false);
    const { id: id } = useParams<{ id: string }>();
    const idPaciente = id ? parseInt(id) : 0;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFormSuccess = (id: number, isEdit: boolean) => {
        setIsModalOpen(!isModalOpen);
        success({
            titulo: "¡Operación exitosa!",
            descripcion: `Paciente ${isEdit ? "actualizado" : "agregado"} correctamente con ID: ${id}`,
        });
        handleLoadPatient(idPaciente);
    }
    const handleLoadPatient = async (id: number) => {
        try {
            setLoading(true);

            const response = await api.get(`Pacientes/historial/${id}`);
            const data = response.data;
            console.log("Datos del paciente cargados:", data);

            const mappedEvents = data.citas?.map((cita: any) => {
                return {
                    id: cita.id,
                    estadoCitaCodigo: cita.estadoCitaCodigo,
                    estadoCitaDescripcion: cita.estadoCitaDescripcion,
                    fechaInicio: cita.fechaInicio,
                    fechaFin: cita.fechaFin,
                    observaciones: cita.observaciones,
                    tipoCitaNombre: cita.tipoCitaNombre,
                    citaRecibo: cita.citaRecibo
                };
            }).sort((a: any, b: any) => {
                return new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime();
            });

            console.log("Citas mapeadas:", mappedEvents);

            setPatient({
                nombre: data.nombre,
                apellido: data.apellido,
                telefono: data.telefono,
                email: data.email,
                fechaNacimiento: data.fechaNacimiento ? data.fechaNacimiento : null,
                id: data.id,
                identificacion: data.identificacion ? data.identificacion : null,
                fechaCreacion: data.fIngreso ? data.fIngreso : null,
                lastCita: data.lastCitaDate ? data.lastCitaDate : null,
                montoPago: data.montoTotalPago,
                citas: mappedEvents
            });

        } catch (error) {
            console.error("Error al cargar paciente:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (idPaciente) {
            setLoading(true);
            handleLoadPatient(idPaciente);
            setLoading(false);
        }
    }, [idPaciente]);
    return (
        <div className="">
            <LoadingDental isLoading={loading} />

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto">
                <div className="">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <NavLink className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium mb-2" to="/pacientes">
                                <ChevronLeft className="w-4 h-4 mr-1" /> Volver a Pacientes
                            </NavLink>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-slate-900">Historial Clínico: {patient.nombre} {patient.apellido}</h1>
                                <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></div>
                                    {patient.id}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                                ID: {patient.id} • Cédula: {patient.identificacion} • Última visita: {patient.lastCita ? new Date(patient.lastCita).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="flex items-center px-4 py-2 bg-white border border-slate-300
                             rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium transition" onClick={() => setIsModalOpen(!isModalOpen)}>
                                <Edit2 className="w-4 h-4 mr-2" /> Editar Datos
                            </button>
                            {/*<button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium transition">
                                <Printer className="w-4 h-4 mr-2" /> Imprimir Ficha
                            </button>
                            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition shadow-sm shadow-blue-200">
                                <Plus className="w-4 h-4 mr-2" /> Nueva Evolución / Cita
                            </button>*/}
                        </div>
                    </div>

                    {/* Info Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Datos Personales */}
                        <div className="p-5 border-b md:border-b-0 md:border-r border-slate-200">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Datos Personales</h3>
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">ME</div>
                                <div>
                                    <p className="font-semibold text-slate-900 text-sm">{patient.nombre} {patient.apellido}</p>
                                    <p className="flex items-center text-xs text-slate-500 mt-1"><Phone className="w-3 h-3 mr-1" /> {patient.telefono}</p>
                                    <p className="flex items-center text-xs text-slate-500 mt-1"><Mail className="w-3 h-3 mr-1" /> {patient.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Alergias */}
                        {/* 
                        <div className="p-5 border-b md:border-b-0 md:border-r border-slate-200">
                            <h3 className="text-xs font-semibold text-red-500 flex items-center uppercase tracking-wider mb-3">
                                <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Alergias Medicamentosas
                            </h3>
                            <div className="bg-red-50 text-red-700 px-3 py-1.5 rounded-md text-sm font-medium inline-flex items-center border border-red-100">
                                <AlertTriangle className="w-4 h-4 mr-1.5" /> Penicilina (Anafilaxia)
                            </div>
                            <p className="text-xs text-slate-500 mt-2">No administrar betalactámicos bajo ninguna vía.</p>
                        </div> 
                        */}

                        {/* Condición Médica */}
                        {/* 
                        <div className="p-5 border-b md:border-b-0 md:border-r border-slate-200">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Condición Médica</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Tipo de Sangre:</span>
                                    <span className="font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{patientInfo.bloodType}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">Antecedentes:</span>
                                    <span className="font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-xs text-right leading-tight">
                                        Hipertensión<br />(Controlada)
                                    </span>
                                </div>
                            </div>
                        </div> 
                        */}

                        {/* Especialista */}
                        <div className="p-5 ">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Especialista Asignado</h3>
                            <p className="text-sm font-semibold text-slate-900"></p>
                            <p className="text-xs text-slate-500"></p>
                            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-sm">
                                <span className="text-slate-500">Saldo pendiente:</span>
                                <span className="font-semibold text-slate-900">{patient.montoPago.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    {/* Navigation Tabs */}
                    <div className="border-b border-slate-200">
                        <nav className="flex space-x-8">
                            {['Evolución y Tratamientos'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${activeTab === tab.toLowerCase().split(' ')[0]
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                        }`}
                                >
                                    {tab === 'Evolución y Tratamientos' && <Clock className="w-4 h-4" />}
                                    {tab === 'Radiografías y Documentos' && <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-xs ml-1">2</span>}
                                    <span>{tab}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Layout: Timeline (Left) + Widgets (Right) */}
                    <div className="flex flex-col lg:flex-row gap-6">

                        {/* Timeline Column */}
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center">
                                    Registro de Evolución Odontológica
                                    <span className="ml-3 bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">{patient.citas?.length || 0} Registros</span>
                                </h2>
                                {/* <div className="flex items-center text-sm text-slate-500">
                                    <span className="mr-2">Filtrar por año:</span>
                                    <select className="border border-slate-300 rounded-md py-1 px-2 text-slate-700 bg-white">
                                        <option>2026 (Todos)</option>
                                    </select>
                                </div> */}
                            </div>

                            <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-8">
                                {patient.citas?.map((item) => (
                                    <div key={item.id} className="relative pl-8">
                                        {/* Timeline Dot */}
                                        <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-blue-400"></div>

                                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <div className="flex items-center space-x-3 mb-1">
                                                        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Cita #{item.id}</span>
                                                        <span className="text-sm text-slate-500">{item.fechaInicio}</span>
                                                    </div>
                                                    <h3 className="text-base font-bold text-slate-900">{item.tipoCitaNombre}</h3>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-flex items-center ${obtenerColorEstado(item.estadoCitaCodigo)} text-xs
                                                         font-medium px-2 py-1 rounded-md border border-emerald-100 mb-1`}>
                                                        <Check className="w-3 h-3 mr-1" /> {item.estadoCitaDescripcion}
                                                    </span>
                                                    <p className="font-bold text-slate-900 text-sm">{item.citaRecibo?.montoNeto || 0}</p>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 mb-4 space-y-3">
                                                <p><span className="font-semibold text-slate-900">Observación:</span> {item.observaciones}</p>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(!isModalOpen) }}
                children={<FormPatient OnSuccess={handleFormSuccess}
                    idPaciente={idPaciente} />} />
        </div>
    );
}