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

## 错误处理

- 运行时错误 都返回 500
- 逻辑错误 找不到 404 先决条件失败 412 无法处理的实体 参数不对 422

## 什么是 NoSQL

- 对不同于传统的关系型数据库的数据库管理系统的统称
- 分类

  - 列存储 HBase
  - 文档存储 MongoDB
  - Key-value 存储 Redis
  - 图存储
  - 对象存储
  - XML 存储

- 简单
- 便于横向拓展
- 适合超大规模存储
- 灵活存储复杂结构的数据

## 为什么用 MongoDB

- 性能好（内存计算）
- 大规模数据存储 可拓展行
- 可靠安全 本地复制 自动故障转移
- 方便存储复杂数据结构

## 不用设计表结构 但是 json 的结构还是要设计的 schema

## Session 简介

- 相比 JWT 最大的优势在于可以主动清除 session
- session 保存在服务器端 相对比较安全
- 结合 cookie 使用 较为灵活 兼容性较好

- cookie + session 在跨域场景表现不好
- 如果分布式部署 需要做多机共享 session 机制
- 基于 cookie 的机制很容易被 CSRF
- 查询 session 信息可能会有数据库的查询

## JSON Web Token （JWT）

— Header

- typ: token 的类型
- alg: 使用 hash 算法

- Payload
- Payload 可以加密
- 存储传递的信息
- 包含元数据
- Signature
  Signature = HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)
