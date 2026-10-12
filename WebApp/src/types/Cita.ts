export interface Cita {
    id: number;
    idPaciente: number;
    tiposCitaIds: number[];
    fechaInicio: string;
    horaInicio: string;
    fechaFin: string;
    horaFin: string;
    observaciones?: string | null;
}