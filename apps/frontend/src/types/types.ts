export interface ErrorValidation {
  ruta: string;
  mensaje: string;
}

export interface CampoValidable {
  mandatory: boolean;
  value: unknown;
}

export type Validacion = {
  [key: string]: CampoValidable | Validacion | unknown[];
};
