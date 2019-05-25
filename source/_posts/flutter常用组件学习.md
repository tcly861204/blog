---
layout: posts
title: flutter常用组件学习
date: 2019-05-25 22:59:47
categories: 学习笔记
tags: [flutter, dart]
copyright: ture
---

# flutter常用组件学习

## text文本组件
```
child: Text(
  'Flutter是谷歌的移动UI框架，可以快速在iOS和Android上构建高质量的原生用户界面。Flutter可以与现有的代码一起工作。在全世界，Flutter正在被越来越多的开发者和组织使用，并且Flutter是完全免费、开源的。它也是构建未来的Google Fuchsi.',
  textAlign: TextAlign.start,
  maxLines: 2,
  // overflow: TextOverflow.clip,
  // overflow: TextOverflow.fade,
  overflow: TextOverflow.ellipsis,
  style: TextStyle(
    fontSize: 16.0,
    color: Color.fromARGB(255, 125, 0, 1),
    decoration: TextDecoration.underline,
    decorationStyle: TextDecorationStyle.solid
  ),
),
```

## Container组件
> 此组件有点类型html中的div
```
 child: Container(
  child: new Text(
    'hello wutianci',
    style: TextStyle(
      fontSize: 40.0,
      color: Color.fromRGBO(255, 255, 255, 1),
    ),
  ),
  alignment: Alignment.topLeft,
  width: 500.0,
  height: 400.0,
  color: Colors.lightBlue,
  // padding: const EdgeInsets.all(10.0),
  padding: const EdgeInsets.fromLTRB(20.0, 10.0, 0, 0),
  margin: const EdgeInsets.all(10.0),
  decoration: new BoxDecoration(
    gradient: const LinearGradient(
      colors: [Colors.lightBlue,Colors.greenAccent,Colors.purple]
    )
  ),
),
```