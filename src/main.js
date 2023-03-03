import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueLuxon from 'vue-luxon'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueLuxon)

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
