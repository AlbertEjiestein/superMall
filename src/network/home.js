// 本文件是Home.vue面向request.js请求的中间封装，去耦合，方便管理
import { request } from "./request";

export function getHomeMultidata(){
  return request({
    url:'/home/multidata'
  })
}

export function getHomeProducts(type,page){
  return request({
    url:'/home/data',
    params:{
      type,
      page
    }
  })
}