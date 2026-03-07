import { errorCodes } from './index'

export class AppCtxNotInitializedError extends Error {
  code = errorCodes.APPCTX_NOT_INITIALIZED
  constructor(message: string) {
    super(message)
    this.name = 'AppCtxNotInitializedError'
  }
}
