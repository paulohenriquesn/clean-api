import { InvalidParamError, MissingParamError } from '../../errors'
import { BadRequest, InternalServerError, ok } from '../../helpers/http-helper'
import { type AddAccount, type Controller, type EmailValidator, type HttpRequest, type HttpResponse } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFileds = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]
      for (const field of requiredFileds) {
        if (!httpRequest.body[field]) {
          return BadRequest(new MissingParamError(field))
        }
      }

      const { password, passwordConfirmation, email, name } = httpRequest.body

      if (password !== passwordConfirmation) {
        return BadRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return BadRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return InternalServerError()
    }
  }
}
