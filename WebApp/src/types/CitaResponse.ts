export interface CitaApiResponse {
  id: number;
  pacienteId: number;
  fechaInicio: string;
  fechaFin: string;
  observaciones?: string | null;
  pacienteNombre: string;
  estadoCitaCodigo: string;
  estadoCitaDescripcion: string;
  citaRecibo?: CitaReciboResponse;
  fechaInicioDate?:Date;
  usuarioCreacion?: string;
  tiposCita?: CitaCatalogos[];
}

interface CitaCatalogos{
  idTipoCita: number;
  tipoCitaNombre: string;
}

interface CitaReciboResponse {
  idRecibo: number;
  medioPago: number;
  montoNeto: number;
  observaciones: string;
  moneda: CitaReciboMonedaResponse;
}

interface CitaReciboMonedaResponse {
  idMoneda: number;
  monedaDescripcion: string;
  monedaSimbolo: string;
}