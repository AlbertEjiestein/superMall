+ 1.目录划分：指的是src文件夹的划分
+ 2.定义css文件，引用了两个css文件
  - normalize.css文件是别人写好的开源文件，
  - base.css是自己根据项目定义的
+ 3.vue.config.js和.editorconfig
  - 配置文件夹别名  vue.config.js
    - CLI2中别名是在base.config.js中配置
    - CLI3是零配置的，需要新建vue.config.js配置，该文件会和node_modules中@vue里面的配置合并
    - router和store不需要起别名，只引用一次
  - .editorconfig：
    - 代码规范的配置文件，CLI2中自动生成了，CLI3中需要手动拷贝
+ 4.模块的项目划分:tabbar->路由映射关系
  - .配置components
    - 首先是tarbar组件的开发，components文件夹分为common和content，前者是公共组件，与业务无关，后者与业务相关，可以设置图片以及颜色
    - 注意tabbar组件的图片引用需要使用文件夹别名
    - 将MainTabBar组件在vue实例中注册
    - 而且tabbar组件还是用了路由
  - .配置路由
    - 配置index.js文件，三步：1.安装插件(首先要npm install vue-router) 2.新建router实例  3.导出，并到main.js挂载
    - 搭建好router骨架之后配置路由映射关系routes，用到了懒加载，并设置router-view占位
+ 5.navbar组件开发
  - 首先将navbar拆分为三部分，划分比例flex布局
  - 新建一个NavBar插件，定义三个具名插槽
  - 设置插槽样式，并在Home.vue引入
  - 在Home.vue中给对应的具名插槽设置内容
+ 6.首页开发-请求首页的多个数据
  - 轮播图swiper  and recommendview
  - 创建完组件之后，要立即请求数据,生命周期函数：created()
  - 通过网络封装模块(request.js)请求数据，避免了因更换axios框架而大范围更改代码的问题
  - 直接在Home组件中引用request.js，会造成组件的业务逻辑代码和网络请求代码耦合在一起，当请求的接口比较多时，比较混乱
  - 新建home.js，本文件是Home.vue面向request.js请求的中间封装，去耦合，方便管理
  - 组件中请求到数据之后先保存想要的数据到data函数中，然后进行处理

  - 组件化开发思想：Home.vue中只负责整体逻辑，具体某一部分的实现用子组件实现(子组件放在childComps)
  - 独立组件需要设置一个class属性

  - RecommendView

  - FeatureView

  - tabControl
    - 1.需要请求数据，以什么样的数据结构保存？对象
    - 网络请求模块请求数据：home.js，默认请求第一页的数据，并保存
    - 2.请求到数据后，建立组件
    - 3.点击切换商品
    - 4.移动端滚动框架better-scroll
    
    - 局部滚动：
      - 原生滚动：1.设置height 2.overflow-y:scroll
      - better-scroll插件,使用必须是在mounted函数中，因为要获取DOM元素,而created函数是组件一旦创建就生效，DOM元素还没挂载
      - 要想局部滚动，必须最外层的标签里边只放了一个元素，里面的这个元素可以放很多东西
      - <div class="wrapper"><ul>...</ul></div>
      - new BScroll(document.querySelector('.wrapper),{
        <!-- 监听位置参数,0和1都是不侦测，2是手指滑动的过程中侦测，一旦离开惯性的过程中不侦测，3是滑动过程和惯性的过程都侦测 -->
        probeType:2
      })
      - 监听滚动的位置：
      - bscroll.on('scroll',(position)=>{
      })
      - bscroll.on('pullingUp,()=>{})  上拉加载更多  bscroll.finishPullUp()
    - better-scroll的封装：防止该插件不更新带来的麻烦，解除耦合，新建Scroll.vue组件
    - new BScroll(document.querySelector('.wrapper))  通过document.querySelector获取最外层元素不太好，因为可能有很多个wrapper，不知道拿到的是哪个
    - 可以通过ref="name"，绑定一个子组件，然后通过this.$refs.name获取该组件对象
      - 如果是绑定的一个普通的元素，然后通过this.$refs.name获取的是该元素
      - new BScroll(this.$refs.scroll)
    - scroll滑动区域高度计算：css3中的calc(100% - 93px)函数   同时设置home高度：height=100vh  (vh -> viewport height)
    - 第二种计算高度方式：通过fixed定位，top：44  buttom：49px
    - button点击的时候不需要设置BScroll的click属性为true，但是div必须要设置为true
+ BackTop组件
  - 在我们需要监听组件(不是元素)的原生事件时，需要在该事件后绑定.native属性
+ 解决首页中better-scroll可滚动区域的问题
  - 可滚动区域是根据scrollerHeight属性决定的
    - scrollerHeight属性是根据better-scroll中的子组件的高度
  - 如何解决？
    - 每次加载完图片refresh一下scrollHeight
    - 如何监听图片加载完成？
      - 原生js监听图片：img.onload = function()
      - vue监听方法：@load = 'imageload'
    - 事件总线
      - this.$bus.$emit("itemImageLoad")
      - this.$bus.$on("itemImageLoad",function(){
        this.$refs.scroll.refresh()
      })
      - 上边遇到一个问题，每次一调用this.$refs.scroll.refresh()就报错，说scroll是undefined的
      - 原因是scroll是在mounted里面定义的，但是home当中调用scroll.refresh()的时候，是在created调用的
      - 解决方法是改为mounted调用

+ 对于refresh刷新频繁的防抖动函数处理
  - 防抖debounce/节流throttle
  - 防抖函数起作用的过程：
    - 如果我们直接执行refresh，那么refresh会被执行30次
    - 可以将refresh函数传入到debounce函数中，生成一个新的函数
    - 之后在调用很频繁的时候，就使用新生成的函数
    - 新生成的函数并不会被频繁调用
    - debounce(func,delay){
      let timer = null;
      return function(...args){
        if(timer) clearTimeout(timer)
        timer = setTimeout(() => {
          func.apply(this,args)
        },delay)
      }
    },
  - 防抖动函数debounce这个函数可能在其它项目中也能用到，因此放在common的utils.js中

+ tabControl的吸顶效果
  - 必须知道滚动到多少时，必须拿到组件的offsetTop属性
  - 元素的offsetTop可以直接获取，但是组件的不可以，必须通过:组件.$el.offsetTop获得组件的元素   this.$refs.tabControl.$el.offsetTop
  - 注意：要想获取组件元素，必须是在mounted属性中获取，DOM挂载之后
  - 拿到的offsetTop只有57,显然不符合实际上tabControl组件距离上层级的距离(700多)
  - 原因是在mounted中获取的offsetTop是刚刚挂载了DOM，但是图片未完全挂载，所以只是dom撑起来的高度
  - 应该是等所有的图片加载完后，在计算offsetTop
  - 主要是监听轮播图的图片是否加载完：@load
  - 如何获取正确的值？
    - 监听HomeSwiper中img的加载完成
    - 加载完成之后，发出事件，在Home.vue中，获取正确的值
    - 补充：
      - 为了不让HomeSwiper多次发出事件
      - 可以使用isLoad的变量进行状态的记录
    - 注意：这里不多次发出事件与debounce的区别
  - 获取到offsetTop之后，如何设置吸顶效果？
    - 设置两个tab-control，最上边的control设置v-show属性控制什么时候显示
    - 当position.y大于offsetTop时，就显示
    - 同时有一个bug：
      - 两个tab-control点击的type如何保持一致，设置两个ref，使得currentIndex=index

+ 让Home保持原来的状态
  - 让Home切换到其它页面时不随意销毁
    - keep-alive:注意keep-alive的是router-view，让路由不挂掉  
  - 让Home中的内容保持原来的位置
    - 离开时，保持一个位置  deactivated
    - 进来时，将位置设置为原来保存的位置  activated

+ 7.详情页detail
  - 在view下新建一个文件夹，作为一个单独的功能
  - 思路：
    - 1.转到详情页并携带参数
      - 点击商品之后进入详情页，因此要在GoodsListItem.vue中设置监听函数和在index.js中设置路由
      - 进入详情页之后，要想查看商品信息，首先要拿到该商品的id，因此要获取该item的id，并传递给详情页  this.$router.push(path + 参数)
      - 获取之后要传递参数到detail页面，因此要在详情页接收传递的参数id  this.$route.params.iid
    - 2.导航栏的封装
      - 新建子组件childComps文件夹，在详情页中封装DetailNavBar.vue
      - 导航返回：this.$router.back()  或者 this.$router.go(-1)
    - 3.数据请求以及轮播图的展示
      - 使用axios请求数据，network文件夹下新建detail.js
      - childComps下新建DetailSwiper.vue
      - 轮播图不轮播：调整setTimeOut的delay，让前端有时间去请求数据
      - 一个bug：点击一个商品推出后点击另一个发现还是之前的商品
        - 原因是之前使用了keep-alive，这使得切换到之前的页面不会被频繁请求而是保持原来的页面信息
        - 可以使用exclude="Detail"将该组件排除
    - 4.商品基本信息的展示
      - 封装组件DetailBaseInfo.vue
      - 提取数据，并对数据进行整合，将杂乱无章的数据分类封装到一个对象中，network中detail.js新建类
      - 要整合的数据：商品的title、价格和折扣、快递、24小时发货
      - 将整合的信息封装到一个类中
        - 补充：数字的遍历   for n in 10   n是从1到10
    - 5.店铺信息的解析与展示
      - 组件DetailShopInfo.vue
      - 当进入详情页的时候，让底下的tab-bar消失，设置一个相对位置即可，z-index:10
    - 6.加入滚动效果
      - scroll组件必须给定高度
      - 设置高度有两种方式：一种是fixed定位，一种是calc
      - 注意cacl计算：calc(100% - 44px)  这里的100%是相对父元素
      - 但是父元素的高度是很高的，完全撑开的，所以需要设置父元素高度:height:100vh  100%的视口高度
    - 7.商品详情数据展示
      - 组件DetailGoodsInfo.vue
      - bug：又出现了加载图片的时候上拉不上去的问题，和home中的情况类似
      - 等待所有的图片都加载完了，那么进行一次回调就可以了，需要使用@load监听每张图片加载
      - 使用watch可以监听某一个属性的变化，此处监听detailInfo
    - 8.商品评论信息的展示
      - 时间格式：new Date(时间戳*1000)  格式化：formatDate(date, 'yyyy-MM-dd')  
      - 年月日时分秒：y M d h(H) m s
    - 9.商品推荐数据的展示
      - 请求数据  detail.js
      - 保存数据
      - 传递数据给组件，推荐的商品可以利用GoodsList组件
      - 一个bug：详情页监听到图片加载会通过事件总线emit一个事件，但是home有一个$on接收一个事件
      - 解决方法是deactivated属性，设置当离开当前页面时，通过事件总线$bus.$off方法取消全局事件的监听
        - this.$bus.$off(事件，对应的函数)
      - 同时，为了避免在home页面监听图片加载导致的detail监听到事件总线发出的事件，也要设置取消函数
      - 但是detail中还能使用deactivated吗？不能，home中能使用是因为Home中做了keep-alive缓存，而Detail被exclude了
      - 那该怎么办，使用destroyed属性，这个一定会调用

      - mixin混入(高级用法)
        - 对于组件中存在的公共代码，不能用继承的方式简化，因为对象不能继承
        - 需要新建mixin.js以对象的格式存放公共代码，然后混入到各个组件
        - 比如mixin.js中有一个mounted属性，Detail.vue中有一个mounted属性，如果后者混入了，则mounted会合并
    - 10.详情页的联动效果
      - 要想达到点击的时候跳转到指定部分，必须获取每一个组件的offsetTop
      - 要想获取组件的offsetTop，必须等到所有的图片加载并渲染之后在计算，不然计算的不准确
      - 获取offsetTop
        - 0.在updated属性中获取每次更新后的offsetTop
        - 1.created不行，不能获取到元素
        - 2.mounted不行，可以获取元素但数据还未加载
        - 3.获取到数据的回调中也不行，DOM还没有渲染完
        - 4.this.$nextTick(callback)也不行，图片的高度没有被计算在内：作用是等DOM渲染完之后，执行回调，在回调里获取offsetTop，但是此时页面的图片是没有加载完的，所以计算的offsetTop也不正确
        - 5.在图片加载完成后，使用防抖函数，获取的高度才正确   
      - 滚动页面时详情页导航栏跟着变
        - 核心思想时比较滚动的位置是在哪一个区间内
        - better-scroll有scroll事件,传入probeType类型为3
        - 条件判断：this.currentIndex !== i && ((i < length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length-1 && positionY >= this.themeTopYs[i]))
        - 高级方法：offsetTop数组最后添加一个最大值:Number.MAX_VALUE
    - 11.底部工具栏，加入购物车
      - 获取购物车需要展示的信息
      - 将商品添加到购物车里，使用vuex
      - mutations唯一的目的就是修改state中的状态
      - mutations中的每个方法尽可能完成的事件比较单一一点，可以跟踪变化
      - 所以需要使用actions进行重构，actions不仅可以异步,this.$store.dispatch()
      - 将mutations单独一个文件，进行重构
      - 将函数名作为常量重构
    - 12.回到顶部
      - 类似home
      - 对home和detail的backTop做一个抽取封装  mixin

+ bug处理-详情页不能滚动
  - DetailGoodsInfo出现了之前的图片未加载完，但滚动高度已经计算好的情况，解决方法两种：
  - 1.监听到图片加载时，统计图片数量，直到加载的图片数等于要加载的数量，才一次性refresh一下高度，
  - 这种情况可能遇到网不好的情况下，加载图片是要等一会等全部加载完才可以下滑
  - 2.动态的refresh高度，设置定时更新，比如200ms，如果200ms内未加载图片，则更新一下滚动高度，如果200ms内有加载图片，则无需更新

+ 8.购物车页面
  + 导航栏实现
    - 因为购物车的商品数量可能使用的很频繁，每次都写$store.state.cartList.length会很麻烦
    - 即便是写成计算属性，如果在多个组件中使用，还是要再次构建计算属性，
    - 使用vuex的getters进行重构，然后使用mapGetters映射为局部计算属性
    - import mapGetters from 'vuex'
    - getters的写法
  + 购物车列表
    - bug：跳转到购物车页面发现不能滚动，是因为better-scroll没有自动刷新可滚动高度，需要在activated中refresh一下
    - item的选中与不选中的切换
      - 只要是这种选中不选中的切换，其判断属性一定是在模型当中设置的，
      - 在mutations.js中设置checked属性，默认为true
      - 然后在组件上设置监听函数，注意加上.native