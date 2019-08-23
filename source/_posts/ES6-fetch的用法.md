---
layout: posts
title: ES6-fetch的用法
date: 2019-08-23 16:34:30
categories: 学习笔记
tags: [es6]
copyright: ture
---

# Fetch
fetch是用来取代传统的XMLHttpRequest的。 它的优点很多，包括链式调用的语法、返回promise等。
fetch api是基于promise的设计，它是为了取代传统xhr的不合理的写法而生的。

# 传统ajax
xhr请求写起来非常的混乱，如下所示

```
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.responseType = 'json';
xhr.onload = function() {
  console.log(xhr.response);
};
xhr.onerror = function() {
  console.log("Oops, error");
};
xhr.send();
```

但是使用fetch之后，如下所示：
```
fetch(url).then(function(response) {
  return response.json();
}).then(function(data) {
  console.log(data);
}).catch(function(e) {
  console.log("Oops, error");
});

```
这种链式调用的风格看上去会非常舒服。

如果我们再使用了箭头函数就会更加简洁了。 
```
fetch(url).then(response => response.json())
  .then(data => console.log(data))
  .catch(e => console.log("Oops, error", e))
```　
通过使用fetch api，可以将传统的xhr的粗糙的使用方法转化的如此精简，实在是好！


# Fetch API

> Fetch API提供了一个fetch()方法，它被定义在BOM的window对象中，你可以用它来发起对远程资源的请求。 该方法返回的是一个Promise对象，让你能够对请求的返回结果进行检索。 

+ 通过fetch的形式获取数据 
+ JSONP、CORS、服务器跨域 
+ CORS请求头 

```
Access-Control-Allow-Origin", "*" //所有的网站 
Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With" 
Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS" //Restful请求规范 支持符合Restful的所有协议

```

# fetch只支持跨域CORS 不支持JSONP跨越

```
<script>
  //fetch发送数据
  //支持CORS跨域,没有办法接受jsonp数据
  function getData() {
      //支持 cors跨域url地址'http://api.yytianqi.com/air?city=CH010100&key=2c5br4sgmguremgg'
      //https://api.douban.com/v2/book/1220562?callback=func
      return fetch('http://localhost:3001/getdata')
          .then(function (response) {
              console.log(response);
              //promise对象返回
              return response.json();
          })
  }
  getData().then(function (data) {
      console.log(data);
  })
</script>
```

# fetch-jsonp跨域是可以支持jsonp跨域
> npm install fetch-jsonp

//fetch所支持的jsonp发送数据请求 function getFetchJSONP(){ // return fetchJsonp('https://api.douban.com/v2/book/1220562',{ return fetchJsonp('http://localhost:3001/getjsonp',{ //告诉fetchjsonp使用jsonp跨域 jsonpCallback: 'callback' }) .then(function (response) { //拿到整个响应数据 //返回响应中的主要数据 return response.json(); }) } getFetchJSONP().then(function (data) { console.log(data); })

# JSONP、CORS、服务器跨域 3种跨域方案

跨域方案很多，除了这三种，还有active控件 iframe 

跨域不安全，不推荐跨域

```
var express =require('express');
var app=new express();
var request=require('request');

//1 CORS跨域
app.use(function (req,res,next) {
   //每一次发送的请求头
    //支持cors跨域
    res.header('Access-Control-Allow-Origin','*');
    next();
});
app.get('/getdata',function (req,res) {
    res.send('{"text":"CORS跨域"}');
});
//2 jsonp跨域
app.get('/getjsonp',function (req,res) {
    console.log(req.query.callback);
    console.log(req.querystring);
   res.send(`;${req.query.callback}({"text":"CORS跨域"});`);
});
//3 服务器转发跨域
app.get('/request',function (req,res) {
   var url='https://api.douban.com/v2/book/1220562'
    request(url,function (error,response,body) {
        console.log(body);
        if(!error){

            res.send(body);
        }
    })
});
app.listen('3001',function(){
    console.log('端口3001被打开了');
});
```