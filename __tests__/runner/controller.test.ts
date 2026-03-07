import { Container } from 'inversify'
import {
  Controller,
  Get,
  Param,
  InversifyFastify,
  Post,
  Body,
  Valid,
  errorCodes,
  Request
} from '../../src/index'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
class SubmitDTO {
  @IsNotEmpty({ message: '用户名是必填字段' })
  // @IsNotEmpty()
  @IsString({ message: '用户名必须是字符串' })
  @MaxLength(6, { message: '用户名不能大于六个字符' })
  username: string = ''

  @IsNotEmpty({ message: '密码是必填字段' })
  @IsString({ message: '密码必须是字符串' })
  @MaxLength(6, { message: '密码不能大于六位数' })
  password: string = ''
}

class QueryDTO {
  @MinLength(3, { message: '用户id最小3位' })
  uid: string = ''
}

@Controller()
class TestController {
  @Get('/hello/:uid')
  sayHello(@Valid(QueryDTO) @Param('uid') uid: string) {
    return `hello ${uid}`
    // return {
    //     uid
    // }
  }

  @Post('/submit')
  submit(@Valid(SubmitDTO) @Body() body: SubmitDTO, @Request() req: any) {
    // console.log(req)
    return 'success'
  }
}

const container = new Container()
container.bind(TestController).toSelf().inRequestScope()

const app = new InversifyFastify(container)

app.setExceptionInterceptor((error: any) => {
  if (error.statusCode === 400) {
    return {
      status: 400,
      payload: {
        msg: error.message
      }
    }
  }

  if (error.code === errorCodes.VALIDATION_FAILED) {
    return {
      status: 400,
      payload: {
        msg: error.message,
        status: 400,
        data: null
      }
    }
  }

  if (error.code === errorCodes.INVALID_CONTENT_TYPE_ERROR) {
    return {
      status: 415,
      payload: {
        msg: '类型错误'
      }
    }
  }

  if (error.code === errorCodes.INVALID_JSON_BODY) {
    return {
      status: 400,
      payload: {
        msg: '格式错误'
      }
    }
  }
  console.log(error)

  return {
    status: 500,
    payload: {
      msg: '服务器内部错误',
      status: 500,
      data: null
    }
  }
})

app.setResponseInterceptor((payload) => {
  return {
    status: 200,
    msg: 'success',
    data: payload
  }
})

app.setRequestInterceptor((request, reply) => {
  // throw new Error('error')
})

app.listen({ port: 2000, host: 'localhost' }, async () => {
  console.log('app is running')
})
