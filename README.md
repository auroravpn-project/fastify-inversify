# Fastify-Inversify
### Table of Contents

- [Installation](#Installation)
- [Quickstart](#Quickstart)
  - [Basic usage](#Basic-usage)
  - [Auto-inject Parameters](#Auto-inject-Parameters)
  - [Input validation](#Input-validation)
  - [Intercepetors](#Intercepetors)
- [API References](#API-References)
  - [Constructor](#Constructor)
  - [Instance methods](#Instance-methods)
  - [Decorators](#Decorators)


### Installation

```bash
# 使用 npm
npm install @auroravpn/fastify-inversify inversify

# 使用 yarn
yarn add @auroravpn/fastify-inversify inversify

# 使用 pnpm
pnpm add @auroravpn/fastify-inversify inversify
```

### Quickstart
> ⚠️ **警告：** 本项目必须使用 Typescript 并启用装饰器选项

#### Basic usage

```typescript
// 引入包
import { InversifyFastify, Controller, Get } from '@auroravpn/fastify-di'
import { Container } from 'inversify'

// 创建 IOC 容器
const container = new Container()

// 创建应用
const app = new InversifyFastify(container)

// 创建路由
@Controller('/welcome')
class ExampleController {
    @Get('/hello')
    async sayHello() {
        return 'hello'
    }
}

// 启动应用
app.listen({ port: 3000, host: 'localhost' }, () => {
    console.log('App is running at http://localhost:3000')
})
```

#### Auto-inject Parameters

```typescript
@Controller('/welcome')
class ExampleController {
    @Get('/hello')
    async sayHello(@Param('uid') uid: string) {
        return `hello ${uid}`
    }
}
```

#### Input Validation

你需要通过`class-validator`创建DTO来实现数据验证功能，使用`npm install class-validator`以安装

```typescript
class ExampleDTO {
    @IsNotNull()
    @IsString()
    @MaxLength(6)
    user: string = ''
}

@Controller('/welcome')
class ExampleController {
    @Post('/submit')
    async submit(@Valid(ExampleDTO) @Body() body: ExampleDTO) {
        console.log(body.username)
        return 'success'
    }
}
```

#### Intercepetors

请求拦截器

```typescript
app.setRequestIntercepetor((request, reply) => {
    // 可以在请求拦截器中鉴权
})
```

响应拦截器

```typescript
app.setResponseInterceptor((payload) => {
    // 统一格式化响应数据
    return {
        status: 200,
        msg: 'success',
        data: payload
    }
})
```

错误拦截器

```typescript
app.setExceptionInterceptor((error: any) => {
    // 统一错误处理
    if (error.code === 'VALIDATION_FAILED') {
        return {
            status: 400,
            payload: {
                msg: error.message,
                status: 400,
                data: null
            }
        }
    }

    return {
        status: 500,
        payload: {
            msg: '服务器内部错误',
            status: 500,
            data: null
        }
    }
})
```

### API references

#### Constructor

##### `new InversifyFastify(container)`
**参数:**
- `container` (Inversify.Container): Inversify容器

#### Instance methods

##### `InversifyFastify.listen([opts], [callback])`

**参数：**
- `opts` (object): 配置对象
  - `host` (string): IP地址
  - `port` (number): 端口

**返回值：** (void)

**示例：**
```typescript
app.listen({ port: 3000, host: 'localhost' }, async () => {
    console.log('App is running at http://localhost:3000/')
})
```

##### `InversifyFastify.setRequestIntercepetor(handler)`

**参数：**

- `handler` ((request, reply) => unknown): 请求拦截器处理函数
  - `request` (FastifyRequest): 请求对象
  - `reply` (FastifyReply): 响应对象
  - **返回值:** (unknown)

**返回值:** (void)

**示例：**
```typescript
app.setRequestInterceptor((request, reply) => {
    // throw new Error('error')
})
```

##### `InversifyFastify.setResponseIntercepetor(handler)`

**参数：**

- `handler` ((payload) => unknown): 响应拦截器处理函数
  - `payload` (unkown): 响应载荷
  - **返回值:** (unknown)

**返回值:** (void)

**示例：**

```typescript
app.setResponseInterceptor((payload) => {
    return {
        status: 200,
        msg: 'success',
        data: payload
    }
})
```

##### `InversifyFastify.setExceptionIntercepetor(handler)`

**参数：**

- `handler` ((error) => unknown): 响应拦截器处理函数
  - `error` (unkown): 错误对象
  - **返回值:** (unknown)

**返回值:** (void)

**示例：**

```typescript
app.setExceptionInterceptor((error: any) => {
    if (error.code === 'VALIDATION_FAILED') {
        return {
            status: 400,
            payload: {
                msg: error.message,
                status: 400,
                data: null
            }
        }
    }
})
```

#### Decorators

##### `@Controller([prefix])`

标记控制器

**参数：**
- `prefix` (string): 可选, 路由前缀

**示例**

```typescript
@Controller('/test')
class TestController {}
```

##### `@Get(path)`

路由GET方法

**参数： ** `path` (string): 必须, 路由路径

**示例：**

```typescript
@Controller('/test')
class TestController {
    @Get('/submit')
    submit() {
        return 'success'
    }
}
```

##### `@Post(path)`
路由POST方法

**参数： ** `path` (string): 必须, 路由路径

**示例：**

```typescript
@Controller('/test')
class TestController {
    @Post('/submit')
    submit() {
        return 'success'
    }
}
```

##### `@Put(path)`
路由PUT方法

**参数：** `path` (string): 必须, 路由路径

**示例：**

```typescript
@Controller('/test')
class TestController {
    @Put('/edit')
    edit() {
        return 'success'
    }
}
```

##### `@Delete(path)`

路由DELETE方法

**参数：** `path` (string): 必须, 路由路径

**示例：**

```typescript
@Controller('/test')
class TestController {
    @Put('/delete')
    delete() {
        return 'success'
    }
}
```

##### `@Param([key])`

获取请求参数

**参数：** `key` (string): 可选, 如果传入, 则返回对应key的参数, 如果不传, 则返回整个params对象

**示例：**

```typescript
@Controller('/test')
class TestController {
    @Get('/user/:uid')
    edit(@Param('uid') uid: string) {
        return uid
    }
}
```

##### `@Header([key])`

获取请求头

**参数：** `key` (string): 可选, 如果传入, 则返回对应key的请求头, 如果不传, 则返回整个headers对象

**示例：**

```typescript
@Controller('/test')
class TestController {
    @Get('/users')
    edit(@Header('token') token: string) {
        return token
    }
}
```

##### `@Body()`

获取请求体

**示例：**

```typescript
@Controller('/test')
class TestController {
    @Get('/user/:uid')
    edit(@Body() body: any) {
        return body
    }
}
```

##### `@Valid([dto])`

数据验证

**参数：** `dto` (object): 必须, 传入`class-validator`创建的`DTO`对象

**示例：**

```typescript
class ExampleDTO {
    @IsNotNull()
    @IsString()
    @MaxLength(6)
    user: string = ''
}

@Controller('/test')
class TestController {
    @Post('/submit')
    async submit(@Valid(ExampleDTO) @Body() body: ExampleDTO) {
        console.log(body.username)
        return 'success'
    }
}
```



