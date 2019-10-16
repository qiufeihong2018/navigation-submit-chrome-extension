import Vue from 'vue'
import AppComponent from './App.vue'

import {
  Card,
  Calendar,
  Button
} from 'element-ui'

Vue.component('app-component', AppComponent)

Vue.use(Card)
Vue.use(Calendar)
Vue.use(Button)

// eslint-disable-next-line
new Vue({
  el: '#app',
  render: createElement => {
    return createElement(AppComponent)
  }
})
