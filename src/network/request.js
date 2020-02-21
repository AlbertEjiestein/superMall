// 网络模块的封装
import axios from 'axios';

export function request(config){
  const instance = axios.create({
    // baseURL:'http://123.207.32.32:8000/api/w1',
    baseURL:'http://106.54.54.237:8000/api/w1',
    timeout:10000
  });

  instance.interceptors.request.use(config => {
    return config;
  },err => {
    console.log(err)
  })

  instance.interceptors.response.use(res => {
    // console.log(res)
    return res;
  },err => {
    console.log(err)
  })

  return instance(config);
}