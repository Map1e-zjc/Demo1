import App from './App'
import Vue from 'vue'
import './uni.promisify.adaptor'
import { createSSRApp } from 'vue'
// #ifndef VUE3

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3

export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif