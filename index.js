const path = require('path')
const posthtml = require('posthtml')

const STYLE_COMPONENT = path.join(__dirname, './lib/StyleComponent.js')

const plugin = state => tree => {
  tree.match({ tag: 'svg' }, node => {
    node.attrs = node.attrs || {}
    // Bind all events so that you can @click="handler" instead of @click.native="handler"
    node.attrs['v-on'] = '$listeners'
    return node
  })
  // SVGO will inline styles, so if you don't turn off relevant plugin
  // the tree will never match `style` nodes because they don't exist
  tree.match({ tag: 'style' }, node => {
    // Ignore the style tag if it's empty
    if (!node.content || node.content.length === 0) return

    // When SVGO is turned off
    // Make `style` tags work by using a Vue component
    node.tag = 'svg2vue-style'
    state.hasStyleTag = true
    return node
  })
}

const createComponent = (svg, state) => {
  let result = `<template>\n${svg}\n</template>`

  if (state.hasStyleTag) {
    result += `
    <script>
    import Component from ${JSON.stringify(STYLE_COMPONENT)}
    export default {
      components: {
        'svg2vue-style': Component
      }
    }
    </script>
    `
  }

  return result
}

module.exports = (input, { sync } = {}) => {
  const state = {}

  const stream = posthtml([plugin(state)]).process(input, {
    sync,
    recognizeSelfClosing: true
  })

  if (stream.then) {
    return stream.then(res => ({
      component: createComponent(res.html, state)
    }))
  }

  return { component: createComponent(stream.html, state) }
}
