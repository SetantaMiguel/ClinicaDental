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
    value: number | undefined; 
    // Actualizamos el onChange para que envíe el ID y el texto
    onChange: (id: number, nombreCita: string) => void 
}) {
    const [tiposCita, setTiposCita] = useState<CatalogoCitaOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getTiposCita = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/CatalogoCita');
                setTiposCita(response.data);
            } catch (error) {
                console.error('Error al cargar tipos de cita:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getTiposCita();
    }, []);

    // Función modificada para buscar el texto antes de enviarlo
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value);
        
        // Buscamos la opción completa dentro del arreglo tiposCita
        const opcionSeleccionada = tiposCita.find(tipo => tipo.id === selectedId);

        // Si la encontramos, ejecutamos onChange enviando ambos datos
        if (opcionSeleccionada) {
            onChange(opcionSeleccionada.id, opcionSeleccionada.nombreCita);
        }
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tipo de cita
            </label>
            <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                disabled={isLoading}
                value={value || ""} 
                onChange={handleSelectChange}
            >
                <option value="" disabled>
                    {isLoading ? 'Cargando tipos de cita...' : 'Selecciona un tipo'}
                </option>
                
                {tiposCita.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                        {tipo.nombreCita}
                    </option>
                ))}
            </select>
        </div>
    );
}