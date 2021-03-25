import { MissingParmError } from '../errors/missing-param-error'
import { InvalidParmError } from '../errors/invalid-param-error'

import { SignUpController } from './signup'
import { EmailValidator } from '../protocols/email.validator'
interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

//factory instancia em todos os testes
const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  
  const sut = new SignUpController(emailValidatorStub)
  return{
    sut,
    emailValidatorStub
    }
  }

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
          body: {
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordCofirmation: 'any_password'   
            
          }
        }        
        const httpResponse = sut.handle(httpRequest)    
        expect (httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParmError('name'))    
  })
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
            name:'any_name',
            password: 'any_password',
            passwordCofirmation: 'any_password'   
        
      }
    }        
    const httpResponse = sut.handle(httpRequest)    
    expect (httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParmError('email'))    
})
  
test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
         name: 'any_name',
         email: 'any_email@mail.com',
         passwordConfirmation: 'any_password' 

      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParmError('password'))
  })

  test('Should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password' 

      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParmError('passwordConfirmation'))
  })
 
  test('Should return 400 if an invalid email is provied', () => {
            //recebe objeto 
    const { sut, emailValidatorStub } = makeSut()
                                             //moca um valor de retorno igual a false   
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passordConfirmation: 'any_password'        
      }
    }
    const httpResponse = sut.handle01(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParmError('email'))
    
    })

  test('Should call EmailValidator correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    //espionando o metodo isValid do emailValidatorStub
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passordConfirmation: 'any_password'
      }
    }
    sut.handle01(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })
})
