import { InvalidParamError, MissingParamError } from "../errors";
import { BadRequest, InternalServerError } from "../helpers/http-helper";
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from "../protocols";
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFileds = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];
      for (const field of requiredFileds) {
        if (!httpRequest.body[field]) {
          return BadRequest(new MissingParamError(field));
        }
      }

      if(httpRequest.body.password != httpRequest.body.passwordConfirmation) {
        return BadRequest(new InvalidParamError("passwordConfirmation"));
      }
      
      const isValid = this.emailValidator.isValid(httpRequest.body.email);

      if (!isValid) {
        return BadRequest(new InvalidParamError("email"));
      }
    } catch (error) {
      return InternalServerError();
    }
  }
}
