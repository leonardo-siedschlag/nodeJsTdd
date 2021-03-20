import { MissingParmError } from '../errors/missing-param-error'

import { HttpResponse, HttpRequest } from '../protocols/htpp'
export class SignUpController {
  handle (httpRequest : HttpRequest): HttpResponse {
    
    if(!httpRequest.body.name){
      return {
          statusCode: 400,
          body: new MissingParmError('name')
      }
    }
    if(!httpRequest.body.email) {
      return {
          statusCode: 400,
          body: new MissingParmError('email')
      }
    }
}
}