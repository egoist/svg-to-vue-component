export default {
  name: 'svg2vue-style',
  functional: true,
  // eslint-disable-next-line object-shorthand
  render: function(h, ctx) {
    return h('style', ctx.data, ctx.children)
  }
}
