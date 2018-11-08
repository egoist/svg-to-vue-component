const { promisify } = require('util')
const fs = require('fs')
const path = require('path')
const test = require('ava')
const loader = require('../loader')

test('main', async t => {
  const svgPath = path.join(__dirname, 'fixtures/foo.svg')
  const source = await promisify(fs.readFile)(svgPath, 'utf8')
  const loaderContext = {
    resourcePath: svgPath,
    cacheable: () => {},
    async: () => (err, output) => {
      if (err) throw err
      t.snapshot(output)
    },
    query: {}
  }
  await loader.call(loaderContext, source)
})
