const path = require('path')
const { promisify } = require('util')
const fs = require('fs')
const SVGO = require('svgo')
const { getOptions } = require('loader-utils')
const merge = require('lodash.merge')
const JoyCon = require('joycon').default
const toSFC = require('.')

module.exports = async function (source) {
  this.cacheable()

  const cb = this.async()
  const { svgoConfig } = getOptions(this) || {}

  try {
    if (svgoConfig !== false) {
      const svgo = new SVGO(
        await getSvgoConfig(svgoConfig, path.dirname(this.resourcePath))
      )

      source = await svgo
        .optimize(source, {
          path: this.resourcePath
        })
        .then(res => res.data)
    }

    const { component } = await toSFC(source)

    cb(null, component)
  } catch (err) {
    cb(err)
  }
}

async function getSvgoConfig(svgoConfig, cwd) {
  return merge(
    { plugins: [{ prefixIds: true }] },
    svgoConfig,
    await loadSvgoConfig(cwd)
  )
}

function loadSvgoConfig(cwd) {
  const joycon = new JoyCon()

  const readFile = promisify(fs.readFile)

  joycon.addLoader({
    test: /\.yml$/,
    async load(filepath) {
      const content = await readFile(filepath, 'utf8')
      return require('js-yaml').safeLoad(content)
    }
  })

  return joycon
    .load(
      ['.svgo.yml', '.svgo.js', '.svgo.json'],
      cwd,
      path.dirname(process.cwd())
    )
    .then(res => res.data)
}
