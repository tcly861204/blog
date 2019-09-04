---
layout: posts
title: vue-cli3内存溢出
date: 2019-09-04 11:08:02
categories: 学习笔记
tags: [vue, build]
copyright: ture
---

# 起因

本地一个项目是使用vue-cli2构建的，可以正常运行。
打算升级到vue-cli@3，遭遇了运行npm run dev无法运行，爆出JavaScript heap out of memory 的问题。


# vue-cli2遇到此问题的解决办法：

> `npm run dev` 和 `npm run build` 直接在前面加上`--max_old_space_size=4096`


# vue-cli3遇到此问题的解决办法：
> `scripts`中添加一句指令
> 安装两个npm包 ： `increase-memory-limit` 和`cross-env`
> 安装完成后，先执行一次 `npm run fix-memory-limit`，然后`yarn serve`启动即可

```
"scripts": {
   "serve": "vue-cli-service serve",
   "build": "vue-cli-service build",    
   "fix-memory-limit": "cross-env LIMIT=4096 increase-memory-limit",
},
# 同时安装 2 个依赖包
"devDependencies": {
   "increase-memory-limit": "^1.0.3",
   "cross-env": "^5.0.5"
}
```


> vue-cli3 的解决办法找了半天才找到，说一下修复原理。
> 它不能像vue-cli2直接在 npm run dev中间添加一个参数，我尝试了几种方法只有使用安装模块fix-memory-limit的方式生效，其原理是修改了node_modules中一个叫做.bin（通常就是第一个文件夹）的文件夹内所有文件权限。


方法一：在package.json中scripts原基础上添加参数，以及尝试使用npx。不行。


方法二： 在node_modules中的vue-cli-sevie源代码中添加一句。 不行。


> 原文地址[https://blog.csdn.net/win7583362/article/details/86305780](https://blog.csdn.net/win7583362/article/details/86305780)