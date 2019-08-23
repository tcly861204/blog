---
title: 网页多线程webwork
date: 2019-08-23 16:39:15
categories: 学习笔记
tags: [es6, webwork]
copyright: ture
---
# webwork

多线程技术在服务端技术中已经发展的很成熟了，而在Web端的应用中却一直是鸡肋
在新的标准中，提供的新的WebWork API，让前端的异步工作变得异常简单。
使用：创建一个Worker对象，指向一个js文件，然后通过Worker对象往js文件发送消息，js文件内部的处理逻辑，处理完毕后，再发送消息回到当前页面，纯异步方式，不影响当前主页面渲染。

```
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title></title>
  <script type="text/javascript">
      //创建线程 work对象
      var work = new Worker("work.js");
      //发送消息
      work.postMessage("100");
      // 监听消息
      work.onmessage = function(event) {
          alert(event.data);
      };
  </script>
</head>
<body>
</body>
</html>
```
work.js
```
// 基本用法
onmessage = function (event) {
  //从1加到num
  var num = event.data; //通过event接收数据
  var result = 0;
  for (var i = 1; i <= num; i++) {
      result += i;
  }
  postMessage(result); // 通过此方法对外抛数据
}


// work.js 内部可以通过ajax 或 fetch 与服务端交互
`fetch 推荐`
addEventListener("message", function(event) {
  let postData = JSON.parse(event.data);
  fetch(`date.json?a=${postData.a}&b=${postData.b}`).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log(data);
    postMessage(data);
  }).catch(function(e) {
    console.log("Oops, error");
  });
}, false);

`ajax版`
addEventListener("message", function(event) {
  let postData = JSON.parse(event.data);
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    console.log(xhr.status)
    if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304){
      postMessage(xhr.responseText);
    }else if(xhr.status >=400){
      console.log("错误信息：" + xhr.status)
    }
  }
  xhr.open('GET', `date.json?a=${postData.a}&b=${postData.b}`, true);
  xhr.send()
}, false);
```
