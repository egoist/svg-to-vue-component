const path = require('path')
const posthtml = require('posthtml')

const REGISTER_STYLE_COMPONENT = path.join(__dirname, './lib/registerStyleComponent.js')

const plugin = state => tree => {
  tree.match({ tag: 'svg' }, node => {
    const attrs = {}

    node.attrs = node.attrs || {}
    for (const name of Object.keys(node.attrs)) {
      // Don't add unnecessary attrs
      if (name !== 'version' && name !== 'xmlns' && !name.startsWith('xmlns:')) {
        attrs[name] = node.attrs[name]
      }
      delete node.attrs[name]
    }

    // Adding v-bind
    const hasAttrs = Object.keys(attrs).length > 0
    node.attrs['v-bind'] = hasAttrs ? `Object.assign(${JSON.stringify(attrs)},data.attrs)` : 'data.attrs'

    // Adding v-on
    node.attrs['v-on'] = 'data.on'

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
  let result = `<template functional>${svg}</template>`

  if (state.hasStyleTag) {
    result += `
    <script>
    import ${JSON.stringify(REGISTER_STYLE_COMPONENT)}
    export default {}
    </script>
    `
  }

  return result
}

module.exports = (input, { sync } = {}) => {
  const state = {}

  const stream = posthtml([
    plugin(state)
  ]).process(input, { sync })

  if (stream.then) {
    return stream.then(res => ({
      component: createComponent(res.html, state)
    }))
  }

  return { component: createComponent(stream.html, state) }
}
