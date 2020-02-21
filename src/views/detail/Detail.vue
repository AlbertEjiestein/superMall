<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :commentInfo="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top class="back-top" @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>
<script>
import DetailNavBar from './childComps/DetailNavBar';
import DetailSwiper from './childComps/DetailSwiper';
import DetailBaseInfo from './childComps/DetailBaseInfo';
import DetailShopInfo from './childComps/DetailShopInfo';
import DetailGoodsInfo from './childComps/DetailGoodsInfo';
import DetailParamInfo from './childComps/DetailParamInfo';
import DetailCommentInfo from './childComps/DetailCommentInfo';
import DetailBottomBar from './childComps/DetailBottomBar';

import Scroll from 'components/common/scroll/Scroll';
import GoodsList from 'components/content/goods/GoodsList';
// import BackTop from 'components/content/backTop/BackTop';

import {getDetail, getRecommend, Goods, Shop, GoodsParam} from 'network/detail';
import {itemListenerMixin, backTopMixin} from 'common/mixin';
import {debounce} from 'common/utils';
import {BACKTOP_DISTANCE} from 'common/const';

export default {
  name: "Detail",
  data () {
    return {
      iid:null,
      topImages:[],
      goods:{},
      shop:{},
      detailInfo:{},
      paramInfo:{},
      commentInfo:{},
      recommends:[],
      itemImgListener:null,
      themeTopYs:[],
      currentIndex:0
      // isShowBackTop:false
    };
  },
  components:{
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    Scroll
    // BackTop
  },
  created(){
    // 1.接收点击商品的iid
    this.iid = this.$route.params.iid;
    // 2.根据iid请求商品的详情数据
    getDetail(this.iid).then(res => {
      // 1.获取数据
      const data = res.data.result;
      // console.log(data)
      // 2.获取顶部的图片数据
      this.topImages = data.itemInfo.topImages;
      // 3.整合商品数据到一个对象中
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services);
      // 4.整合店铺信息到一个对象中
      this.shop = new Shop(data.shopInfo);
      // 5.获取商品详情信息
      this.detailInfo = data.detailInfo;
      // 6.获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule);
      // 7.获取评论信息
      // 判断是否有评论信息
      if(data.rate.list){
        this.commentInfo = data.rate.list[0];
      }

      // 2.拿到数据后求offsetTop  [0, undefined, 542, 542]
      // this.themeTopYs.push(0);
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

      // 4.this.$nextTick() 等到DOM数据渲染完，在执行回调,但还是不对，因为仅仅把DOM渲染完了，但图片还没有渲染完
      // this.$nextTick(() => {
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      //   console.log(this.themeTopYs)
      // })
      
    })
    // 3.请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.data.list;
    })
    // 4.给themeTopYs赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);
    },200)
  },
  methods:{
    // 第一种更新方法：等所有图片加载一次性更新高度
    // imageLoad(){
    //   this.$refs.scroll.refresh()
    // }
    // 第二种更新方法：200ms内动态更新高度
    imageLoad(){
      this.request();

      // 5.等图片加载完之后，再计算offsetTop才正确
      this.getThemeTopY();
    },
    titleClick(index){
      this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
    },
    contentScroll(position){
      const positionY = -position.y;
      let length = this.themeTopYs.length;
      for(let i = 0; i < this.themeTopYs.length-1; i++){
        // 普通做法
        // if(this.currentIndex !== i && ((i < length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length-1 && positionY >= this.themeTopYs[i]))){
        //   this.currentIndex = i;
        // }

        // 高级做法
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
          this.currentIndex = i;
          this.$refs.nav.currentIndex = i;
        }
      }

      // 检测backTop显示
      this.isShowBackTop = (positionY) > BACKTOP_DISTANCE;
    },
    // backClick(){
    //   this.$refs.scroll.scrollTo(0,0,500)
    // }
    addToCart(){
      // 1.获取购物车需要展示的商品信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      // 2.将商品添加到购物车里
      // this.$store.commit('addCart',product);
      this.$store.dispatch('addCart',product);
    }
  },
  // 3.在updated中获取offsetTop
  // updated(){
  //   this.themeTopYs = [];
  //   this.themeTopYs.push(0);
  //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
  //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
  //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
  //   console.log(this.themeTopYs)
  // },
  mixins:[itemListenerMixin, backTopMixin],
  mounted(){
    // 如果使用mixin简化公共代码，则不需要下边的代码
    
    // const request = debounce(this.$refs.scroll.refresh,200);
    // this.itemImgListener =  () => {
    //   // console.log(this.$refs.scroll)
    //   // 监听到图片加载完成后，调用scroll组件的refresh方法更新scrollHeight属性
    //   request()
    // }
    // this.$bus.$on('itemImageLoad',this.itemImgListener)

    // 1.可以获取元素但数据还未加载  [0, undefined, 542, 542]
    // this.themeTopYs.push(0);
    // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
  },
  destroyed(){
    // 取消监听事件
    this.$bus.$off('itemImageLoad',this.itemImgListener)
  }
}
</script>
<style scoped>
  #detail{
    position: relative;
    z-index: 10;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content{
    height:calc(100% - 44px - 58px);
  }

  .back-top{
    position: fixed;
    right: 10px;
    bottom: 55px;
  }
</style>