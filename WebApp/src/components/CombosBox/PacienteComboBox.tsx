import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

interface PacienteOption {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
}

interface PacienteComboBoxProps {
  value?: number;
  valueText?: string;
  onChange: (id: number) => void;
}

interface BuscarPacientesParams {
  id?: number;
  nombre?: string;
}

export default function PacienteComboBox({ value, valueText , onChange }: PacienteComboBoxProps) {
  const [pacientes, setPacientes] = useState<PacienteOption[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<PacienteOption | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Sincronizar el valor inicial o externo si se provee un ID
  useEffect(() => {
    if (!value) {
      setSelectedPaciente(null);
      return;
    }
    // Opcional: Si el paciente seleccionado no está en la lista actual, 
    // podrías hacer un fetch específico por ID si la API lo requiere.
  }, [value]);

  // Manejo de la búsqueda remota con Debounce
  useEffect(() => {
    const trimmedQuery = query.trim();
    const parsedId = Number(trimmedQuery);
    const esNumero = !isNaN(parsedId) && trimmedQuery.trim() !== '';

    // Si tiene menos de 4 letras, limpiamos la lista de sugerencias y no consultamos
    if (trimmedQuery.length < 4 && esNumero === false || value != 0) {
      setPacientes([]);
      setIsLoading(false);
      return;
    }
    

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const queryParams: BuscarPacientesParams = {};

        if (esNumero) {
          queryParams.id = parsedId;
        } else {
          queryParams.nombre = trimmedQuery;
        }

        const response = await api.get('/Pacientes/buscar', {
            params: esNumero ? { id: queryParams.id } : { nombre: queryParams.nombre }
        });

        setPacientes(response.data ?? []);
        setIsOpen(true);
      } catch (error) {
        console.error('Error al consultar pacientes:', error);
        setPacientes([]);
      } finally {
        setIsLoading(false);
      }
    }, 400); // Espera 400ms después de que el usuario deja de escribir

    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setQuery(text);

    if (value !== 0) {
      onChange(0); // Reseteamos el valor si el usuario empieza a escribir
    }

    // Si el usuario borra el texto, reseteamos la selección
    if (!text.trim() ) {
      setSelectedPaciente(null);
      onChange(0);
      setPacientes([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (paciente: PacienteOption) => {
    value=paciente.id;
    valueText = `${paciente.nombre} ${paciente.apellido}`;
    setIsOpen(false);
    setSelectedPaciente(paciente);
    onChange(paciente.id);
    setQuery(`${paciente.nombre} ${paciente.apellido}`);
  };

  return (
    <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-4">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Paciente *
      </label>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim().length >= 1 && setIsOpen(true)}
          placeholder="Escribe al menos 4 letras para buscar..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {isLoading && (
          <div className="absolute right-3 top-2.5 text-xs text-slate-400">
            Cargando...
          </div>
        )}
      </div>

      {/* Indicador visual de caracteres mínimos */}
      { query.trim().length < 1 && pacientes.length === 0 && (
        <p className="mt-1 text-xs text-slate-500">
          Ingresa al menos 4 caracteres para iniciar la búsqueda.
        </p>
      )}
 
      {/* Lista desplegable de opciones */}
      {isOpen && pacientes.length > 0 && (
        <ul className="absolute left-4 right-4 z-10 mt-1 max-h-44 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {pacientes.map((paciente) => (
            <li key={paciente.id}>
              <button
                type="button"
                onClick={() => handleSelect(paciente)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <span>
                  {paciente.nombre} {paciente.apellido}
                </span>
                <span className="text-xs text-slate-400">#{paciente.id}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Estado cuando no existen resultados */}
      {isOpen && pacientes.length === 0 && value === 0 && (
        <div className="absolute left-4 right-4 z-10 mt-1 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-500 shadow-lg">
          No se encontraron pacientes con ese criterio.
        </div>
      )}

    </div>
  );
}