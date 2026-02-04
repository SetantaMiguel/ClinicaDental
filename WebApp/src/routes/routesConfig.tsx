
import Dashboard from '../pages/Dashboard';
import Pacientes from '../pages/Pacientes';
import React from 'react';

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
];