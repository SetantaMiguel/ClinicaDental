import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axiosConfig';

interface CatalogoCitaOption {
    id: number;
    nombreCita: string;
    descripcion?: string;
    vigente: boolean;
}

// Normaliza texto: minúsculas y sin acentos, para búsquedas más flexibles
const normalizar = (texto: string) =>
    texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

export default function TipoCitaComboBox({ 
    value,
    onChange 
}: { 
    value: number[]; 
    onChange: (ids: number[], nombresCita: string[]) => void 
}) {
    const [tiposCita, setTiposCita] = useState<CatalogoCitaOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        const getTiposCita = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/CatalogoCita/Vigentes');
                setTiposCita(response.data);
            } catch (error) {
                console.error('Error al cargar tipos de cita:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getTiposCita();
    }, []);

    useEffect(() => {
        if (tiposCita.length > 0 && value.length > 0) {
            const nombresSeleccionados = tiposCita
                .filter((tipo) => value.includes(tipo.id))
                .map((tipo) => tipo.nombreCita);
            onChange(value, nombresSeleccionados);
        }
    }, [onChange, tiposCita, value]);

    // Lista filtrada según el texto de búsqueda
    const tiposFiltrados = useMemo(() => {
        const termino = normalizar(busqueda.trim());
        if (!termino) return tiposCita;
        return tiposCita.filter((tipo) =>
            normalizar(tipo.nombreCita).includes(termino)
        );
    }, [tiposCita, busqueda]);

    const handleTipoCitaChange = (id: number, isSelected: boolean) => {
        const selectedIds = isSelected
            ? [...value, id]
            : value.filter((selectedId) => selectedId !== id);
        const nombresSeleccionados = tiposCita
            .filter((tipo) => selectedIds.includes(tipo.id))
            .map((tipo) => tipo.nombreCita);
        onChange(selectedIds, nombresSeleccionados);
    };

    return (
        <div className="rounded-xl ">
            <fieldset disabled={isLoading}>
                <legend className="mb-2 block text-sm font-semibold text-slate-700">
                    Tipos de cita <span className="text-red-500">*</span>
                </legend>

                {/* Buscador */}
                <div className="relative mb-2">
                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar tipo de cita..."
                        aria-label="Buscar tipo de cita"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {busqueda && (
                        <button
                            type="button"
                            onClick={() => setBusqueda('')}
                            aria-label="Limpiar búsqueda"
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className="max-h-30 space-y-2 overflow-y-auto rounded-lg border border-slate-300 bg-white p-3">
                    {isLoading ? (
                        <p className="text-sm text-slate-500">Cargando tipos de cita...</p>
                    ) : tiposCita.length === 0 ? (
                        <p className="text-sm text-slate-500">No hay tipos de cita disponibles.</p>
                    ) : tiposFiltrados.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No se encontraron resultados para "{busqueda}".
                        </p>
                    ) : tiposFiltrados.map((tipo) => (
                        <label key={tipo.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                            <input
                                type="checkbox"
                                checked={value.includes(tipo.id)}
                                onChange={(event) => handleTipoCitaChange(tipo.id, event.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            {tipo.nombreCita}
                        </label>
                    ))}
                </div>

                <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <p>Puedes seleccionar uno o varios tipos.</p>
                    {value.length > 0 && (
                        <p className="font-medium text-blue-600">
                            {value.length} seleccionado{value.length !== 1 && 's'}
                        </p>
                    )}
                </div>
            </fieldset>
        </div>
    );
}