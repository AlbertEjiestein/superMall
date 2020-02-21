<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control class="tab-control" :titles="titles" @itemClick="tabClick" ref="tabControl1" v-show="isShowTabControl"></tab-control>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="titles" @itemClick="tabClick" ref="tabControl2"></tab-control>
      <goods-list :goods="showGoodsList"></goods-list>
    </scroll>
    <back-top class="back-top" @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>
<script>
import HomeSwiper from './childComps/HomeSwiper';
import RecommendView from './childComps/RecommendView';
import FeatureView from './childComps/FeatureView';

import NavBar from 'components/common/navbar/NavBar';
import Scroll from 'components/common/scroll/Scroll';
import TabControl from 'components/content/tabControl/TabControl';
import GoodsList from 'components/content/goods/GoodsList';
// import BackTop from 'components/content/backTop/BackTop';

import {getHomeMultidata, getHomeProducts} from 'network/home';
// import {debounce} from 'common/utils';
import {itemListenerMixin, backTopMixin} from 'common/mixin';
import {BACKTOP_DISTANCE} from 'common/const';

export default {
  name: "Home",
  components:{
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll
    // BackTop
  },
  data(){
    return {
      banners : [],
      recommends : [],
      titles : ["流行","新款","精选"],
      goods:{
        'pop':{page:0, list:[]},
        'new':{page:0, list:[]},
        'sell':{page:0, list:[]},
      },
      currentType:'pop',
      // isShowBackTop:false,
      tabOffsetTop:0,
      isShowTabControl:false,
      saveY:0,   // 保存离开Home页面时滚动到的位置
      itemImgListener:null
    }
  },
  created(){
    // 请求多个数据
    this.getHomeMultidata()

    // 请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mixins:[itemListenerMixin, backTopMixin],
  mounted(){
    // // 1.图片加载完成的事件监听
    // const request = debounce(this.$refs.scroll.refresh,200);
    // this.itemImgListener =  () => {
    //   // console.log(this.$refs.scroll)
    //   // 监听到图片加载完成后，调用scroll组件的refresh方法更新scrollHeight属性
    //   request()
    // }
    // this.$bus.$on('itemImageLoad',this.itemImgListener)

    // // 2.获取tabControl的offsetTop：注意这里是不准确的
    // // console.log(this.$refs.tabControl.$el.offsetTop)
  },
  computed:{
    showGoodsList(){
      return this.goods[this.currentType].list
    }
  },
  methods:{
    /**
     * 事件监听相关的方法
     */
    tabClick(index){
      switch(index){
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    // backClick(){
    //   this.$refs.scroll.scrollTo(0,0,500)
    // },
    contentScroll(position){
      // 1.判断啥时候显示backTop
      this.isShowBackTop = (-position.y) > BACKTOP_DISTANCE;
      // 2.判断啥时候显示tabControl
      this.isShowTabControl = (-position.y) > this.tabOffsetTop;
    },
    loadMore(){
      // console.log('loadMore')
      this.getHomeGoods(this.currentType);

      // 防止图片请求比较慢导致滚动高度计算出错，
      // 如果图片未请求完就计算好滚动高度，会提前加载下一页数据
      // console.log(this.$refs.scroll)
      this.$refs.scroll.refresh()
    },
    // 获取图片加载之后的正确的offsetTop值 
    swiperImageLoad(){
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
    /**
     * 网路请求相关的方法
     */
    getHomeMultidata(){
      getHomeMultidata().then(res => {
        // console.log(res)
        this.banners = res.data.data.banner.list;
        this.recommends = res.data.data.recommend.list;
      })
    },

    getHomeGoods(type){
      const page = this.goods[type].page + 1;
      getHomeProducts(type,page).then(res => {
        const goodsList = res.data.data.list;
        // console.log(goodsList)
        this.goods[type].list.push(...goodsList);
        this.goods[type].page += 1;

        this.$refs.scroll.finishPullUp()
      })
    },
  },
  activated(){
    this.$refs.scroll.scrollTo(0,this.saveY,0);
    this.$refs.scroll.refresh()
  },
  deactivated(){
    // 1.获取离开时的y值
    this.saveY = this.$refs.scroll.getScrollY();
    
    // 2.取消事件监听函数
    this.$bus.$off('itemImageLoad',this.itemImgListener)
  }
}
</script>
<style scoped>
  .home-nav{
    background-color: var(--color-tint);
    color: white;
    position: relative;
    z-index: 9;
    
    /* 这是原生的设置home-nav为fixed，然后让整个网页滚动，但better-scroll可以设置局部滚动 */
    /* position: fixed;
    left: 0px;
    right: 0px;
    top: 0px; */
  }

  #home{
    /* padding-top: 44px; */
    position: relative;
  }

  .tab-control{
    /* 吸顶效果:失效 */
    /* position: sticky; */
    position: relative;
    /* top: 44px; */

    z-index: 9;
  }

  .content{
    position: fixed;
    top: 44px;
    bottom:49px;
    left: 0;
    right: 0;

    /* margin-top: 44px; */
  }

  .back-top{
    position: fixed;
    right: 10px;
    bottom: 55px;
  }
</style>
