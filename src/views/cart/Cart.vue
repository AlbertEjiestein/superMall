<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartCount}})</div>
    </nav-bar>
    <cart-list></cart-list>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar';

import CartList from './childComps/CartList';

import {mapGetters} from 'vuex';

export default {
  name:'Cart',
  components:{
    NavBar,
    CartList
  },
  computed:{
    // cartCount(){
    //   return this.$store.getters.cartCount
    // }
    ...mapGetters(['cartCount'])
  }
}
</script>

<style scoped>
  .cart{
    height: 100vh;
  }

  .nav-bar{
    background-color: var(--color-tint);
    color:#fff;
    font-weight: 700;
  }
</style>