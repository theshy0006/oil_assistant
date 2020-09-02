import Vue from 'vue'
import App from './App'

import store from './store'
Vue.prototype.$store = store

import global_ from './common/request.js'
Vue.prototype.GLOBAL = global_;

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()

