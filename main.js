import App from './App'
import Vue from 'vue'
import './uni.promisify.adaptor'
import { createSSRApp } from 'vue'
import projectUtils from '@/utils/projectUtils.js'
// #ifndef VUE3

Vue.config.productionTip = false
// 将工具类挂载到Vue原型上，方便全局使用
Vue.prototype.$projectUtils = projectUtils
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3

export function createApp() {
  const app = createSSRApp(App)
  // 在Vue3中挂载全局属性
  app.config.globalProperties.$projectUtils = projectUtils
  return {
    app
  }
}
// #endif