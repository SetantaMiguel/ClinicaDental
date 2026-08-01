export interface Cita {
    id: number;
    idPaciente: number;
    tipoCitaId: number;
    fecha: string;
    hora: string;
    observaciones?: string | null;
}