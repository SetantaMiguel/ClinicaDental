import React, { useEffect, useState } from 'react';
import { 
  ChevronDown, 
  CheckCircle, 
  CalendarClock, 
  XCircle,
  User,
  Calendar,
  Activity,
  FileText
} from 'lucide-react';
import ReciboCitaForm from '../../Forms/FormReciboCita';
import type { CitaEvent } from '../../../types';
import { useConfirm } from '../../Context/ConfirmProvider';
import { useNotify } from '../../Context/NotifyContext';
import api from '../../../api/axiosConfig';
import Modal from '../Modal';
import FormAppointment from '../../Forms/FormAppointment';

// Props del componente
interface DetalleCitaCardProps {
  selectedCita: CitaEvent | null;
  setSelectedCita: (cita: CitaEvent | null) => void;
  onCargarCitas: () => void;
}

export const DetalleCitaCard: React.FC<DetalleCitaCardProps> = ({
  selectedCita,
  setSelectedCita,
  onCargarCitas,
}) => {
  const { confirm } = useConfirm();
  const { success: notifySuccess, error: notifyError, info: notifyInfo } = useNotify();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [paso, setPaso] = useState<1 | 2>(1);
  const [isShowButtonActions, setIsShowButtonActions] = useState(true);
  const [isFormCitaOpenReagendar, setIsFormCitaOpenReagendar] = useState(false);

  useEffect(() => {
    if (selectedCita?.Recibo) {
      setIsShowButtonActions(false);
    }
  }, [selectedCita]);

  if (!selectedCita) return null;
  
  const MarcarAtendida = async () => {
    setPaso(2);
    setIsShowButtonActions(false);
  };

  const CancelarCita = async () => {
    if (!selectedCita) return;

    const isConfirmed = await confirm({
      title: "Cancelar Cita",
      message: `¿Estás seguro de que deseas cancelar la cita de ${selectedCita.pacienteNombre}?`,
      confirmText: "Sí, Cancelar",
      cancelText: "Cancelar"
    });

    if (!isConfirmed) {
      notifyInfo({
        titulo: 'Operación cancelada',
        descripcion: 'La cita no ha sido cancelada.',
      });
      return;
    }

    try {
      const response = await api.patch(`/Citas/Cancelar/${selectedCita.id}`);

      if (response.status === 200) {
        notifySuccess({
          titulo: 'Cita cancelada',
          descripcion: 'La cita ha sido cancelada exitosamente.',
        });
        setSelectedCita(null);
        onCargarCitas();
      }
    } catch (err) {
      console.error('Error al cancelar la cita:', err);
      notifyError({
        titulo: 'Error',
        descripcion: 'Ocurrió un problema al intentar cancelar la cita.',
      });
    }
  };
  
  const handleFormSuccessCita = async () => {
    setIsFormCitaOpenReagendar(false);
    setSelectedCita(null);
    onCargarCitas();
  }

  return (
    <div className="rounded-2xl w-250 bg-white p-6 text-slate-700 shadow-sm border border-slate-200 min-h-[400px] flex flex-col">
      {/* Encabezado */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            {paso === 1 ? `Cita #${selectedCita.id}` : 'Confirmar Detalles'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Información completa asociada a la cita seleccionada
          </p>
        </div>

        {/* Acciones / Estado */}
        <div className="flex-shrink-0">
          {selectedCita.estadoCitaCodigo === 'C' ? (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold tracking-wide bg-red-50 text-red-600 border border-red-100">
              <XCircle className="w-4 h-4 mr-1.5" />
              Cita Cancelada
            </span>
          ) : (
            isShowButtonActions && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white shadow-md shadow-slate-200 rounded-lg hover:bg-slate-800 transition-all text-sm font-medium focus:ring-4 focus:ring-slate-100 focus:outline-none"
                >
                  <span>Procesar Cita</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Menú Desplegable */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 transform origin-top-right transition-all">
                    <div className="p-1.5">
                      <button
                        type="button"
                        onClick={() => { setIsMenuOpen(false); MarcarAtendida(); }}
                        className="flex w-full items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-green-50 hover:text-green-700 transition-colors font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Marcar Atendida
                      </button>

                      <button
                        type="button"
                        onClick={() => { setIsMenuOpen(false); setIsFormCitaOpenReagendar(true); }}
                        className="flex w-full items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-orange-50 hover:text-orange-700 transition-colors font-medium"
                      >
                        <CalendarClock className="w-4 h-4" />
                        Reagendar
                      </button>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        type="button"
                        onClick={() => { setIsMenuOpen(false); CancelarCita(); }}
                        className="flex w-full items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancelar Cita
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1">
        {paso === 1 && (
          <div className="flex flex-col lg:flex-row gap-8 h-full">
            {/* Columna de Información - Grid Fijo */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 content-start ${selectedCita.Recibo ? 'lg:w-3/5' : 'w-full'}`}>
              
              {/* Card Paciente (1 columna) */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-start gap-3">
                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Paciente</span>
                  <span className="text-slate-800 font-semibold">{selectedCita.pacienteNombre}</span>
                </div>
              </div>

              {/* Card Fecha (1 columna) */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-start gap-3">
                <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-lg flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Fecha y hora</span>
                  <span className="text-slate-800 font-semibold">{selectedCita.fechaText || 'No disponible'}</span>
                </div>
              </div>

              {/* Card Estado (Fila Completa -> sm:col-span-2) */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-start gap-3 sm:col-span-2">
                <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-lg flex-shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Estado de la cita</span>
                  <span className="text-slate-800 font-semibold">{selectedCita.estadoCitaDescripcion || 'No disponible'}</span>
                </div>
              </div>

              {/* Card Observaciones (Fila Completa -> sm:col-span-2) */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-start gap-3 sm:col-span-2">
                <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="w-full">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Observaciones</span>
                  {selectedCita.observaciones ? (
                    <span className="text-slate-700 text-sm leading-relaxed block mt-1" title={selectedCita.observaciones}>
                      {selectedCita.observaciones}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-sm italic block mt-1">Sin observaciones previas</span>
                  )}
                </div>
              </div>

            </div>

            {/* Recibo Lectura */}
            {selectedCita.Recibo && (
              <div className="lg:w-2/5 lg:border-l lg:border-slate-200 lg:pl-8 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-1 bg-slate-800 rounded-full"></div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900">Detalle de Pagos</h3>
                </div>
                <div className="flex-1 bg-slate-50/50 rounded-xl border border-slate-100 p-1">
                  <ReciboCitaForm
                    isReadOnly={true}
                    onSuccess={() => {}}
                    idCita={0}
                    idCitaRecibo={selectedCita.Recibo?.idRecibo}
                    idCatalogCita={0}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Paso 2: Creación/Procesamiento del Recibo */}
        {paso === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <ReciboCitaForm
              isReadOnly={false}
              onSuccess={() => {
                setSelectedCita(null);
                setPaso(1);
                setIsShowButtonActions(true);
                onCargarCitas();
              }}
              idCita={selectedCita.id}
              idCatalogCita={selectedCita.tipoCitaId}
              idCitaRecibo={0}
            />
          </div>
        )}
      </div>

      <Modal isOpen={isFormCitaOpenReagendar} onClose={() => setIsFormCitaOpenReagendar(false)}>
        <FormAppointment OnSuccess={handleFormSuccessCita} idCita={selectedCita?.id} />
      </Modal>
    </div>
  );
};