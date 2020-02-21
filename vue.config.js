module.exports = {
  configureWebpack:{
    resolve:{
      // extensions: ['.js', '.vue', '.json'],  默认生成
      alias:{
        // '@':'src', 这个已经默认生成了
        'assets':'@/assets',
        'common':'@/common',
        'components':'@/components',
        'network':'@/network',
        'views':'@/views'
      }
    }
  }
}