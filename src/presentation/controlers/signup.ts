import { MissingParmError } from '../errors/missing-param-error'

import { HttpResponse, HttpRequest } from '../protocols/http

import { badRequest } from '../helpers/http-helpers'
export class SignUpController {
  handle (httpRequest : HttpRequest): HttpResponse {
    
    if(!httpRequest.body.name){
      return badRequest(new MissingParmError('name'))
             
    }
    if(!httpRequest.body.email) {
      return badRequest(new MissingParmError('email'))
    }
}