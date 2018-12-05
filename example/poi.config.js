module.exports = {
  entry: './example/index.js',
  output: {
    dir: './example/dist'
  },
  chainWebpack(config) {
    config.module.rules.delete('svg')
    config.module.rule('svg')
      .test(/\.svg$/)
      .use('vue')
      .loader('vue-loader')
      .end()
      .use('sfc')
      .loader(require.resolve('../loader'))
  }
}
