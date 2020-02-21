import {debounce} from 'common/utils';
import BackTop from 'components/content/backTop/BackTop';

// export const itemListenerMixin = {
//   data(){
//     return {
//       // newRefresh:null
//     }
//   },
//   mounted(){
//     const request = debounce(this.$refs.scroll.refresh,200);
//     this.itemImgListener =  () => {
//       // console.log(this.$refs.scroll)
//       // 监听到图片加载完成后，调用scroll组件的refresh方法更新scrollHeight属性
//       request()
//     }
//     this.$bus.$on('itemImageLoad',this.itemImgListener)
//   }
// }

// 第二种更新滑动的方法
export const itemListenerMixin = {
  data(){
    return {
      request:null
    }
  },
  mounted(){
    this.request = debounce(this.$refs.scroll.refresh,200);
    this.itemImgListener =  () => {
      // console.log(this.$refs.scroll)
      // 监听到图片加载完成后，调用scroll组件的refresh方法更新scrollHeight属性
      this.request()
    }
    this.$bus.$on('itemImageLoad',this.itemImgListener)
  }
}

export const backTopMixin = {
  data(){
    return {
      isShowBackTop:false
    }
  },
  components:{
    BackTop
  },
  methods:{
    backClick(){
      this.$refs.scroll.scrollTo(0,0,500)
    }
  }
}