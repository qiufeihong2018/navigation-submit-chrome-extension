/* eslint-disable */
import Vue from 'vue'
import './utils/insert-element-icons'
import App from './App.vue'
import {
  Button,
  Dialog,
  Form,
  FormItem,
  Input,
  Checkbox,
  Select,
  Option
} from 'element-ui'

Vue.use(Button)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Option)

const AppConstructor = Vue.extend(App)
const instance = new AppConstructor()
instance.$mount();
document.body.appendChild(instance.$el);

chrome.extension.onMessage.addListener(
  async function (request, sender, sendMessage) {
    instance.onMessage(request)
  }
)
