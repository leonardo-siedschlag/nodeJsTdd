export interface HttpResponse {
    statsCode:  number
    body: any
}

export interface HttpRequest {
    //? opcional nem sempre vai body 
    body?: any
}