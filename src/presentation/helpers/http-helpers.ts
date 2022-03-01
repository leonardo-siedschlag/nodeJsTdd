import { HttpResponse } from '../protocols/http'
import { ServerError } from '../errors/server-error'

//                            parametro     retorna
export const badRequest = (error: Error): HttpResponse => ({

  statusCode: 400,
  body: error

})//quando coloca parantes ele entende que quer retornar sintaxe chugar

export const serverError = (): HttpResponse => ({

  statusCode: 500,
  body: new ServerError()

})

export const ok = (data: any): HttpResponse => ({

  statusCode: 200,
  body: data

})

