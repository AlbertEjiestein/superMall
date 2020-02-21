<template>
  <tab-bar>
      <tab-bar-item path='/home' activeColor='red'>
        <img slot="item-icon" src="~assets/img/tabbar/home.svg" alt="">
        <img slot="item-icon-active" src="~assets/img/tabbar/home_active.svg" alt="">
        <div slot="item-text">首页</div>
      </tab-bar-item>
      <tab-bar-item path='/category' activeColor='red'>
        <img  slot="item-icon" src="~assets/img/tabbar/categroy_line.svg" alt="">
        <img slot="item-icon-active" src="~assets/img/tabbar/categroy_line_active.svg" alt="">
        <div slot="item-text">类别</div>
      </tab-bar-item>
      <tab-bar-item path='/cart' activeColor='red'>
        <img slot="item-icon" src="~assets/img/tabbar/cart_empty.svg" alt="">
        <img slot="item-icon-active" src="~assets/img/tabbar/cart_empty_active.svg" alt="">
        <div slot="item-text">购物车</div>
      </tab-bar-item>
      <tab-bar-item path='/profile' activeColor='red'>
        <img slot="item-icon" src="~assets/img/tabbar/nickname.svg" alt="">
        <img slot="item-icon-active" src="~assets/img/tabbar/nickname_active.svg" alt="">
        <div slot="item-text">我的</div>
      </tab-bar-item>
    </tab-bar>
</template>

<script>
import TabBar from 'components/common/tabbar/TabBar';
import TabBarItem from 'components/common/tabbar/TabBarItem';

export default {
  name:'MainTabBar',
  components:{
    TabBar,
    TabBarItem
  }
}
</script>

<style>

</style>