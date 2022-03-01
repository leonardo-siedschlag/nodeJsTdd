import { HttpRequest, HttpResponse } from './http'
export interface Controller {
  handle( HttpResponse:HttpRequest ): Promise<HttpResponse>
}