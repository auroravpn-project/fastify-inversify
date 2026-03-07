import { errorCodes } from './index'

export class InvalidContentTypeError extends Error {
  code = errorCodes.INVALID_CONTENT_TYPE_ERROR
  constructor(message: string) {
    super(message)
    this.name = 'InvalidContentTypeError'
  }
}
