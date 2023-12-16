



  // error source
  export type TErrorSource = {
    path: string | number,
    message : string
  }[];



  // generic error response
export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSource;
}