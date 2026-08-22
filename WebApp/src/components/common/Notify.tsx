import { useEffect } from 'react';
import { sileo } from 'sileo';
import type { notifyMessage } from '../../types/index';

export default function Notify({ titulo, descripcion, tipo, position, isOpen, onClose }: notifyMessage) {
    useEffect(() => {
        if (!isOpen) return;

        const payload = {
            title: titulo,
            description: descripcion ?? '',
            position: (position ?? 'bottom-right') as any,
            duration: 3000,
            roundness: 16,
            fill: "black",
            styles: {
                title: "text-white!",
                description: "text-white/75!",
            }
                        
        };

        if (tipo === 'success') {
            sileo.success(payload);
        } else if (tipo === 'error') {
            sileo.error(payload);
        } else if (tipo === 'info') {
            sileo.info(payload);
        } else {
            sileo.warning(payload);
        }

        onClose?.();
    }, [descripcion, isOpen, onClose, position, tipo, titulo]);

    return null;
}

