---
layout: posts
title: vue窗口自定义窗口
date: 2019-07-31 12:44:00
categories: 学习笔记
tags: [javscript, vue]
copyright: ture
---

## 窗口调用方法
```
import Vue from 'vue'
let components = {}
export default {
  // 创建入口
  install (config) {
    if (!config.component) {
      return
    }
    let __file = config.component.__file
    if (components[__file]) {
      // 对传入的值进行重新赋值
      if ('options' in config && typeof config.options === 'object') {
        Object.keys(config.options).map(key => {
          components[__file].model._data[key] = config.options[key]
        })
      }
      this.show(__file)
      return
    }
    this.created(config, __file) // 创建
    this.listeners(config, __file) // 加入监听队列
    this.show(__file)
  },
  // 创建示例
  created (config, __file) {
    const Model = Vue.extend(config.component)
    let options = {
      provide () {
        return {
          app: Object.assign({}, config.app || {}),
          model: this
        }
      }
    }
    if (config.router) {
      options.router = config.router
    }
    options.data = Object.assign({ app: config.app || {} }, config.options)
    let _model = new Model(options)
    _model.$mount()
    document.body.appendChild(_model.$el)
    components[__file] = {
      model: _model, // model
      listen: false // 是否加入了监听
    }
    return _model
  },
  // 监听
  listeners (config, __file) {
    Object.keys(components).map(key => {
      let cp = components[key]
      if (!cp.listen) {
        cp.listen = true
        let _listen = Object.assign({
          close: () => {},
          update: null,
          router: null
        }, ('on' in config && typeof config.on === 'object') ? config.on : {})
        Object.keys(_listen).map(key => {
          switch (key) {
            case 'close':
            case 'router':
            case 'update':
              if (_listen[key] && typeof _listen[key] === 'function') {
                cp.model.$on(`on-${key}`, (...args) => {
                  _listen[key].apply(cp.model, args)
                  if (key === 'close' || key === 'router') {
                    if ('destroy' in config && config.destroy) {
                      this.destroy(config)
                    } else {
                      this.hide(__file)
                    }
                  }
                })
              }
              break
            default:
              // 用以匹配任意方法
              cp.model.$on(`on-${key}`, (...args) => {
                _listen[key].apply(cp.model, args)
              })
          }
        })
      }
      return cp
    })
  },
  hasTemplate (__file) {
    return new Promise((resolve, reject) => {
      let _find = false
      components[__file].model.$children.map(child => {
        if ('model__' in child && child.model__ === 'iv-custom-model' &&
          child.$options.componentName === 'CustModelTemplate') {
          resolve(child)
          _find = true
        }
      })
      if (!_find) {
        reject(_find)
      }
    })
  },
  // 示例显示
  show: function (__file) {
    this.hasTemplate(__file).then(child => {
      child.visible = true
    })
  },
  // 示例隐藏
  hide: function (__file) {
    this.hasTemplate(__file).then(child => {
      child.visible = false
    })
  },
  // 销毁
  destroy: function (config) {
    if (config && config.component) {
      let __file = config.component.__file
      if (__file in components && components[__file]) {
        components[__file].model.$el.parentNode.removeChild(components[__file].model.$el)
        components[__file] = null
        delete components[__file]
      }
    }
  }
}
```

## 配套窗口模板
```
<template>
  <div class="iv-custom-mask" v-show="visible" :style="maskStyle" @click.stop="onCloseHandle">
    <div class="iv-custom-model" ref="model" :style="styles">
      <section class="iv-custom-model__header"
      @mousedown.stop="onMouseDownHandle"
      :style="headStyle" v-if="header">
        <slot name="header">
          <h2 class="iv-custom-model__header-title" :style="titleStyle">{{title}}</h2>
          <Icon v-if="full" :class="full" :type="fullFlag ? 'ios-contract' : 'ios-expand'" size="18" @click="onFullHandle" />
          <i class="close omd omd-close" @click.stop="onCloseHandle" />
        </slot>
      </section>
      <section class="iv-custom-model__main" :style="mainStyles">
        <Spin fix v-if="pageLoading"></Spin>
        <slot></slot>
      </section>
      <section class="iv-custom-model__footer" :style="footStyle" v-if="footer">
        <div class="iv-custom-model__footer-prefix">
          <slot name="footPrefix" />
        </div>
        <div class="iv-custom-model__footer-btns">
          <slot name="footer">
            <Button type="text" :size="footButtonSize" @click="onCancelHandle">{{cancelText}}</Button>
            <Button type="primary" :size="footButtonSize" :disabled="saveDisabled" :loading="loading" @click="onSaveHandle">{{okText}}</Button>
          </slot>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  name: 'iv-custom-model',
  componentName: 'CustModelTemplate',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    pageLoading: {
      type: Boolean,
      default: false
    },
    mask: {
      type: Boolean,
      default: false
    },
    full: {
      type: Boolean,
      default: false
    },
    header: {
      type: Boolean,
      default: true
    },
    headHeight: {
      type: [ Number, String ],
      default: 50
    },
    footer: {
      type: Boolean,
      default: true
    },
    footHeight: {
      type: [ Number, String ],
      default: 50
    },
    footButtonSize: {
      type: String,
      default: 'default'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    okText: {
      type: String,
      default: '保存'
    },
    title: {
      type: String,
      default: ''
    },
    zIndex: {
      type: Number,
      default: 1200
    },
    titleStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    saveDisabled: {
      type: Boolean,
      default: false
    },
    // 是否自定义位置 默认居中
    position: {
      type: Boolean,
      default: false
    },
    bgColor: {
      type: String,
      default: '#f5f5f5'
    },
    top: {
      type: [Number, String],
      default: 0
    },
    left: {
      type: [Number, String],
      default: 0
    },
    width: {
      type: [Number, String],
      default: 600
    },
    height: {
      type: [Number, String],
      default: 420
    }
  },
  data () {
    return {
      fullFlag: false,
      mouseMoveHandle: null,
      mouseUpHandle: null,
      visible: false,
      model__: 'iv-custom-model',
      dist: {
        isMove: false,
        disX: 0,
        disY: 0,
        left: 0,
        top: 0
      }
    }
  },
  computed: {
    maskStyle () {
      if (this.mask) {
        return {
          zIndex: 1000,
          background: `rgba(0, 0, 0, 0.2)`
        }
      } else {
        return {
          background: `rgba(0, 0, 0, 0)`
        }
      }
    },
    styles () {
      if (this.position) {
        return {
          width: `${this.width}px`,
          height: `${this.height}px`,
          top: `${this.top}px`,
          left: `${this.left}px`,
          zIndex: this.zIndex,
          margin: 'unset'
        }
      }
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    },
    headStyle () {
      return {
        cursor: `${this.position ? 'move' : 'default'}`,
        height: `${this.headHeight}px`,
        lineHeight: `${this.headHeight}px`
      }
    },
    footStyle () {
      return {
        height: `${this.headHeight}px`,
        lineHeight: `${this.headHeight}px`
      }
    },
    mainStyles () {
      let _header = this.header ? parseInt(this.headHeight) : 0
      let _footer = this.footer ? parseInt(this.footHeight) : 0
      return {
        height: `calc(100% - ${_header + _footer}px)`,
        background: this.bgColor
      }
    }
  },
  mounted () {
    let self = this
    this.mouseMoveHandle = function (e) {
      if (self.position && self.dist.isMove) {
        let x = e.pageX - self.dist.disX
        let y = e.pageY - self.dist.disY
        self.$refs.model.style.left = self.dist.left + x + 'px'
        self.$refs.model.style.top = self.dist.top + y + 'px'
      }
    }
    this.mouseUpHandle = function () {
      if (self.position && self.dist.isMove) {
        self.dist.isMove = false
      }
    }
    window.document.addEventListener('mousemove', this.mouseMoveHandle, false)
    window.document.addEventListener('mouseup', this.mouseUpHandle, false)
  },
  methods: {
    _removeEvents () {
      window.document.removeEventListener('mousemove', this.mouseMoveHandle, false)
      window.document.removeEventListener('mouseup', this.mouseUpHandle, false)
    },
    onMouseDownHandle (e) {
      if (!this.position) {
        return
      }
      this.dist.isMove = true
      this.dist.disX = e.pageX
      this.dist.disY = e.pageY
      this.dist.top = parseInt(this.$refs.model.style.top)
      this.dist.left = parseInt(this.$refs.model.style.left)
    },
    onCancelHandle () {
      this.$emit('on-close')
    },
    onSaveHandle () {
      if (!this.loading) {
        this.$emit('on-save')
      }
    },
    onFullHandle () {
      this.fullFlag = !this.fullFlag
      if (this.fullFlag) {
        this.$refs.model.style.cssText = `width: ${window.innerWidth}px; height: ${window.innerHeight}px; top: 0; left: 0; z-index: 9999; border-radius: 0; border: none;`
      } else {
        this.$refs.model.style.cssText = `width: ${this.width}px; height: ${this.height}px;`
      }
      this.$emit('on-full', this.fullFlag)
    },
    onCloseHandle ($event) {
      if (['iv-custom-mask', 'close omd omd-close'].includes($event.target.className)) {
        this.$emit('on-close')
      }
    }
  }
}
</script>
<style lang="less" scoped>
@borderColor: #e1e1e1;
.iv-custom-mask{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
.iv-custom-model{
  position: absolute;
  border: none;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,.15);
  &__header{
    background: #fff;
    border-bottom: 1px solid @borderColor;
    position: relative;
    &-title{
      width: auto;
      font-weight: normal;
      padding: 0 15px;
      display: inline-block;
    }
    .close{
      position: absolute;
      font-size: 20px;
      top: 12px;
      right: 12px;
      cursor: pointer;
    }
    .ivu-icon{
      position: absolute;
      font-size: 20px;
      top: 13px;
      right: 38px;
      cursor: pointer;
    }
  }
  &__main{
    box-sizing: border-box;
    padding: 15px;
    overflow: auto;
  }
  &__footer{
    display: flex;
    background: #fff;
    border-top: 1px solid @borderColor;
    text-align: right;
    padding: 0 15px;
    &-prefix{
      flex: 1;
      text-align: left;
    }
    &-btns{
      width: auto;
    }
  }
}
</style>

```