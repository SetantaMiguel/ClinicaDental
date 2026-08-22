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
  onChange: (id: number, nombre: string) => void;
}

interface BuscarPacientesParams {
  id?: number;
  nombre?: string;
}

export default function PacienteComboBox({ value, valueText, onChange }: PacienteComboBoxProps) {
  const [pacientes, setPacientes] = useState<PacienteOption[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (valueText) {
      setQuery(valueText);
      return;
    }

    if (value && value !== 0) {
      setQuery(value.toString());
    }
  }, [valueText, value]);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setPacientes([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    const querySinPrefijo = trimmedQuery.startsWith('#') ? trimmedQuery.slice(1).trim() : trimmedQuery;
    const parsedId = Number(querySinPrefijo);
    const esNumero = querySinPrefijo !== '' && !isNaN(parsedId);

    if (!esNumero && querySinPrefijo.length < 4) {
      setPacientes([]);
      setIsOpen(false);
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
          queryParams.nombre = querySinPrefijo;
        }

        const response = await api.get('/Pacientes/buscar', {
          params: esNumero ? { id: queryParams.id } : { nombre: queryParams.nombre }
        });

        const resultados = response.data ?? [];
        setPacientes(resultados);

        if (esNumero && resultados.length > 0) {
          const pacienteSeleccionado = resultados[0];
          const nombreCompleto = `${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellido}`;
          setIsOpen(false);
          setQuery(nombreCompleto);
          onChange(pacienteSeleccionado.id, nombreCompleto);
          return;
        }

        setIsOpen(true);
      } catch (error) {
        console.error('Error al consultar pacientes:', error);
        setPacientes([]);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, onChange]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setQuery(text);

    if (!text.trim()) {
      onChange(0, '');
      setPacientes([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (paciente: PacienteOption) => {
    const nombreCompleto = `${paciente.nombre} ${paciente.apellido}`;
    setIsOpen(false);
    onChange(paciente.id, nombreCompleto);
    setQuery(nombreCompleto);
  };

  return (
    <div className="relative rounded-xl ">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Paciente <span className="text-red-500">*</span>
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