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
  Select,
  Option
} from 'element-ui'

Vue.use(Button)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
// 使用基础 Vue 构造器，创建一个“子类”
const AppConstructor = Vue.extend(App)
const instance = new AppConstructor()
// 创建 AppConstructor 实例，并挂载到一个元素上。
instance.$mount();
// 在body元素节点的最后一个子节点之后添加节点
document.body.appendChild(instance.$el);

// chrome.extension.onMessage.addListener(
//   async function (request, sender, sendMessage) {
//     instance.onMessage(request)
//   }
// )

// 等同于
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  // console.log('收到来自content-script的消息：');
  // console.log(request, sender, sendResponse);
  // sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
  instance.onMessage(request)
});