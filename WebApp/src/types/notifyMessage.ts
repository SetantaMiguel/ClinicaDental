
export interface notifyMessage {
    titulo: string;  
    descripcion ?: string; 
    tipo: 'success' | 'error' | 'info'; 
    position ?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    isOpen : boolean;
    onClose?: () => void ;
}