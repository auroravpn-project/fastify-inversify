import { errorCodes } from './index'

export class InvalidJsonBody extends Error {
  code = errorCodes.INVALID_JSON_BODY
  constructor(message: string) {
    super(message)
    this.name = 'InvalidJsonBody'
  }
}
