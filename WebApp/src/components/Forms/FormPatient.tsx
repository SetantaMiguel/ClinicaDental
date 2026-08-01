import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import api from '../../api/axiosConfig'
import type { Paciente } from "../../types";


interface FormPatientProps {
    OnSuccess: (id: number, bEdicion: boolean) => void;
    idPaciente?: number;
}

const initialPatient: Paciente = {
    nombre: "",
    telefono: "",
    email: "",
    id: 0,
    apellido: "",
    fechaNacimiento: null,
    identificacion: ""

};

export default function FormPatient({ OnSuccess, idPaciente }: FormPatientProps) {

    const [patient, setPatient] = useState<Paciente>(initialPatient);

    const [loading, setLoading] = useState(false);
    const [errorForm, setErrorForm] = useState<string | null>(null);

    const labelName = idPaciente ? "Editar Paciente" : "Nuevo Paciente";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPatient(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const isEdit = Boolean(idPaciente);
            const url = `Pacientes${isEdit ? `/${idPaciente}` : ""}`;

            const method: 'post' | 'put' = isEdit ? 'put' : 'post';

            const dataToSend = {
                ...patient,
                fechaNacimiento: patient.fechaNacimiento === "" ? null : patient.fechaNacimiento
            };

            const { data } = await api[method](url, dataToSend);
            OnSuccess(idPaciente ?? data.id, isEdit);
        } catch (error: AxiosError | any) {
            //console.error("Error al guardar paciente:", error);
            setErrorForm(error.response?.data.message || 'Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    }

    const handleLoadPatient = async (id: number) => {
        try {
            setLoading(true);

            const response = await api.get(`Pacientes/${id}`);
            const data = response.data;

            setPatient({
                nombre: data.nombre,
                apellido: data.apellido,
                telefono: data.telefono,
                email: data.email,
                fechaNacimiento: data.fechaNacimiento ? data.fechaNacimiento : null,
                id: data.id
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
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-white p-8 rounded-2xl transition-all"
        >
            {/* Encabezado del Formulario */}
            <div className="mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                    {labelName || "Registro de Paciente"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                    Ingresa la información personal para actualizar o registrar un nuevo paciente.
                </p>
            </div>

            <div className="space-y-4">
                {/* Fila 1: Nombre y Apellido */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={patient.nombre}
                            onChange={handleChange}
                            placeholder="Ej. María"
                            required
                            className="w-full px-3.5 py-2.5 bg-gray-50/50 text-gray-800 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                            Apellido <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="apellido"
                            value={patient.apellido}
                            onChange={handleChange}
                            placeholder="Ej. González"
                            required
                            className="w-full px-3.5 py-2.5 bg-gray-50/50 text-gray-800 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Fila 2: Teléfono y Fecha de Nacimiento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                            Teléfono <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="telefono"
                            value={patient.telefono}
                            onChange={handleChange}
                            placeholder="+505 8888 8888"
                            required
                            className="w-full px-3.5 py-2.5 bg-gray-50/50 text-gray-800 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                            Fecha de Nacimiento
                        </label>
                        <input
                            type="date"
                            name="fechaNacimiento"
                            value={patient.fechaNacimiento ? patient.fechaNacimiento.toString().substring(0, 10) : ""}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 bg-gray-50/50 text-gray-800 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all text-gray-600"
                        />
                    </div>
                </div>

                {/* Fila 3: Email */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={patient.email}
                        onChange={handleChange}
                        placeholder="ejemplo@correo.com"
                        className="w-full px-3.5 py-2.5 bg-gray-50/50 text-gray-800 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all placeholder:text-gray-400"
                    />
                </div>

                {/* Fila 4: Identificación */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                        Identificación / Cédula
                    </label>
                    <input
                        type="text"
                        name="identificacion"
                        value={patient.identificacion ?? ""}
                        onChange={handleChange}
                        placeholder="001-000000-0000A"
                        className="w-full px-3.5 py-2.5 bg-gray-50/50 text-gray-800 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Mensaje de Error */}
            {errorForm && (
                <div className="mt-5 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2">
                    <span className="text-red-500 text-sm font-medium">{errorForm}</span>
                </div>
            )}

            {/* Botón de Envío */}
            <div className="mt-8">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        "Guardar Paciente"
                    )}
                </button>
            </div>
        </form>

    );
}


