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
    const existingClass = attrs.class
    const existingStyle = attrs.style
    delete attrs.class
    delete attrs.style

    // Bind all attrs on the component
    node.attrs['v-bind'] = 'data.attrs'

    // Merge exiting class with the class prop on the component
    node.attrs['v-bind:class'] = `[${existingClass}, data.staticClass, data.class]`

    // Merge exiting style with the style prop on the component
    node.attrs['v-bind:style'] = `[${existingStyle}, data.style]`

    for (const key of Object.keys(attrs)) {
      node.attrs[`v-bind:${key}`] = `data.attrs && data.attrs[${JSON.stringify(key)}] === undefined ? ${JSON.stringify(attrs[key])} : data.attrs[${JSON.stringify(key)}]`
    }

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
