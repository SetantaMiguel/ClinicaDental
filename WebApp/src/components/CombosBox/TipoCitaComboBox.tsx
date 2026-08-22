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
    onChange: (id: number, nombreCita: string) => void 
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
        if (tiposCita.length > 0) {
            if (value === undefined || value === 0) {
                const defaultTipo = tiposCita[0];
                onChange(defaultTipo.id, defaultTipo.nombreCita);
                return;
            }
            // Aseguramos que la comparación sea con números por si el padre manda un string por error
            const selectedTipo = tiposCita.find(tipo => tipo.id === Number(value)); 
            
            if (selectedTipo) {
                // Le pasamos el nombre de la cita al componente padre para que sincronice su estado
                onChange(selectedTipo.id, selectedTipo.nombreCita);
            }   
        }
    }, [value, tiposCita]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value);
        const opcionSeleccionada = tiposCita.find(tipo => tipo.id === selectedId);

        if (opcionSeleccionada) {
            onChange(opcionSeleccionada.id, opcionSeleccionada.nombreCita);
        }
    };

    return (
        <div className="rounded-xl ">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tipo de cita <span className="text-red-500">*</span>    
            </label>
            <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                disabled={isLoading}
                // Cambié 'value || ""' por 'value ?? ""' para que acepte el número 0 si alguna vez existe un id 0
                value={value ?? ""} 
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