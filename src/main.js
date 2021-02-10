import 'core-js/stable'
import Vue from 'vue'
import './plugins'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App)
}).$mount('#app')
