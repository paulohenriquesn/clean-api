import { MissingParamError } from "../errors/missing-param-error";
import { BadRequest } from "../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFileds = ['name', 'email', 'password']
    for(const field of requiredFileds) {
      if (!httpRequest.body[field]) {
        return BadRequest(new MissingParamError(field))
      }
    }
  }
}
