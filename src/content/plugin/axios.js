import axios from 'axios'

export default axios.create({
  baseURL: 'https://navigation.qiufeihong.top',
  timeout: 500000,
  headers: {
    'Content-Type': 'application/json',
    'X-Token': 'admin'
  }
})
