---
layout: posts
title: javascript设计模式之单例模式
date: 2019-05-11 21:50:02
categories: 学习笔记
tags: [javscript, 设计模式]
copyright: ture
---

## 单例模式

保证一个类仅有一个实例，并提供一个访问它的全局访问点。例如：线程池，全局缓存，登录浮窗。
首先我们需要把单例的逻辑代码单独提取，然后使用惰性单例的方式，也就是返回方法。只有在点击的时候，才会进行执行。


javascript的单例，跟类不一样。无需创建多余的构造函数这些，直接创建全局变量即可。


```
!(function () {
    
    //管理单例的逻辑代码，如果没有数据则创建，有数据则返回
    var getSingle = function(fn){ //参数为创建对象的方法
       var result;
       return function(){ //判断是Null或赋值
           return result || (result = fn.apply(this,arguments));
       };
    };
    
    //创建登录窗口方法
    var createLoginLayer = function(){
        var div = document.createElement('div');
        div.innerHTML = '我是登录浮窗';
        div.style.display = 'none';
        document.body.appendChild(div);
        return div;
    };

    //单例方法
    var createSingleLoginLayer = getSingle(createLoginLayer);

    //使用惰性单例，进行创建
    document.getElementById('loginBtn').onclick = function(){
        var loginLayer = createSingleLoginLayer();
        loginLayer.style.display = 'block';
    };
})()

```
