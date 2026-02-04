import { AxiosError } from "axios";
import { useState,useEffect } from "react";
import api from '../../api/axiosConfig'
import type { Paciente } from "../../types";

interface FormPatientProps {
    OnSuccess : (id: number, bEdicion: boolean) => void;
    idPaciente ?: number;
}
const initialPatient : Paciente = {
    nombre: "",
    telefono: "",
    email: "",
    id: 0,
    apellido:"",
    fechaNacimiento:null
};
export default function  FormPatient({ OnSuccess, idPaciente }: FormPatientProps) {
    
    const [patient,setPatient] = useState<Paciente>(initialPatient);

    const [loading, setLoading] = useState(false);
    const [errorForm, setErrorForm] = useState<string | null>(null);

    const labelName = idPaciente ? "Editar Paciente" : "Nuevo Paciente";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPatient(prevState => ({
            ...prevState,
            [e.target.name]:  e.target.value
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
                // Si fechaNacimiento es un string vacío, enviamos null
                fechaNacimiento: patient.fechaNacimiento === "" ? null : patient.fechaNacimiento
            };  
            
            const { data } = await api[method](url, dataToSend);
            OnSuccess(idPaciente ?? data.id, isEdit);
        } catch (error : AxiosError | any) {
            console.error("Error al guardar paciente:", error);
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
        }   finally {   
            setLoading(false);
        }
    }    

    useEffect(()=>{
        if (idPaciente){
            setLoading(true);
            handleLoadPatient(idPaciente);
            setLoading(false);
        }
    },[idPaciente]);

    return (
        <form onSubmit={handleSubmit} className="p-6 rounded-lg  w-full max-w-md">
            <h2 className="text-lg font-medium mb-4 text-end">{labelName}</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input type="text" 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    name="nombre"
                    value={patient.nombre}
                    onChange={handleChange}
                    required />
            </div>
            <div className="mb-4">  
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input type="text" 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                name="apellido"
                value={patient.apellido}
                onChange={handleChange}
                required />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="text" 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                name="telefono"
                value={patient.telefono}
                onChange={handleChange}
                required />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                name="email"
                value={patient.email}
                onChange={handleChange}
                 />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input type="date" 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                name="fechaNacimiento"
                value={patient.fechaNacimiento? patient.fechaNacimiento : ""}
                onChange={handleChange}
                 />
            </div>
            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition" disabled={loading}>
                Guardar Paciente
            </button>
            <div>
                {errorForm && <p className="mt-4 text-sm text-red-500 bg-red-50 p-2 rounded">{errorForm}</p>}
            </div>
        </form>
    );
}


