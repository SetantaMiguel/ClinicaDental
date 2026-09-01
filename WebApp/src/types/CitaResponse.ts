export interface CitaApiResponse {
  id: number;
  pacienteId: number;
  tipoCitaId: number;
  fechaInicio: string;
  fechaFin: string;
  observaciones?: string | null;
  pacienteNombre: string;
  tipoCitaNombre: string;
  estadoCitaCodigo: string;
  estadoCitaDescripcion: string;
  citaRecibo?: CitaReciboResponse;
  fechaInicioDate?:Date;
}

interface CitaReciboResponse {
  idRecibo: number;
  medioPago: number;
  montoNeto: number;
  observaciones: string;
}
