<template>
<div class="icon-selector" :class="{check:isChecked}">
  <img src="~assets/img/cart/tick.svg"  alt="">
</div>
</template>
<script>
export default {
  name: "CheckButton",
  props:{
    isChecked:{
      type:Boolean,
      default:true
    }
  }
}
</script>
<style scoped>
.icon-selector{
  border-radius: 50%;
  border:2px solid #aaa;
}

.check{
  background-color:red;
  border-color: red;
}
</style>