import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { useNotify } from '../Context/NotifyContext';
import type { AxiosError } from 'axios';
import LoadingDental from '../common/LoadingDental';
// Interfaz unificada: hacemos el 'id' opcional para reutilizarla al crear nuevos registros
interface AppointmentConfig {
  id?: number; 
  name: string;
  description: string;
  isActive: boolean;
  PrecioBase: number;
}

export default function FormAppointmentConfig() {
  const { success, error } = useNotify();
  const [appointments, setAppointments] = useState<AppointmentConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Usamos la misma interfaz para el estado inicial
  const [newAppointment, setNewAppointment] = useState<AppointmentConfig>({
    name: '',
    description: '',
    isActive: true,
    PrecioBase: 0
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
        PrecioBase: item.precioBase ?? 0 // Aseguramos un valor por defecto
      }));
      setAppointments(mappedAppointments);
    } catch (err) {
      console.error('Error al obtener el catálogo de citas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const handleToggle = (id: number) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, isActive: !app.isActive } : app
      )
    );
  };

  // Se actualizó la firma para recibir el PrecioBase
  const handleSave = async (id: number, description: string, isActive: boolean, precioBase: number) => {
    try {
      await api.put(`/CatalogoCita/${id}`, {
        id,
        nombreCita: appointments.find((item) => item.id === id)?.name ?? '',
        descripcion: description,
        vigente: isActive,
        PrecioBase: precioBase, // Enviamos el precio actualizado
      });

      success({
        titulo: "¡Operación exitosa!",
        descripcion: `Configuración actualizada correctamente con ID: ${id}`,
      });

    } catch (err) {
      console.error('Error al guardar la configuración:', err);
      error({ titulo: "Error", descripcion: "No se pudo guardar la configuración" });
    }
  };

  const handleCreateNew = async () => {
    if (!newAppointment.name.trim()) {
      error({ titulo: "Completa el nombre", descripcion: "El nombre de la cita es obligatorio" });
      return;
    }

    try {
      const response = await api.post('/CatalogoCita', {
        Id:0,
        NombreCita: newAppointment.name,
        Descripcion: newAppointment.description,
        Vigente: newAppointment.isActive,
        PrecioBase: newAppointment.PrecioBase | 0
      });

      setAppointments((prev) => [
        ...prev,
        {
          id: response.data.id,
          name: response.data.nombreCita,
          description: response.data.descripcion ?? '',
          isActive: response.data.vigente,
          PrecioBase: response.data.PrecioBase ?? newAppointment.PrecioBase,
        },
      ]);

      // Limpiamos el formulario incluyendo el precio
      setNewAppointment({ name: '', description: '', isActive: true, PrecioBase: 0 });
      success({ titulo: "¡Tipo de cita creado!", descripcion: "Se agregó un nuevo registro al catálogo" });
    } catch (err: AxiosError | any) {
      console.error(err.response.data);
      error({ titulo: "Error", descripcion: "No se pudo crear el nuevo tipo de cita" });
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">Catálogo de citas odontológicas</h2>
        <p className="mt-1 text-sm text-slate-500">
          Configura la descripción, precio base y el estado de cada tipo de cita para tu clínica.
        </p>
      </div>
      <LoadingDental isLoading={isLoading} />
      <div className="space-y-4">
        {
          appointments.map((item) => (
            <form
              key={item.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <div className="border-b border-slate-100 pb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  {item.name}
                </label>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

                {/* Nuevo Input para Precio Base */}
                <input
                  type="number"
                  min="0"
                  defaultValue={item.PrecioBase}
                  onChange={(event) => {
                    setAppointments((prev) =>
                      prev.map((app) =>
                        app.id === item.id ? { ...app, PrecioBase: Number(event.target.value) } : app
                      )
                    );
                  }}
                  placeholder="Precio Base"
                  className="w-full sm:w-32 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  <label className="flex cursor-pointer items-center gap-2">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={item.isActive}
                        onChange={() => handleToggle(item.id!)}
                      />
                      <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-200"></div>
                      <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all peer-checked:translate-x-full"></div>
                    </div>
                    <span className="w-14 text-sm font-medium text-slate-600">
                      {item.isActive ? 'Vigente' : 'Inactivo'}
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleSave(item.id!, item.description, item.isActive, item.PrecioBase)}
                    className="rounded-lg bg-slate-800 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          ))
        }
      </div>
      <br />

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
          
          {/* Nuevo Input de Precio Base para la creación */}
          <input
            type="number"
            min="0"
            value={newAppointment.PrecioBase === 0 ? '' : newAppointment.PrecioBase}
            onChange={(event) => setNewAppointment((prev) => ({ ...prev, PrecioBase: Number(event.target.value) }))}
            placeholder="Precio Base"
            className="w-full md:w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <label className="flex cursor-pointer items-center gap-2">
            <div className="relative">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={newAppointment.isActive}
                onChange={() => setNewAppointment((prev) => ({ ...prev, isActive: !prev.isActive }))}
              />
              <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-200"></div>
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
    </div>
  );
}