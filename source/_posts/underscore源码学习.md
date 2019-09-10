---
layout: posts
title: underscore源码学习
date: 2019-09-10 22:55:07
categories: 学习笔记
tags: [js, underscore]
copyright: ture
---

```
(function(){
  const root = (typeof self === 'object' && self.self === self && self) ||
               (typeof global === 'object' && global.global === global && global) ||
               this ||
               {};

  const _ = function(obj) {
    if (obj instanceof _) return obj;
    if(!(this instanceof _)) return new _(obj);
    this._wrapped = obj || []
  }
  const ArrayProto = Array.prototype;
  const push = ArrayProto.push;
  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }
  _.VERSION = '0.1';

  _.each = function (arr, cb) {
    let i = 0;
    let Len = arr.length;
    while(i < Len) {
      if (_.isFunction(cb)) {
        cb.call(arr[i], arr[i], i)
      }
      i++
    }
    return this
  }
  
  _.isFunction = function(obj) {
    return typeof obj == 'function' || false;
  };

  _.functions = function(obj) {
    const names = [];
    for(let key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  }
  
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
        var func = _[name] = obj[name];
        _.prototype[name] = function() {
          let fn = null
          _.each(Array.from(arguments), item => {
            if (!_.isFunction(item)) {
              this._wrapped = [...this._wrapped, ...item]
            } else {
              fn = item
            }
          })
          if (!fn) {
            return this
          }
          let args = [this._wrapped];
          push.apply(args, [fn]);
          return func.apply(_, args);
        };
    });
    return _;
  };
  _.mixin(_)
})()


```