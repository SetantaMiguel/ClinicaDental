import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

// Interfaz alineada con el modelo C# serializado
interface MonedaOption {
    idMoneda: number;
    monedaSimbolo: string;
    monedaDescripcion: string;
}

export default function MonedaComboBox({ 
    value,
    onChange,
    isReadOnly = false 
}: { 
    value: number | undefined; 
    onChange: (id: number, simbolo: string) => void 
    isReadOnly: boolean
}) {
    const [monedas, setMonedas] = useState<MonedaOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getMonedas = async () => {
            try {
                setIsLoading(true);
                // Consumiendo el endpoint del MonedasController creado previamente
                const response = await api.get<MonedaOption[]>('/Monedas');
                setMonedas(response.data);
            } catch (error) {
                console.error('Error al cargar monedas:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getMonedas();
    }, []);
    
    useEffect(() => {
        if (monedas.length > 0) {
            // Si no hay valor seleccionado, tomamos la primera moneda por defecto
            if (value === undefined || value === 0) {
                const defaultMoneda = monedas[0];
                onChange(defaultMoneda.idMoneda, defaultMoneda.monedaSimbolo);
                return;
            }
            
            // Aseguramos que la comparación sea con números
            const selectedMoneda = monedas.find(moneda => moneda.idMoneda === Number(value)); 
            
            if (selectedMoneda) {
                // Pasamos el símbolo de la moneda al componente padre
                onChange(selectedMoneda.idMoneda, selectedMoneda.monedaSimbolo);
            }   
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, monedas]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

        const selectedId = Number(e.target.value);
        const opcionSeleccionada = monedas.find(moneda => moneda.idMoneda === selectedId);

        if (opcionSeleccionada) {
            onChange(opcionSeleccionada.idMoneda, opcionSeleccionada.monedaSimbolo);
        }
    };

    return (
        <div className="rounded-xl" >
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                Moneda <span className="text-red-500">*</span>    
            </label>
            <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                disabled={isLoading || isReadOnly}
                value={value ?? ""} 
                onChange={handleSelectChange}                
            >
                <option value="" disabled>
                    {isLoading ? 'Cargando monedas...' : 'Selecciona una moneda'}
                </option>
                
                {monedas.map((moneda) => (
                    <option key={moneda.idMoneda} value={moneda.idMoneda}>
                        {moneda.monedaSimbolo}
                    </option>
                ))}
            </select>
        </div>
    );
}