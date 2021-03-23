import { HttpResponse } from '../protocols/http'
//                            parametro     retorna
export const badRequest = (error: Error): HttpResponse => ({

        statusCode: 400,
        body: error
    
})//quando coloca parantes ele entende que quer retornar sintaxe chugar