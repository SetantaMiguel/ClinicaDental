import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

interface CatalogoCitaOption {
    id: number;
    nombreCita: string;
    descripcion?: string;
    vigente: boolean;
}

export default function TipoCitaComboBox({ 
    value,
    onChange 
}: { 
    value: number[]; 
    onChange: (ids: number[], nombresCita: string[]) => void 
}) {
    const [tiposCita, setTiposCita] = useState<CatalogoCitaOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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
                <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-slate-300 bg-white p-3">
                    {isLoading ? (
                        <p className="text-sm text-slate-500">Cargando tipos de cita...</p>
                    ) : tiposCita.length === 0 ? (
                        <p className="text-sm text-slate-500">No hay tipos de cita disponibles.</p>
                    ) : tiposCita.map((tipo) => (
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
                <p className="mt-1 text-xs text-slate-500">Puedes seleccionar uno o varios tipos.</p>
            </fieldset>
        </div>
    );
}