import { useState,useEffect } from 'react';
import type { PacienteFiltro } from '../../types';

interface FormFilterPatientProps {
    ApplyFilters : (filtro: PacienteFiltro) => void;
    filtroActual: PacienteFiltro;
    onCancel: () => void;    
}

export default function FormFilterPatient({ ApplyFilters, filtroActual, onCancel }: FormFilterPatientProps) {
    const [filterNombre, setFilterNombre] = useState(filtroActual.Nombre ?? "");
    const [filterApellido, setFilterApellido] = useState(filtroActual.Apellido ?? "");

    useEffect(() => {
        setFilterNombre(filtroActual.Nombre ?? "");
        setFilterApellido(filtroActual.Apellido ?? "");
    }, [filtroActual]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const nuevosFiltros: PacienteFiltro = {
            Nombre: filterNombre.trim() === "" ? undefined : filterNombre.trim(),
            Apellido: filterApellido.trim() === "" ? undefined : filterApellido.trim()
        };
        
        ApplyFilters(nuevosFiltros);
    };
    return (
    <>
        <form
            onSubmit={handleSubmit}
            >
            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={filterNombre}
                onChange={e => setFilterNombre(e.target.value)}
                placeholder="Nombre del paciente"
                />
            </div>
            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={filterApellido}
                onChange={e => setFilterApellido(e.target.value)}
                placeholder="Apellido del paciente"
                min="0"
                />
            </div>
            <div className="flex justify-end gap-2">
                <button
                type="button"
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => onCancel()}
                >
                Limpiar
                </button>
                <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                Aplicar
                </button>
            </div>
        </form>
    </>
    );
}