export default {
  name: 'svg2vue-style',
  functional: true,
  render(h, ctx) {
    return h('style', ctx.data, ctx.children)
  }
}
