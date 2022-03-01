import { InvalidParmError, MissingParmError, ServerError } from '../../errors'
import { SignUpController } from './signup'
import { EmailValidator, AccountModel, AddAccount, AddAccountModel } from './signup-protocols'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

//regra de negocio cria-se em camada diferente de protocols neste caso model
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',          
        email: 'valid_email@email.com',
        password: 'valid_password'  
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

//factory instancia em todos os testes
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordCofirmation: 'any_password'   
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect (httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParmError('name'))
  })
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordCofirmation: 'any_password'   
      }
    }        
    const httpResponse = await sut.handle(httpRequest)    
    expect (httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParmError('email'))    
  })
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'

      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParmError('password'))
  })

  test('Should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'

      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParmError('passwordConfirmation'))
  })

  test('Should return 400 if password confirmation email fail', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParmError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provied', async () => {
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
    const httpResponse = await sut.handle01(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParmError('email'))
  })

  test('Should call EmailValidator correct email', async () => {
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
    await sut.handle01(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })
  //EmailValidator retornar uma excessao tem que retornar erro 500      
  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle01(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle01(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
})

  test('Should call AddAccount with correct value', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmatiom: 'any_password'
      }
    }
    await sut.handle01(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })
  test('Should return 200 if valid data is provied', async () => {
    const { sut } = makeSut()
    const httpRequest = {
    body: {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passordConfirmation: 'valid_password'
      }
    }
    const httpResponse = await sut.handle01(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'

    })
  })
})
