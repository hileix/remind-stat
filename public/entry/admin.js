import Vue from 'vue'
import Admin from '../vue/admin.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../common/style/admin.css'
Vue.use(ElementUI)

new Vue({
  render: (createElement) => createElement(Admin)
}).$mount('#app')