import axios from 'axios'

export default axios.create({
  baseURL: 'http://navigation.qiufeihong.top',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-Token': 'admin'
  }
  // auth: {
  //   username: 'd2-awesome',
  //   password: 'bsXms5RrbOjOT1OdUYS96WKU+AJ4P2o1'
  // }
})
