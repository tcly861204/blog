---
layout: posts
title: koa构建大型项目
date: 2019-05-14 08:37:02
categories: 学习笔记
tags: [node, koa]
copyright: ture
---

# koa
Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。

## 原生http服务器

学习过Nodejs的朋友肯定对下面这段代码非常熟悉：

```
const http = require('http');
let server = http.createServer((req, res) => {
  // ....回调函数，输出hello world
  res.end('hello world!')
})
server.listen(3000)

```

就这样简单几行代码，就搭建了一个简单的服务器，服务器以回调函数的形式处理HTTP请求。上面这段代码还有一种更加清晰的等价形式，代码如下：

```
let server = new http.Server();
server.on("request", function(req, res){
  // ....回调函数，输出hello world
  res.end('hello world!')
});
server.listen(3000);
```
首先创建了一个HttpServer的实例，对该实例进行request事件监听，server在3000端口进行监听。HttpServer继承与net.Server，它使用http_parser对连接的socket对象进行解析，当解析完成http header之后，会触发request事件，body数据继续保存在流中，直到使用data事件接收数据。

req是http.IncomingMessage实例(同时实现了Readable Stream接口)，详情请参看文档

res是http.ServerResponse实例(同时实现了Writable Stream接口)，详情请参看文档

## Koa写HTTP服务器

Koa 应用程序是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组织和执行的。

```
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```

Koa写http服务器的形式与我们直接通过node http模块写的方式差别很大。第一部分析可知，node的http服务器创建来自于http.createServer等方法，Koa中是如何从原生方法封装成koa形式的服务器呢？搞懂这个原理也就搞懂了Koa框架设计的理念。

## koa中的ctx对象

server.context 扩展ctx的原型， 相当于ctx.prototype

ctx.request
ctx.response

ctx.method  请求方法
ctx.url
ctx.path
ctx.query
ctx.ip        访客ip
ctx.headers   请求头


ctx.throw   报错退出
```
router.get('/login', async ctx => {
  if (!ctx.query.user || !ctx.query.pass) {
    ctx.throw(400, "user and password");
  }
})

```

ctx.assert
```
router.get('/login', async ctx => {
  ctx.assert(ctx.query.user, 400, 'username is required');
  ctx.assert(ctx.query.password, 400, 'password is required');
})
```

ctx.state = 200;
ctx.redirect 重定向

## koa-router


!!!未完待续...