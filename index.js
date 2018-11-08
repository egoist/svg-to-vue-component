const posthtml = require('posthtml')

const plugin = tree => {
  tree.match({ tag: 'svg' }, node => {
    // Remove unnecessary attrs on SVG tag

    const attrs = {}
    for (const name of Object.keys(node.attrs)) {
      if (name !== 'version' && name !== 'xmlns' && !name.startsWith('xmlns:')) {
        attrs[name] = node.attrs[name]
      }
      delete node.attrs[name]
    }

    // Adding v-bind
    node.attrs['v-bind'] = `Object.assign(${JSON.stringify(attrs)},data.attrs)`

    // Adding v-on
    node.attrs['v-on'] = 'data.on'

    return node
  })
}

const createComponent = svg => {
  return `<template functional>${svg}</template>`
}

module.exports = (input, { sync } = {}) => {
  const stream = posthtml([
    plugin
  ]).process(input, { sync })

  if (stream.then) {
    return stream.then(res => ({
      component: createComponent(res.html)
    }))
  }

  return { component: createComponent(stream.html) }
}
