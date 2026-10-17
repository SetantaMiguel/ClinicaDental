import { useEffect, useState } from 'react';

interface FormAppointmentConfigProps {
    ApplyFilters: (config: FilterAppointmentConfig) => void;
    filtroActual: FilterAppointmentConfig;
    onCancel: () => void;
}

export interface FilterAppointmentConfig {
    id?: number;
    nombreCita?: string;
    descripcion?: string;
    precioBase?: number;
    vigente?: boolean;
}
export default function FormFilterCatalogoCita({
    ApplyFilters,
    filtroActual,
    onCancel,
}: FormAppointmentConfigProps) {
    const [nombreCita, setNombreCita] = useState(filtroActual?.nombreCita ?? '');
    const [descripcion, setDescripcion] = useState(filtroActual?.descripcion ?? '');
    const [precioBase, setPrecioBase] = useState(filtroActual?.precioBase?.toString() ?? '');
    const [vigente, setVigente] = useState(filtroActual?.vigente?.toString() ?? '');

    useEffect(() => {
        setNombreCita(filtroActual.nombreCita ?? '');
        setDescripcion(filtroActual.descripcion ?? '');
        setPrecioBase(filtroActual.precioBase?.toString() ?? '');
        setVigente(filtroActual.vigente?.toString() ?? '');
    }, [filtroActual]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        ApplyFilters({
            nombreCita: nombreCita.trim() || undefined,
            descripcion: descripcion.trim() || undefined,
            precioBase: precioBase === '' ? undefined : Number(precioBase),
            vigente: vigente === '' ? undefined : vigente === 'true',
        });
    };

    const inputClassName =
        'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="nombre-cita">
                    Nombre de la cita
                </label>
                <input
                    id="nombre-cita"
                    type="text"
                    className={inputClassName}
                    value={nombreCita}
                    onChange={(event) => setNombreCita(event.target.value)}
                    placeholder="Ej. Consulta General"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="descripcion-cita">
                    Descripción
                </label>
                <textarea
                    id="descripcion-cita"
                    rows={3}
                    className={inputClassName}
                    value={descripcion}
                    onChange={(event) => setDescripcion(event.target.value)}
                    placeholder="Descripción detallada del tipo de cita"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="precio-base">
                    Precio Base
                </label>
                <input
                    id="precio-base"
                    type="number"
                    step="0.01"
                    min="0"
                    className={inputClassName}
                    value={precioBase}
                    onChange={(event) => setPrecioBase(event.target.value)}
                    placeholder="0.00"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="cita-vigente">
                    Estado
                </label>
                <select
                    id="cita-vigente"
                    className={inputClassName}
                    value={vigente}
                    onChange={(event) => setVigente(event.target.value)}
                >
                    <option value="">Todos</option>
                    <option value="true">Vigente</option>
                    <option value="false">Inactivo</option>
                </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                >
                    Limpiar
                </button>
                <button
                    type="submit"
                    className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Aplicar filtros
                </button>
            </div>
        </form>
    );
}