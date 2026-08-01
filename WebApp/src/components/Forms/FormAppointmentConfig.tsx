import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import type { notifyMessage } from '../../types/index.ts';
import Notify from '../common/Notify.tsx';

interface AppointmentConfig {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

interface NewAppointmentForm {
  name: string;
  description: string;
  isActive: boolean;
}

export default function FormAppointmentConfig() {
  const [appointments, setAppointments] = useState<AppointmentConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState<notifyMessage>({ titulo: "", descripcion: "",isOpen: false,tipo:"success",position:"bottom-right",onClose(){} });
  const [newAppointment, setNewAppointment] = useState<NewAppointmentForm>({
    name: '',
    description: '',
    isActive: true,
  });

  const getAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/CatalogoCita');

      const mappedAppointments = response.data.map((item: any) => ({
        id: item.id,
        name: item.nombreCita,
        description: item.descripcion ?? '',
        isActive: item.vigente,
      }));

      setAppointments(mappedAppointments);
    } catch (error) {
      console.error('Error al obtener el catálogo de citas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  // Función para alternar el estado "Vigente"
  const handleToggle = (id: number) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, isActive: !app.isActive } : app
      )
    );
  };

  const handleSave = async (id: number, description: string, isActive: boolean) => {
    try {
      await api.put(`/CatalogoCita/${id}`, {
        id,
        nombreCita: appointments.find((item) => item.id === id)?.name ?? '',
        descripcion: description,
        vigente: isActive,
      });

      setNotifyMessage({ titulo: "¡Operación exitosa!",
            descripcion: `Configuración actualizada correctamente con ID: ${id}`,
            isOpen: true,
            tipo:"success",position:"bottom-right" });

    } catch (error) {
      console.error('Error al guardar la configuración:', error);
      setNotifyMessage({ titulo: "Error", descripcion: "No se pudo guardar la configuración", isOpen: true, tipo: "error", position: "bottom-right" });
    }
  };

  const handleCreateNew = async () => {
    if (!newAppointment.name.trim()) {
      setNotifyMessage({ titulo: "Completa el nombre", descripcion: "El nombre del tipo de cita es obligatorio", isOpen: true, tipo: "error", position: "bottom-right" });
      return;
    }

    try {
      const response = await api.post('/CatalogoCita', {
        nombreCita: newAppointment.name,
        descripcion: newAppointment.description,
        vigente: newAppointment.isActive,
      });

      setAppointments((prev) => [
        ...prev,
        {
          id: response.data.id,
          name: response.data.nombreCita,
          description: response.data.descripcion ?? '',
          isActive: response.data.vigente,
        },
      ]);

      setNewAppointment({ name: '', description: '', isActive: true });
      setNotifyMessage({ titulo: "¡Tipo de cita creado!", descripcion: "Se agregó un nuevo registro al catálogo", isOpen: true, tipo: "success", position: "bottom-right" });
    } catch (error) {
      console.error('Error al crear el tipo de cita:', error);
      setNotifyMessage({ titulo: "Error", descripcion: "No se pudo crear el nuevo tipo de cita", isOpen: true, tipo: "error", position: "bottom-right" });
    }
  };

    return (
        <div className="mx-auto w-full max-w-4xl mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* Encabezado Principal */}
            <div className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-800">Catálogo de citas odontológicas</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Configura la descripción y el estado de cada tipo de cita para tu clínica.
                </p>
            </div>

            {/* Lista de Formularios */}
            <div className="space-y-4">
                {isLoading ? (
                    <p className="text-sm text-slate-500">Cargando catálogo...</p>
                ) : (
                    appointments.map((item) => (
                        <form
                            key={item.id}
                            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
                        >
                            {/* --- FILA 1: Nombre de la Cita --- */}
                            <div className="border-b border-slate-100 pb-2">
                                <label className="block text-sm font-semibold text-slate-700">
                                    {item.name}
                                </label>
                            </div>

                            {/* --- FILA 2: Inputs Alineados --- */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                {/* 1. Campo de Descripción (flex-1 para ocupar el espacio restante) */}
                                <input
                                    type="text"
                                    defaultValue={item.description}
                                    onChange={(event) => {
                                        setAppointments((prev) =>
                                            prev.map((app) =>
                                                app.id === item.id ? { ...app, description: event.target.value } : app
                                            )
                                        );
                                    }}
                                    placeholder="Agrega una descripción para esta cita..."
                                    className="w-full sm:flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                />

                                {/* Grupo secundario para Toggle y Botón (alineado a la derecha en pantallas grandes) */}
                                <div className="flex items-center justify-between gap-6 sm:justify-end">

                                    {/* 2. Toggle Switch para "Vigente" */}
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={item.isActive}
                                                onChange={() => handleToggle(item.id)}
                                            />
                                            {/* Fondo del Toggle */}
                                            <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-200"></div>
                                            {/* Círculo del Toggle */}
                                            <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all peer-checked:translate-x-full"></div>
                                        </div>
                                        <span className="w-14 text-sm font-medium text-slate-600">
                                            {item.isActive ? 'Vigente' : 'Inactivo'}
                                        </span>
                                    </label>

                                    {/* 3. Botón de Guardado */}
                                    <button
                                        type="button"
                                        onClick={() => handleSave(item.id, item.description, item.isActive)}
                                        className="rounded-lg bg-slate-800 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </form>
                    ))
                )}
            </div>
            <br />
            {/* --- NUEVO FORMULARIO --- */}

            <div className="mb-6 rounded-xl border border-dashed border-slate-300 bg-green-100 p-4">
                <h2 className="text-lg font-bold text-slate-800 mb-2">Agregar nuevo tipo de cita</h2>
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <input
                        type="text"
                        value={newAppointment.name}
                        onChange={(event) => setNewAppointment((prev) => ({ ...prev, name: event.target.value }))}
                        placeholder="Nombre del tipo de cita"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <input
                        type="text"
                        value={newAppointment.description}
                        onChange={(event) => setNewAppointment((prev) => ({ ...prev, description: event.target.value }))}
                        placeholder="Descripción"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    {/* 2. Toggle Switch para "Vigente" */}
                    <label className="flex cursor-pointer items-center gap-2">
                        <div className="relative">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={newAppointment.isActive}
                                onChange={() => setNewAppointment((prev) => ({ ...prev, isActive: !prev.isActive }))}
                            />
                            {/* Fondo del Toggle */}
                            <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-200"></div>
                            {/* Círculo del Toggle */}
                            <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all peer-checked:translate-x-full"></div>
                        </div>
                        <span className="w-14 text-sm font-medium text-slate-600">
                            {newAppointment.isActive ? 'Vigente' : 'Inactivo'}
                        </span>
                    </label>
                    <button
                        type="button"
                        onClick={handleCreateNew}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Agregar
                    </button>
                </div>
            </div>

            <Notify
                descripcion={notifyMessage.descripcion}
                titulo={notifyMessage.titulo}
                tipo={notifyMessage.tipo}
                position={notifyMessage.position}
                isOpen={notifyMessage.isOpen}
                onClose={() => setNotifyMessage({ ...notifyMessage, isOpen: false })} />
        </div>
    );
}