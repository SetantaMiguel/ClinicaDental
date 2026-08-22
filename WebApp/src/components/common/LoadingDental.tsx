import { Loader } from 'lucide-react';

interface LoadingDentalProps {
    /** 
     * Propiedad booleana que determina si el loading se muestra o no.
     */
    isLoading: boolean;
    /** 
     * Mensaje opcional a mostrar debajo del icono. 
     * Por defecto es "Cargando información..." 
     */
    mensaje?: string;
    /** 
     * Si es true, el loading cubrirá toda la pantalla. 
     * Si es false, se adaptará al contenedor padre. 
     */
    pantallaCompleta?: boolean;
}

export default function LoadingDental({ 
    isLoading,
    mensaje = "Cargando información...", 
    pantallaCompleta = false 
}: LoadingDentalProps) {
    
    // Si la propiedad es falsa, detenemos el renderizado devolviendo null
    if (!isLoading) return null;

    // Clases dinámicas dependiendo de si queremos bloquear toda la pantalla o solo una sección
    const containerClasses = pantallaCompleta 
        ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm"
        : "flex flex-col items-center justify-center p-8 w-full h-full min-h-[250px]";

    return (
        <div className={containerClasses}>
            <div className="relative flex items-center justify-center">
                {/* Anillo exterior con animación de giro */}
                <div className="absolute w-24 h-24 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
                
                {/* Contenedor del icono con animación de latido */}
                <div className="bg-white p-4 rounded-full shadow-sm animate-pulse z-10">
                    <Loader className="w-10 h-10 text-blue-500" strokeWidth={1.5} />
                </div>
            </div>
            
            {/* Texto informativo */}
            <p className="mt-8 text-base font-semibold text-slate-700 animate-pulse">
                {mensaje}
            </p>
        </div>
    );
}