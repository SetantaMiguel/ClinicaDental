import { useEffect, useState } from 'react';
import { Banknote, CreditCard, DollarSign, Landmark } from 'lucide-react';
import api from '../../api/axiosConfig';
import { useNotify } from '../Context/NotifyContext';
import MonedaComboBox from "../CombosBox/MonedaComboBox";
import LoadingDental from '../common/LoadingDental';
import { AxiosError } from "axios";

interface CitaRecibo {
    idRecibo: number;
    citaId: number;
    montoNeto: number | string;
    observaciones: string;
    medioPago: number;
    idMoneda: number;
}

interface TipoCitaProcesable {
    catalogoCitaId: number;
    catalogoCita: {
        nombreCita: string;
        precioBase: number;
    } | null;
}

interface TipoCitaCatalogo {
    id: number;
    nombreCita: string;
    precioBase: number;
}

// 2. Estado inicial limpio
const initialRecibo: CitaRecibo = {
    idRecibo: 0,
    citaId: 0,
    montoNeto: "",
    observaciones: "",
    medioPago: 1,
    idMoneda: 0,
};

interface FormProps {
    onSuccess: () => void;
    idCitaRecibo?: number;
    idCita?: number;
    isReadOnly: boolean;
}

export default function ReciboCitaForm({ onSuccess, idCita, idCitaRecibo, isReadOnly }: FormProps) {
    const inputClassName = "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
    const labelClassName = "mb-1.5 block text-sm font-medium text-gray-700";
    const [citaRecibo, setCitaRecibo] = useState<CitaRecibo>(initialRecibo);
    const { error: notifyError, success: notifySuccess, warning: nWarning } = useNotify();
    const [isLoading, setIsLoading] = useState(false);
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [tasaCambio, setTasaCambio] = useState<number>(36.5);
    const [tiposCita, setTiposCita] = useState<TipoCitaProcesable[]>([]);
    const [tiposCitaSeleccionados, setTiposCitaSeleccionados] = useState<number[]>([]);

    // Cálculo seguro del valor (por si el input está vacío)
    const valorConvertido = (Number(citaRecibo.montoNeto || 0) * tasaCambio).toFixed(2);
    const valorDivido = (Number(citaRecibo.montoNeto || 0) / tasaCambio).toFixed(2);

    const opciones = [
        { id: 1, label: 'Efectivo', Icono: Banknote },
        { id: 2, label: 'Tarjeta', Icono: CreditCard },
        { id: 3, label: 'Transferencia', Icono: Landmark },
    ];

    useEffect(() => {
        if (idCita) setCitaRecibo(prev => ({ ...prev, citaId: idCita }));

        const cargarDatos = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    idCita ? fetchTiposCita() : Promise.resolve(),
                    idCitaRecibo ? fetchCitaRecibo() : Promise.resolve(),
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        if (idCita || idCitaRecibo) void cargarDatos();
    }, [idCitaRecibo, idCita]);

    const fetchCitaRecibo = async () => {
        try {

            const response = await api.get<CitaRecibo>(`/CitasRecibo/${idCitaRecibo}`);
            const rawData = response.data;

            setCitaRecibo({
                idRecibo: rawData.idRecibo || 0,
                citaId: rawData.citaId || idCita || 0,
                medioPago: rawData.medioPago || 1,
                montoNeto: rawData.montoNeto || "",
                observaciones: rawData.observaciones || '',
                idMoneda: rawData.idMoneda || 0
            });
        } catch (error) {
            notifyError({ titulo: 'Error al obtener Recibo', descripcion: '¡Contacte a sistemas!' });
        }
    };

    const fetchTiposCita = async () => {
        try {
            if (!idCita) return;
            const [detallesResponse, catalogoResponse] = await Promise.all([
                api.get<TipoCitaProcesable[]>(`/Citas/DetalleTipos/${idCita}`),
                api.get<TipoCitaCatalogo[]>('/CatalogoCita/Vigentes'),
            ]);
            const tiposActuales = detallesResponse.data.filter(
                (tipo): tipo is TipoCitaProcesable & { catalogoCita: NonNullable<TipoCitaProcesable['catalogoCita']> } =>
                    tipo.catalogoCita !== null
            );
            const idsSeleccionados = tiposActuales.map(tipo => tipo.catalogoCitaId);
            const tiposPorId = new Map<number, TipoCitaProcesable>(
                tiposActuales.map(tipo => [tipo.catalogoCitaId, tipo])
            );

            for (const tipo of catalogoResponse.data) {
                tiposPorId.set(tipo.id, {
                    catalogoCitaId: tipo.id,
                    catalogoCita: {
                        nombreCita: tipo.nombreCita,
                        precioBase: tipo.precioBase,
                    },
                });
            }

            const tipos = Array.from(tiposPorId.values());
            const montoTotal = calcularMontoTipos(tipos, idsSeleccionados);

            setTiposCita(tipos);
            setTiposCitaSeleccionados(idsSeleccionados);
            if (!idCitaRecibo) {
                setCitaRecibo(prev => ({ ...prev, citaId: idCita, montoNeto: montoTotal }));
            }
        } catch (error) {
            notifyError({
                titulo: 'Error',
                descripcion: 'Ocurrió un error al obtener los tipos de cita y sus precios.',
            });
        }
    };

    const calcularMontoTipos = (tipos: TipoCitaProcesable[], idsSeleccionados: number[]) =>
        Number(tipos
            .filter(tipo => idsSeleccionados.includes(tipo.catalogoCitaId))
            .reduce((total, tipo) => total + (tipo.catalogoCita?.precioBase ?? 0), 0)
            .toFixed(2));

    const handleTipoCitaChange = (tipoId: number, seleccionado: boolean) => {
        const nuevosIds = seleccionado
            ? [...tiposCitaSeleccionados, tipoId]
            : tiposCitaSeleccionados.filter(id => id !== tipoId);

        setTiposCitaSeleccionados(nuevosIds);
        setCitaRecibo(prev => ({
            ...prev,
            montoNeto: calcularMontoTipos(tiposCita, nuevosIds),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isReadOnly && tiposCitaSeleccionados.length === 0) {
            nWarning({
                titulo: 'Selecciona un tipo de cita',
                descripcion: 'Debes seleccionar al menos un tipo para procesar la cita.',
            });
            return;
        }

        try {
            const isEdit = Boolean(idCitaRecibo);
            const url = `/CitasRecibo${isEdit ? `/${idCitaRecibo}` : ""}`;
            const method = isEdit ? 'put' : 'post';

            const dataToSend = {
                ...citaRecibo,
                idRecibo: isEdit ? idCitaRecibo : 0,
                montoNeto: Number(citaRecibo.montoNeto) // Convertimos el string del input a número
            };

            if (idCita) {
                await api.put(`/Citas/${idCita}/tipos`, tiposCitaSeleccionados);
            }
            await api[method](url, dataToSend);

            notifySuccess({ titulo: `'Cita Procesada ${dataToSend.citaId}'`, descripcion: 'Operación exitosa.' });
            onSuccess();
        } catch (err: AxiosError | any) {
            console.error(err)
            notifyError({
                titulo: 'Error',
                descripcion: 'Ocurrió un error al procesar la cita. Intente nuevamente.',
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'montoNeto') {
            // Permitir que el campo esté vacío para que el usuario pueda borrar
            if (value !== '') {
                const regex = /^-?\d+(\.\d{1,2})?$/;
                if (!regex.test(value.toString())) {
                    nWarning({
                        titulo: 'Error',
                        descripcion: 'Solo pueden haber 2 centavos.',
                    });
                    return;
                }
            }
        }
        setCitaRecibo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMetodoPago = (idMetodo: number) => {
        setCitaRecibo(prev => ({ ...prev, medioPago: idMetodo }));
    };

    const handleCambioMoneda = (id: number) => {
        setCitaRecibo((prev) => ({ ...prev, idMoneda: id }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <LoadingDental isLoading={isLoading} />
            <div className="mb-4">
                <div className="mb-4 relative">
                    {tiposCita.length > 0 && (
                        <div className="mb-4">
                            <label className={labelClassName}>Tipos de cita a procesar:</label>

                            {/* Contenedor general condicionado por el estado de lectura o carga */}
                            <fieldset disabled={isReadOnly || isLoading} className="space-y-3">

                                {/* Combo selector para agregar nuevas citas (solo se muestra si no está en modo solo lectura) */}
                                {!isReadOnly && (
                                    <div className="flex gap-2">
                                        <select
                                            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            defaultValue=""
                                            onChange={(e) => {
                                                const selectedId = Number(e.target.value);
                                                if (selectedId) {
                                                    // Llamamos a tu función para agregarlo (asegúrate de que acepte el ID y true para marcarlo)
                                                    handleTipoCitaChange(selectedId, true);
                                                    // Reseteamos el select
                                                    e.target.value = "";
                                                }
                                            }}
                                        >
                                            <option value="" disabled>
                                                Selecciona un tipo de cita para agregar...
                                            </option>
                                            {tiposCita
                                                .filter(tipo => !tiposCitaSeleccionados.includes(tipo.catalogoCitaId))
                                                .map(tipo => (
                                                    <option key={tipo.catalogoCitaId} value={tipo.catalogoCitaId}>
                                                        {tipo.catalogoCita?.nombreCita ?? 'Tipo de cita'} - {Number(tipo.catalogoCita?.precioBase ?? 0).toFixed(2)}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                )}

                                {/* Lista donde se van agregando los elementos seleccionados */}
                                <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                                    {tiposCita
                                        .filter(tipo => tiposCitaSeleccionados.includes(tipo.catalogoCitaId))
                                        .map(tipo => (
                                            <div
                                                key={tipo.catalogoCitaId}
                                                className="flex items-center justify-between gap-3 rounded-md bg-white p-2.5 border border-gray-200 text-sm text-gray-700 shadow-sm"
                                            >
                                                <span className="font-medium">
                                                    {tipo.catalogoCita?.nombreCita ?? 'Tipo de cita'}
                                                </span>

                                                <div className="flex items-center gap-4">
                                                    <span className="text-gray-600">
                                                       Base: {Number(tipo.catalogoCita?.precioBase ?? 0).toFixed(2)}
                                                    </span>

                                                    {/* Botón para eliminar de la lista (oculto en modo solo lectura) */}
                                                    {!isReadOnly && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleTipoCitaChange(tipo.catalogoCitaId, false)}
                                                            className="text-red-500 hover:text-red-700 font-semibold text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            ✕ Quitar
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                    {/* Mensaje en caso de que no haya elementos seleccionados */}
                                    {tiposCitaSeleccionados.length === 0 && (
                                        <p className="text-sm text-gray-500 text-center py-2">
                                            No hay tipos de cita seleccionados.
                                        </p>
                                    )}
                                </div>
                            </fieldset>
                        </div>
                    )}
                    <label className={labelClassName}>Ingreso:</label>

                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            step={0.01}
                            readOnly={isReadOnly}
                            name="montoNeto"
                            value={citaRecibo.montoNeto}
                            onChange={handleChange}
                            className={inputClassName}
                            placeholder="Ingrese ingreso:"
                            required
                        />

                        {/* Pequeño botón para abrir/cerrar el popup */}
                        <button
                            type="button"
                            onClick={() => setMostrarPopup(!mostrarPopup)}
                            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none transition-colors text-sm font-semibold shadow-sm"
                            title="Calcular conversión"
                        >
                            <DollarSign />
                        </button>
                    </div>

                    {/* Popup flotante */}
                    {mostrarPopup && (
                        <div className="absolute top-full left-0 mt-2 p-3 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">
                                Tasa de Cambio
                                <input type='number' className='p-2 w-full' name='TasaCambio' value={tasaCambio} onChange={(value) => { setTasaCambio(Number(value.target.value)) }} />
                            </h4>
                            <div className="text-sm text-gray-600 mb-1">
                                <strong>Base:</strong> {citaRecibo.montoNeto || "0.00"}
                            </div>
                            <div className="text-sm text-green-600 font-bold">
                                <strong>Total:</strong>
                                <button type='button' >
                                    {citaRecibo.idMoneda === 2 ?
                                        valorConvertido
                                        : valorDivido}
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMostrarPopup(false)}
                                className="mt-2 text-xs text-red-500 hover:text-red-700 underline w-full text-right"
                            >
                                Cerrar
                            </button>
                        </div>
                    )}
                </div>
                <div className="mb-4">
                    <label className={labelClassName}>Observaciones (Opcional)</label>
                    <textarea
                        placeholder="Añade detalles adicionales sobre la consulta..."
                        name="observaciones"
                        value={citaRecibo.observaciones}
                        onChange={handleChange}
                        className={`${inputClassName} resize-none`}
                        readOnly={isReadOnly}
                    />
                </div>

                <MonedaComboBox value={citaRecibo.idMoneda} onChange={handleCambioMoneda} isReadOnly={isReadOnly} />

                <div className="flex flex-col gap-3 font-sans p-4">
                    <h3 className="text-sm font-bold text-slate-700">
                        Método de Pago
                    </h3>
                    <div className="flex gap-4">
                        {opciones.map(({ id, label, Icono }) => {
                            const esActivo = citaRecibo.medioPago === id;
                            return (
                                <button
                                    type='button'
                                    key={id}
                                    onClick={() => handleMetodoPago(id)}
                                    className={`flex flex-col items-center justify-center w-[110px] h-[100px] rounded-xl border-2 transition-all duration-200 cursor-pointer ${esActivo
                                        ? 'border-blue-400 bg-[#eff4ff] text-blue-600'
                                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-slate-100'
                                        }`}

                                >
                                    <Icono
                                        className="w-7 h-7 mb-2"
                                        strokeWidth={esActivo ? 2.5 : 2}
                                    />
                                    <span className={`text-[13px] font-bold ${esActivo ? 'text-blue-600' : 'text-slate-700'}`}>
                                        {label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {Number(idCita) > 0 && !isReadOnly && (
                    <button type='submit' className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                        Guardar Ingreso
                    </button>
                )}

            </div>
        </form>
    );
}