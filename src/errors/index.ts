export const errorCodes = {
  APPCTX_NOT_INITIALIZED: 'APPCTX_NOT_INITIALIZED',
  INVALID_CONTENT_TYPE_ERROR: 'INVALID_CONTENT_TYPE_ERROR',
  SERVICE_NOT_BOUND: 'SERVICE_NOT_BOUND',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INVALID_JSON_BODY: 'INVALID_JSON_BODY'
} as const

import { AppCtxNotInitializedError } from './app-ctx-not-ini.error'
import { InvalidContentTypeError } from './invalid-content-type.error'
import { ServiceNotBoundError } from './service-not-bound.error'
import { ValidationError } from './validation-failed.error'

export {
  AppCtxNotInitializedError,
  InvalidContentTypeError,
  ServiceNotBoundError,
  ValidationError
}
