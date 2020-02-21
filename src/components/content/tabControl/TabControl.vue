<template>
  <div class="tab-control">
    <div class="tab-control-item" 
          v-for="(item,index) in titles"
          @click="itemClick(index)"
          :class="{active: currentIndex === index}">
      <span>{{item}}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "TabControl",
  data () {
    return {
      currentIndex :  0
    };
  },
  props:{
    titles:{
      type:Array,
      default:[]
    }
  },
  methods:{
    itemClick(index){
      this.currentIndex = index;

      this.$emit('itemClick',index);
    }
  }
}
</script>
<style lang="css" scoped>
  .tab-control{
    display: flex;
    font-size: 15px;
    line-height: 40px;
    background-color: #fff;
  }
  .tab-control-item{
    flex:1;
    text-align: center
  }

  .tab-control-item span{
    padding: 5px;
  }

  .active{
    color:var(--color-high-text);
  }

  .active span{
    border-bottom: 2px solid var(--color-high-text);
  }
</style>