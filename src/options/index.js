import Vue from 'vue'
import App from './App.vue'

Vue.component('app-component', App)

// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => {
    return h(App)
  }
})
