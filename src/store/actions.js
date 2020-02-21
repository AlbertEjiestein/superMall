export default {
  // 此处是context不是state
  addCart(context,payload){
    // 1.payload新添加的商品
    // let oldProduct = null;
    // for(let item of state.cartList){
    //   if(item.iid === payload.iid){
    //     oldProduct = item;
    //   }
    // }

    let oldProduct = context.state.cartList.find((item) => item.iid === payload.iid)

    // 2.判断cartList是否有该商品
    if(oldProduct){
      context.commit('addCounter',oldProduct);
    }else{
      payload.count = 1;
      context.commit('addToCart',payload)
    }
  }
}