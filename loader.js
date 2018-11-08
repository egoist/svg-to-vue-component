const toSFC = require('.')

module.exports = async function (source) {
  this.cacheable()
  const cb = this.async()

  try {
    const { component } = await toSFC(source)
    cb(null, component)
  } catch (err) {
    cb(err)
  }
}
