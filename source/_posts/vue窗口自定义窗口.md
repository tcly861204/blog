---
layout: posts
title: vue实现自定义窗口
date: 2019-07-31 12:44:00
categories: 学习笔记
tags: [javscript, vue]
copyright: ture
---

## 窗口调用方法
```
import Vue from 'vue'
let iNum = 0
let _components = {}
const _util = {
  // 查找对应的模板组件
  hasTemplate (__file) {
    return new Promise((resolve, reject) => {
      let _find = false
      _components[__file].model.$children.map(child => {
        if ('model__' in child && child.model__ === 'iv-custom-model' &&
          child.$options.componentName === 'CustModelTemplate') {
          _find = true
          resolve(child)
        }
      })
      if (!_find) {
        reject(_find)
      }
    })
  },
  // 查找组件
  findComponent (config) {
    let __file = null
    Object.keys(_components).map(key => {
      if (_components[key].component === config.component) {
        __file = key
      }
    })
    return __file
  },
  // 创建示例
  created (config) {
    iNum++
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
    const __file = 'model_' + iNum
    _components[__file] = {
      component: config.component,
      model: _model, // model
      listen: false // 是否加入了监听
    }
    _CustModel.show(__file)
    this.listeners(config, __file)
  },
  // 监听
  listeners (config, __file) {
    Object.keys(_components).map(key => {
      let cp = _components[key]
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
                      _CustModel.destroy(config)
                    } else {
                      _CustModel.hide(config)
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
  }
}
const _CustModel = {
  // 创建入口
  install (config) {
    if (!config.component) {
      return
    }
    let __file = _util.findComponent(config)
    if (__file) {
      if ('options' in config && typeof config.options === 'object') {
        Object.keys(config.options).map(key => {
          _components[__file].model._data[key] = config.options[key]
        })
      }
      this.show(__file)
    } else {
      _util.created(config)
    }
  },
  // 示例显示
  show: function (__file) {
    _util.hasTemplate(__file).then(child => {
      child.visible = true
    })
  },
  // 示例隐藏
  hide: function (config) {
    if (config && config.component) {
      let __file = _util.findComponent(config)
      if (__file) {
        _util.hasTemplate(__file).then(child => {
          child.visible = false
        })
      }
    }
  },
  // 销毁
  destroy: function (config) {
    if (config && config.component) {
      let __file = _util.findComponent(config)
      if (__file) {
        _components[__file].model.$destroy(true)
        _components[__file].model.$el.parentNode.removeChild(_components[__file].model.$el)
        _components[__file] = null
        delete _components[__file]
      }
    }
  }
}

export default _CustModel

```

## 配套窗口模板
```
<template>
  <div class="iv-custom-mask" v-show="visible" :style="maskStyle" @click.stop="onCloseHandle">
    <div class="iv-custom-model" ref="model" :style="styles">
      <section class="iv-custom-model__header"
      @mousedown.stop="onMouseDownHandle"
      :style="headStyle" v-if="header">
        <i v-if="icon" :style="`font-size: ${iconSize}px`" :class="['title-icon', icon]" />
        <slot class="iv-custom-model__header-title" name="header">
          <h2 class="iv-custom-model__header-title" :style="titleStyle">{{title}}</h2>
        </slot>
        <i v-if="full" :class="['full', 'ivu-icon', `ivu-icon-${fullFlag ? 'ios-contract' : 'ios-expand'}`]" @click="onFullHandle" />
        <i class="close omd omd-close" @click.stop="onCloseHandle" />
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
    icon: {
      type: String,
      default: ''
    },
    iconSize: {
      type: [String, Number],
      default: 22
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
      default: 2
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
  watch: {
    visible: {
      handler (v) {
        this.$emit('on-visible-change', v)
      }
    },
    immediate: true,
    deep: true
  },
  computed: {
    maskStyle () {
      if (this.mask) {
        return {
          zIndex: this.zIndex,
          background: `rgba(0, 0, 0, 0.2)`
        }
      } else {
        return {
          zIndex: this.zIndex,
          background: `rgba(0, 0, 0, 0)`
        }
      }
    },
    styles () {
      if (this.position) {
        return {
          width: `${this.width}px`,
          height: `${this.height > window.innerHeight ? (window.innerHeight - 40) : this.height}px`,
          top: `${this.top}px`,
          left: `${this.left}px`,
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
  z-index: 2;
}
.iv-custom-model{
  position: absolute;
  border: none;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,.15);
  &__header{
    background: #fff;
    border-bottom: 1px solid @borderColor;
    position: relative;
    .title-icon{
      margin: -7px 0 0 15px;
    }
    &-title{
      width: auto;
      font-weight: normal;
      padding: 0 15px;
      display: inline-block;
    }
    .close{
      position: absolute;
      font-size: 22px;
      top: 12px;
      right: 12px;
      cursor: pointer;
    }
    .full{
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
