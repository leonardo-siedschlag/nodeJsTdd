import { MissingParmError } from '../errors/missing-param-error'

import { HttpResponse, HttpRequest } from '../protocols/http'
import { Controller } from '../protocols/controlers'

import { badRequest } from '../helpers/http-helpers'
export class SignUpController implements Controller {
  handle (httpRequest : HttpRequest): HttpResponse {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

  for (const field of requiredFields){
      if(!httpRequest.body[field]){
          return badRequest(new  MissingParmError(field))    
      }
    }  
  }
}