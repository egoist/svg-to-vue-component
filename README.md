
# svg-to-vue-component

[![NPM version](https://badgen.net/npm/v/svg-to-vue-component)](https://npmjs.com/package/svg-to-vue-component) [![NPM downloads](https://badgen.net/npm/dm/svg-to-vue-component)](https://npmjs.com/package/svg-to-vue-component) [![CircleCI](https://badgen.net/circleci/github/egoist/svg-to-vue-component/master)](https://circleci.com/gh/egoist/svg-to-vue-component/tree/master)  [![donate](https://badgen.net/badge/support%20me/donate/ff69b4)](https://patreon.com/egoist) [![chat](https://badgen.net/badge/chat%20on/discord/7289DA)](https://chat.egoist.moe)

## Why

When you import the `.svg` file as a Vue component instead of using the URL to the file, you can style it with CSS and add addtional DOM properties or event handlers to the component directly.

The differences between this project and [vue-svg-loader](https://github.com/visualfanatic/vue-svg-loader) are:

- This one has built-in hot reloading support for webpack since the SVG code is compiled via `vue-loader`.
- The latter only supports `class` and `style` attributes on the generated component while we support all DOM props and events.
- This one supports project-wise and file-relative configuration for [SVGO](https://github.com/svg/svgo).

## Install

```bash
yarn add svg-to-vue-component --dev
```

## Usage

### With Webpack

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          // This loader compiles .svg file to .vue file
          // So we use `vue-loader` after it
          'vue-loader',
          'svg-to-vue-component/loader'
        ]
      }
    ]
  },
  // ...other configurations
}
```

Then you can import `.svg` files directly and use them as Vue functional components:

```vue
<template>
  <!-- Dom props and events are all available here -->
  <CheckIcon width="20px" height="20px" @click="handleClick" />
</template>

<script>
import CheckIcon from './check-icon.svg'

export default {
  components: {
    CheckIcon
  },

  methods: {
    handleClick() {
      console.log('It works!')
    }
  }
}
</script>
```

### With Vue CLI or Poi

In your `vue.config.js` or `poi.config.js`:

```js
module.exports = {
  chainWebpack(config) {
    // Remove existing SVG rule which uses file-loader
    config.module.rules.delete('svg')

    // Use our loader instead
    config.module.rule('svg')
      .test(/\.svg$/)
      .use('vue')
      .loader('vue-loader')
        .end()
      .use('svg-to-vue-component')
      .loader('svg-to-vue-component/loader')
  }
}
```

## Loader Options

Pass loader options like this:

```js
// ...
{
  test: /\.svg$/,
  use: [
    'vue-loader',
    {
      loader: 'svg-to-vue-component/loader',
      options: {
        // ...Your options here
      }
    }
  ]
}
```

|Option|Description|
|---|---|
|`svgoConfig`|Project-wise configuration for [SVGO](https://github.com/svg/svgo), if you want file-relative configuration, use the config file instead, supported format: `.svgo.{yml,js,json}`, see [here](https://github.com/svg/svgo/blob/master/.svgo.yml) for an example file.|

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**svg-to-vue-component** © [EGOIST](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by EGOIST with help from contributors ([list](https://github.com/egoist/svg-to-vue-component/contributors)).

> [Website](https://egoist.sh) · GitHub [@EGOIST](https://github.com/egoist) · Twitter [@_egoistlily](https://twitter.com/_egoistlily)
