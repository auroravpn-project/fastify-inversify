import { errorCodes } from './index'

export class ServiceNotBoundError extends Error {
  code = errorCodes.SERVICE_NOT_BOUND
  constructor(message: string) {
    super(message)
    this.name = 'ServiceNotBoundError'
  }
}
