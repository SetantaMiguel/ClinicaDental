import { useState, useRef, useEffect } from 'react';
import api from '../../api/axiosConfig';

const inputClassName =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
interface TipoCitaOption {
  id: number;
  nombreCita: string;
}
interface TipoCitaSelectProps {
  value: number;
 onChange: (value: number) => void;
}

export default function TipoCitaSelect({ value, onChange }: TipoCitaSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [tiposCita, setTiposCita] = useState<TipoCitaOption[]>([]);

  useEffect(() => {
    const cargarTiposCita = async () => {
      try {
        const response = await api.get('/CatalogoCita/Vigentes');
        setTiposCita(response.data);
      } catch (error) {
        console.error('Error al cargar tipos de cita:', error);
      }
    };
    cargarTiposCita();
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);    
  }, []);

  const seleccionado = tiposCita.find((t) => t.id === value);

  const elegir = (id: number | null) => {
    if (id === null) id = 0;
    onChange(id);
    setOpen(false);
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="cita-tipo">
        Tipo de cita
      </label>

      <div ref={ref} className="relative">
        <button
          id="cita-tipo"
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`${inputClassName} flex items-center justify-between text-left`}
        >
          <span>{seleccionado ? seleccionado.nombreCita : 'Todos los tipos'}</span>
          <span className="ml-2 text-slate-400">▾</span>
        </button>

        {open && (
          <ul
            className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          >
            <li
              onClick={() => elegir(0)}
              className="cursor-pointer px-3 py-2 text-sm text-slate-700 hover:bg-blue-50"
            >
              Todos los tipos
            </li>
            {tiposCita.map((tipo) => (
              <li
                key={tipo.id}
                onClick={() => elegir(tipo.id)}
                className={`cursor-pointer px-3 py-2 text-sm hover:bg-blue-50 ${
                  tipo.id === value
                    ? 'bg-blue-50 font-medium text-blue-700'
                    : 'text-slate-700'
                }`}
              >
                {tipo.nombreCita}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}