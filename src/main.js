import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 阿里图标库
import './assets/fonts/iconfont.css'
// 全局样式
import './assets/css/global.css'
// 树形表插件
import TreeTable from 'vue-table-with-tree-grid'
//文本编辑插件
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Nprogress from 'nprogress'
import 'nprogress/nprogress'

// 根据表头长度计算表格列宽全局指令
import './libs/LibsCSIGTableWidth';


import axios from 'axios'

// 配置请求路径
// axios.defaults.baseURL = 'https://d182cd49-8915-433c-886a-9bc554830d29.bspapp.com'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// 拦截器
axios.interceptors.request.use(config => {
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.use(VueQuillEditor)

Vue.component('tree-table', TreeTable)
Vue.filter('dataForm', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + "").padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${ss}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')