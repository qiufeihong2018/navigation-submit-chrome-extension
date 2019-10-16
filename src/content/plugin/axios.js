import axios from 'axios'

export default axios.create({
  baseURL: 'https://navigation.qiufeihong.top',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-Token': 'admin'
  }
})
