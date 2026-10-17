import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { useNotify } from '../Context/NotifyContext';
import type { AxiosError } from 'axios';
import Table from '../common/Table';
import type { PagePrompt } from '../../types/index.ts';
import Modal from '../common/Modal.tsx';
import { Edit,CirclePlus } from 'lucide-react';
import FormFilterCatalogoCita, { type FilterAppointmentConfig } from './FormFilterCatalogoCita.tsx';
import Popover from '../common/Popover.tsx';
import type { AppointmentConfig } from '../../types/AppointmentConfig.ts';


const initialAppointment: AppointmentConfig = {
  nombreCita: '',
  descripcion: '',
  vigente: true,
  precioBase: 0
};

export default function FormAppointmentConfig() {
  const { success, error } = useNotify();
  const [appointments, setAppointments] = useState<AppointmentConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [PagePrompt, setPagePrompt] = useState<PagePrompt>({ pageNumber: 1, pageSize: 10, TotalRecords: 0 });
  const [newAppointment, setNewAppointment] = useState<AppointmentConfig>(initialAppointment);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isEdit = newAppointment.id !== undefined;
  const [showFilter, setShowFilter] = useState(false);
  const [filtroCatalogo, setFiltroCatalogo] = useState<FilterAppointmentConfig>({});

  const columns = [
    { header: 'Nombre de la cita', key: 'nombreCita' },
    { header: 'Descripción', key: 'descripcion' },
    { header: 'Precio Base', key: 'precioBase' },
    {
      header: 'Estado', key: 'vigente', render: (item: AppointmentConfig) => (
        <span className={`px-2 py-1 rounded-full text-sm font-semibold ${item.vigente ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {item.vigente ? 'Vigente' : 'Inactivo'}
        </span>
      )
    },
    {
      header: 'Acciones', key: 'actions', render: (item: AppointmentConfig) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setNewAppointment(appointments.find((app) => app.id === item.id) || initialAppointment);
              setIsModalOpen(true);
            }}
            className="text-blue-500 hover:text-blue-700 py-1 px-3 rounded"
          >
            <Edit size={20} />
          </button>
        </div>
      )
    }

  ];
  // Función para aplicar filtros y actualizar la lista de citas
  const applyFilters = (filtro: FilterAppointmentConfig) => {
    setFiltroCatalogo (filtro);
    setPagePrompt((page) => ({ ...page, pageNumber: 1 }));
    getAppointments(filtro, 1);
    setShowFilter(false);
  };
  
  const clearFilters = () => {
    setFiltroCatalogo({});
    setPagePrompt((page) => ({ ...page, pageNumber: 1 }));
    getAppointments({}, 1);
    setShowFilter(false);
  };

  const getAppointments = async (filtro?: FilterAppointmentConfig, pageNumber: number = PagePrompt.pageNumber) => {
    try {

      setIsLoading(true);
      const filtroUsar = filtro ?? filtroCatalogo;

      const response = await api.get('/CatalogoCita', {
        params: {
          pageNumber,
          pageSize: PagePrompt.pageSize,
          id: filtroUsar.id ?? null,
          nombreCita: filtroUsar.nombreCita ?? null,
          descripcion: filtroUsar.descripcion ?? null,
          precioBase: filtroUsar.precioBase ?? null,
          vigente: filtroUsar.vigente ?? null              
        }
      });

      console.log('Respuesta del servidor:', response.data);
      const mappedAppointments = response.data.data.map((item: any) => ({
        id: item.id,
        nombreCita: item.nombreCita,
        descripcion: item.descripcion ?? '',
        vigente: item.vigente,
        precioBase: item.precioBase ?? 0 // Aseguramos un valor por defecto
      }));

      setPagePrompt({
        ...PagePrompt,
        TotalRecords: response.data.totalRecords
      });

      setAppointments(mappedAppointments);
    } catch (err) {
      console.error('Error al obtener el catálogo de citas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, [PagePrompt.pageNumber]);


  const validaciones = () => {

    if (!newAppointment.nombreCita.trim()) {
      error({ titulo: "Completa el nombre", descripcion: "El nombre de la cita es obligatorio" });
      return true;
    }

    if (!newAppointment.descripcion.trim()) {
      error({ titulo: "Completa la descripción", descripcion: "La descripción de la cita es obligatoria" });
      return true;
    }

    if (newAppointment.precioBase <= 0) {
      error({ titulo: "Precio inválido", descripcion: "El precio base debe ser un valor positivo" });
      return true;
    }

    return false;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validaciones()) return;
    try {
      const url = isEdit ? `/CatalogoCita/${newAppointment.id}` : '/CatalogoCita';
      const method = isEdit ? 'put' : 'post';
      const data = {
        ...newAppointment
      }
      const response = await api[method](url, data);

      setAppointments((prev) => [
        ...prev,
        {
          id: response.data.id,
          nombreCita: response.data.nombreCita,
          descripcion: response.data.descripcion ?? '',
          vigente: response.data.vigente,
          precioBase: response.data.precioBase ?? newAppointment.precioBase,
        },
      ]);

      const mensaje = isEdit ? "Tipo de cita actualizado" : "Tipo de cita creado";
      const descripcion = isEdit ? `Se actualizó un registro en el catálogo id ${newAppointment.id}` : `Se agregó un nuevo registro al catálogo id ${response.data.id}`;
      setIsModalOpen(false);
      getAppointments();
      // Limpiamos el formulario incluyendo el precio
      setNewAppointment({ nombreCita: '', descripcion: '', vigente: true, precioBase: 0 });
      success({ titulo: mensaje, descripcion: descripcion });
    } catch (err: AxiosError | any) {
      console.error(err.response.data);
      error({ titulo: "Error", descripcion: "No se pudo crear el nuevo tipo de cita" });
    }
  };

  return (
    <div className=" rounded-2xl  ">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">Catálogo de citas odontológicas</h2>
        <p className="mt-1 text-sm text-slate-500">
          Configura la descripción, precio base y el estado de cada tipo de cita para tu clínica.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              setNewAppointment(initialAppointment);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all group font-semibold text-slate-700"
          >
            <div className="mr-2">
              <CirclePlus className="w-5 h-5" /> 
            </div>
            Nuevo
          </button>
          <Popover
            classChild="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all group font-semibold text-slate-700"
            children={
              <div className="text-sm text-slate-600">
                <FormFilterCatalogoCita ApplyFilters={applyFilters} filtroActual={filtroCatalogo} onCancel={clearFilters} />
              </div>
            }
            isOpen={showFilter}
            onToggle={() => setShowFilter(!showFilter)}
          />
        </div>
      </div>

      <Table columns={columns} data={appointments} isLoading={isLoading}
        PagePromts={PagePrompt} onPageChange={(page) => setPagePrompt({ ...PagePrompt, pageNumber: page })} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} >
        <form className="mb-6 rounded-xl p-4" onSubmit={handleSubmit}>
          <h2 className="text-lg font-bold text-slate-800 mb-2">{isEdit ? "Editar tipo de cita" : "Agregar nuevo tipo de cita"}</h2>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="text"
              value={newAppointment.nombreCita}
              onChange={(event) => setNewAppointment((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Nombre del tipo de cita"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <input
              type="text"
              value={newAppointment.descripcion}
              onChange={(event) => setNewAppointment((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Descripción"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {/* Nuevo Input de Precio Base para la creación */}
            <input
              type="number"
              min="0"
              value={newAppointment.precioBase === 0 ? '' : newAppointment.precioBase}
              onChange={(event) => setNewAppointment((prev) => ({ ...prev, precioBase: Number(event.target.value) }))}
              placeholder="Precio Base"
              className="w-full md:w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <label className="flex cursor-pointer items-center gap-2">
              <div className="relative">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={newAppointment.vigente}
                  onChange={() => setNewAppointment((prev) => ({ ...prev, vigente: !prev.vigente }))}
                />
                <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-200"></div>
                <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all peer-checked:translate-x-full"></div>
              </div>
              <span className="w-14 text-sm font-medium text-slate-600">
                {newAppointment.vigente ? 'Vigente' : 'Inactivo'}
              </span>
            </label>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Confirmar
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}