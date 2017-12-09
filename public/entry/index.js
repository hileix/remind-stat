import Vue from 'vue'
import App from '../vue/app.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../common/style/index.css'
Vue.use(ElementUI)

new Vue({
  render: (createElement) => createElement(App)
}).$mount('#app')