import { errorCodes } from './index'

export class ValidationError extends Error {
  code = errorCodes.VALIDATION_FAILED
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}
