interface ModalProps { 
    isOpen: boolean;   
    children: React.ReactNode;
    onClose ?: () => void;
}

export default function Modal({ isOpen, children, onClose }: ModalProps) { 
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="block bg-white rounded-2xl p-4 shadow-2xl max-w-sm w-full mx-4 transform transition-all animate-in fade-in zoom-in duration-300">
            <div className="flex justify-end mb-1 mr-2">
                <button onClick={onClose} className="right-4 text-gray-500 hover:text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>                
            </div>          
            <div className="flex">
                {children}
            </div>
        </div>
        </div>
    );
}


    
