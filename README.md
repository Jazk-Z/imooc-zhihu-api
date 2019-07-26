## options 方法的作用

- 检测服务器所支持的请求方法
- CORS 中的预检请求

## koa allowedMethods 的作用

- 响应 options 方法 告诉他所支持的请求方法
- 相应的返回 405（不允许）koa 支持的请求方法 但是没写实现和 501（没实现）koa 没实现的方法

## RESTful API 最佳实践
