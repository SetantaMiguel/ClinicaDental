import { createContext, useContext } from 'react';
import { sileo } from 'sileo';
import type { SileoPosition, SileoState } from 'sileo';

interface NotifyOptions {
  titulo: string;
  descripcion?: string;
  position?: SileoPosition;
  duration?: number;
}

interface NotifyContextType {
  show: (options: NotifyOptions & { tipo: SileoState }) => void;
  success: (options: Omit<NotifyOptions, 'tipo'>) => void;
  error: (options: Omit<NotifyOptions, 'tipo'>) => void;
  warning: (options: Omit<NotifyOptions, 'tipo'>) => void;
  info: (options: Omit<NotifyOptions, 'tipo'>) => void;
}

const NotifyContext = createContext<NotifyContextType | undefined>(undefined);

export const NotifyProvider = ({ children }: { children: React.ReactNode }) => {
  const show = (options: NotifyOptions & { tipo: SileoState }) => {
    const { titulo, descripcion, position = 'bottom-right', duration = 3000, tipo } = options;
    
    const payload = {
      title: titulo,
      description: descripcion ?? '',
      position: position as SileoPosition,
      duration,
      roundness: 16,
      fill: 'black',
      styles: {
        title: 'text-white!',
        description: 'text-white/75!',
      },
    };

    if (tipo === 'success') {
      sileo.success(payload);
    } else if (tipo === 'error') {
      sileo.error(payload);
    } else if (tipo === 'warning') {
      sileo.warning(payload);
    } else if (tipo === 'info') {
      sileo.info(payload);
    } else {
      sileo.show({ ...payload, type: tipo });
    }
  };

  const success = (options: Omit<NotifyOptions, 'tipo'>) => {
    show({ ...options, tipo: 'success' });
  };

  const error = (options: Omit<NotifyOptions, 'tipo'>) => {
    show({ ...options, tipo: 'error' });
  };

  const warning = (options: Omit<NotifyOptions, 'tipo'>) => {
    show({ ...options, tipo: 'warning' });
  };

  const info = (options: Omit<NotifyOptions, 'tipo'>) => {
    show({ ...options, tipo: 'info' });
  };

  return (
    <NotifyContext.Provider value={{ show, success, error, warning, info }}>
      {children}
    </NotifyContext.Provider>
  );
};

export const useNotify = () => {
  const context = useContext(NotifyContext);
  if (!context) {
    throw new Error('useNotify debe usarse dentro de NotifyProvider');
  }
  return context;
};
