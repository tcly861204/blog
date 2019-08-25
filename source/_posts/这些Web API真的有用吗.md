---
layout: posts
title: 这些Web API真的有用吗? 别问，问就是有用🈶
date: 2019-08-25 17:33:55
categories: 学习笔记
tags: [js, html, css]
copyright: ture
---

本文列举了一些列比较不常见的Web API，内容较多，所以有关兼容性的内容在本文不会出现，大家可以自己去查阅。 以下案例能配动图的我尽量去配了，以免内容枯草乏味，但是如果内容有误，也请大家亲喷或者纠正👌

# 方法列表

1. querySelector（元素向下查询，返回一个）
2. querySelectorAll（元素向下查询，返回多个）
3. closest（元素向上查询）
4. dataset（获取元素以"data-"为前缀的属性集合）
5. URLSearchParams（查询参数）
6. hidden（隐藏元素）
7. contenteditable（使元素可以被编辑）
8. spellCheck（检查拼音）
9. classList（类名控制器）
10. getBoundingClientRect（元素空间结构详细信息）
11. contains（判断是否包含指定元素）
12. online state（网络状态）
13. battery state（电池状态）
14. vibration（设备震动）
15. page visibility（页面可见性）
16. deviceOrientation（陀螺仪）
17. toDataUrl（画布内容转base64）
18. customEvent（自定义事件）
19. notification（桌面通知）
20. fullScreen（全屏）
21. orientation（屏幕方向）

# 逐个击破

## querySelector
都9102年了，还在用getElementById吗😭
获取指定元素中匹配css选择器的元素：

```
// 作用在document
document.querySelector("#nav"); // 获取文档中id="nav"的元素
document.querySelector(".nav"); // 获取文档中class="nav"的元素
document.querySelector("#nav li:first-child"); // 获取文档中id="nav"下面的第一个li元素

// 也可以作用在其他元素
let nav = dodocument.querySelector("#nav");
nav.querySelector("li"); // 如果有多个li的话，返回第一个li
```

## querySelectorAll
获取指定元素中匹配css选择器的所有元素：

```
let list = document.querySelectorAll("li");  // NodeList(2) [li, li] 这里假设返回2个
```

注意：返回的值是一个类数组，无法使用数组的原生方法（`forEach`、`map`等），需要转换一下：

```
Array.from(list).map();
```

## closest
跟querySelector相反，该元素可以向上查询，也就是可以查询到父元素：

```
document.querySelector("li").closest("#nav");
```

## dataset
就跟原生微信小程序一样，能获取标签上以"data-"为前缀的属性集合：

```
<p data-name="蜘蛛侠" data-age="16"></p>
```
```
document.querySelector("p").dataset; // {name: "蜘蛛侠", age: "16"}
```
注意：虽然可以用`getAttribute`方法获取任何属性值，但是性质却不一样，这是开发规范问题，凡是自定义属性都要加上data-前缀哦✅


## URLSearchParams

假设浏览器的url参数是 "?name=蜘蛛侠&age=16"

```
new URLSearchParams(location.search).get("name"); // 蜘蛛侠
```

## hidden
这是一个html属性，规定元素是否隐藏，表现跟css的display: none一致：
```
<div hidden>我被隐藏了</div>
document.querySelector("div").hidden = true / false;
```


## contenteditable
可以使一个元素可以被用户编辑：
```
<p contenteditable>我是P元素，但是我也可以被编辑</p>
```



