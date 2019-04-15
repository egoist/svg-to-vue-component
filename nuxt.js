module.exports = function(options) {
  this.extendBuild(config => {
    const imageRule = config.module.rules.find(
      rule => rule.test && rule.test.test('.svg')
    )
    if (!imageRule) {
      throw new Error('Cannot find the existing webpack rule for .svg files')
    }
    // Don't process .svg files in default image rule
    // from https://github.com/nuxt/nuxt.js/blob/76b10d2d3f4e5352f1c9d14c52008f234e66d7d5/lib/builder/webpack/base.js#L203
    imageRule.test = /\.(png|jpe?g|gif|webp)$/

    // Handle svg files imported by css files
    const FILE_RE = /\.(vue|js|ts|svg)$/
    config.module.rules.push(
      Object.assign({}, imageRule, {
        test: /\.svg$/,
        issuer: file => !FILE_RE.test(file)
      })
    )

    // Handle svg files imported by js files
    config.module.rules.push({
      test: /\.svg$/,
      issuer: file => FILE_RE.test(file),
      use: [
        'vue-loader',
        {
          loader: 'svg-to-vue-component/loader',
          options
        }
      ]
    })
  })
}
