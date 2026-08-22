
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void; // Para el botón 'X' de cierre
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  onClose,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center border-2 border-gray-300 bg-black/30 backdrop-blur-sm transition-opacity duration-300">
      {/* Contenedor del Dialog (Estructura y estilos similares al Modal original) */}
      <div
        className="bg-white rounded-2xl p-0.5 shadow-2xl mx-4 transition-shadow duration-300 pointer-events-auto flex flex-col max-w-md w-full"
      >
        {/* Cabecera (Similar a la barra de arrastre, pero sin arrastrar) */}
        <div
          className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-t-2xl select-none"
        >
          <h2 className="text-sm font-semibold text-gray-800 tracking-tight">
            {title}
          </h2>
          
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-700 transition-colors p-1"
            aria-label="Cerrar modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>               
        </div>          
        
        {/* Contenido principal (Donde va el mensaje) */}
        <div className="p-4 flex-grow">
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {message}
          </p>
        </div>

        {/* Botones de acción en el pie */}
        <div className="flex justify-end gap-2 p-4 pt-1">
          <button 
            onClick={onCancel}
            className="px-4 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all duration-200"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}