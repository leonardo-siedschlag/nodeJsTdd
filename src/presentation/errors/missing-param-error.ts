                                    //Error padrao javascript
export class MissingParmError extends Error {
  constructor (paramName: string) {
    super('Missing param: ${paramName}')     
    this.name = 'MissingParamError'    
    }
}