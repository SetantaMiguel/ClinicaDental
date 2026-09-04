
import Dashboard from '../pages/Dashboard';
import Pacientes from '../pages/Pacientes';
import React from 'react';
import Citas from '../pages/CitasCalendar';
import ConfigSistema from '../pages/ServiciosClinica';
import CitasResumen from '../pages/CitasResumen';
import ClinicalHistory from '../pages/ClinicalHistory';

export interface RouteConfig {
  path: string;
  element: React.ComponentType<any>;
  isPrivate: boolean;
  label?: string;
}

export const routes: RouteConfig[] = [
  { path: '/dashboard', element: Dashboard, isPrivate: true, label: 'Inicio' },
  { path: '/', element: Dashboard, isPrivate: true, label: 'Inicio' },
  { path: '/pacientes', element: Pacientes, isPrivate: true, label: 'Pacientes' },
  { path: '/citas', element: Citas, isPrivate: true, label: 'Citas' },
  { path: '/servicios', element: ConfigSistema, isPrivate: true, label: 'Servicios Clinica' },
  { path: '/citasListado', element: CitasResumen, isPrivate: true, label: 'Citas resumen' },
  { path: '/historialClinico/:id', element: ClinicalHistory, isPrivate: true, label: 'Historial Clínico' },
];