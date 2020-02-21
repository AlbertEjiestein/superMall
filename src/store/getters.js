export default {
  cartCount(state,getters){
    return getters.cartList.length;
  },
  cartList(state){
    return state.cartList
  }
}