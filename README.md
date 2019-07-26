## options 方法的作用

- 检测服务器所支持的请求方法
- CORS 中的预检请求

## koa allowedMethods 的作用

- 响应 options 方法 告诉他所支持的请求方法
- 相应的返回 405（不允许）koa 支持的请求方法 但是没写实现和 501（没实现）koa 没实现的方法

## RESTful API 最佳实践

- post put 返回修改的对象
- delete 返回状态码 204

## 什么是控制器

- 获取 HTTP 请求参数
  - query string ?q=keyword
  - Router Params /users/:id
  - Body {name: 'wcc'} 请求体（json form）
  - 请求头 Header Accept Cookie
- 处理业务逻辑
- 发送 HTTP 响应
  - 发送 status
  - 发送 Body
  - 响应头 Header allow Content-Type

## 控制器的最佳实践

- 每个资源的控制器放在不同的文件里
- 尽量使用类+类的方法的形式编写控制器
- 严谨的错误处理

## 获取参数的方法

- 获取 query `ctx.query http://xxx.com?a=1`
- 获取 router params `ctx.params.id http://xxx.com/user/:id`
- 获取 body `安装koa-bodyparser ctx.request.body POST... {name: 'wcc'}`
- 获取 Header `ctx.header`

## 发送响应

- 发送 status `ctx.status = 204`
- 发送 body `ctx.body = 'hello world'`
- 发送 header `ctx.set('Allow', 'GET, POST')`

## 更合理的目录结构

- 将路由单独放在一个目录里
- 将控制器单独放在一个目录里
- 使用 类 + 类的方法的方式组织控制器
