export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string; 
  fechaNacimiento?: string | null;
  identificacion?: string | null;
}