import type { CitaApiResponse } from "./CitaResponse";

export interface PacienteHistory {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string; 
  fechaNacimiento?: string | null;
  identificacion?: string | null;
  fechaCreacion?: string | null;
  lastCita?: string | null;
  montoPago:number;
  citas?: CitaApiResponse[];
}

