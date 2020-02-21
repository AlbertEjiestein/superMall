<template>
  <div class="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll';

export default {
  name: "Scroll",
  data () {
    return {
      scroll:null
    };
  },
  props:{
    probeType:{
      type:Number,
      default(){
        return 0
      }
    },
    pullUpLoad:{
      type:Boolean,
      default:false
    }
  },
  mounted(){
    // 1.创建bscroll对象
    this.scroll = new BScroll('.wrapper',{
      click:true,
      probeType:this.probeType,
      pullUpLoad:this.pullUpLoad
    });

    // 2.监听滚动的位置
    this.scroll.on('scroll',(position)=>{
      this.$emit('scroll',position)
    });

    // 3.监听上拉加载更多
    this.scroll.on('pullingUp',()=>{
      this.$emit('pullingUp')
    })
  },
  methods:{
    scrollTo(x,y,time=300){
      this.scroll && this.scroll.scrollTo(x,y,time);
    },
    finishPullUp(){
      this.scroll.finishPullUp()
    },
    refresh(){
      // console.log('用于判断调用了几次refresh')
      this.scroll && this.scroll.refresh()
    },
    getScrollY(){
      return this.scroll ? this.scroll.y : 0
    }
  }
}
</script>
<style scoped>
</style>