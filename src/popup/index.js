import Vue from 'vue'
import App from './App.vue'

import {
  Card,
  Calendar,
  Button
} from 'element-ui'

Vue.component('app-component', App)

Vue.use(Card)
Vue.use(Calendar)
Vue.use(Button)

// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => {
    return h(App)
  }
})
