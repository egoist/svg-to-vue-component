import Vue from 'vue'

var NAME = 'svg2vue-style'

if (!Vue.component(NAME)) {
  Vue.component(NAME, {
    functional: true,
    render: function (h, ctx) {
      return h('style', ctx.data, ctx.children)
    }
  })
}
