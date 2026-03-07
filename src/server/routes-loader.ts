import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { context } from '../core/app-context'
import { resolve } from '../core/resolver'
import { storage } from '../metadata/metadata-storage'
import { ControllerMetadata, RouteMetadata } from '../metadata/metadata'
import { ValidationError } from '../errors/validation-failed.error'
import { InvalidContentTypeError } from '../errors/invalid-content-type.error'

// 解析参数
function parseParam(locations: string[], request: FastifyRequest) {
  if (locations[0] === 'request') {
    if (locations.length === 1) {
      return request
    }
    if (
      locations[1] === 'body' ||
      locations[1] === 'params' ||
      locations[1] === 'headers'
    ) {
      if (locations.length === 2) {
        return request[locations[1]]
      }
      if (locations[2]) {
        return (request[locations[1]] as any)?.[locations[2]]
      }
    }
  }
}

// 创建插件
function createPlugin(
  controller: ControllerMetadata,
  route: RouteMetadata,
  propertyName: string
) {
  const path = controller.prefix + route.path
  const paramValues: any[] = []
  const handler = () => {
    return resolve(controller.target)[propertyName](...paramValues)
  }
  const plugin: FastifyPluginAsync = async (fastify, opts) => {
    if (route.method === 'GET') {
      fastify.get(path, handler)
    }
    if (route.method === 'POST') {
      fastify.post(path, handler)
    }

    if (route.method === 'PUT') {
      fastify.put(path, handler)
    }

    if (route.method === 'DELETE') {
      fastify.delete(path, handler)
    }

    // 数据校验模块
    fastify.addHook('preValidation', async (request, reply) => {
      for (const paramMd of route.parameters) {
        if (paramMd.dto) {
          const key = paramMd.locations[2]
          const value = parseParam(paramMd.locations, request)
          paramValues.push(value)
          let instance
          if (key) {
            instance = plainToInstance(paramMd.dto as ClassConstructor<any>, {
              [key]: value
            })
          } else {
            if (typeof value === 'string') {
              throw new InvalidContentTypeError(
                `Expected 'application/json', but received 'text/plain'`
              )
            }
            instance = plainToInstance(
              paramMd.dto as ClassConstructor<any>,
              value
            )
          }
          const errors = await validate(instance)
          if (errors.length > 0) {
            const messages = errors[0].constraints as {
              [key: string]: string
            }
            const msg = messages[Object.keys(messages)[0]]
            throw new ValidationError(msg)
          }
        }
      }
    })
  }
  return plugin
}

// 通过元数据加载路由模块
export function loadRoutes() {
  storage.metadata.each<ControllerMetadata>((controller) => {
    controller.each<RouteMetadata>((route, propertyName) => {
      context
        .getFastify()
        .register(createPlugin(controller, route, propertyName))
    })
  })
}
