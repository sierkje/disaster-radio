#!/usr/bin/env node

/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')
const colors = require('colors')
const browserify = require('browserify')
const watchify = require('watchify')
const hmr = require('browserify-hmr')
const minimist = require('minimist')

function getTime() {
  const d = new Date()
  let t = [d.getHours(), d.getMinutes(), d.getSeconds()]
  t = t.map(i => ((i < 9) ? `0${i}` : i))
  return `${t[0]}:${t[1]}.${t[2]}`
}

function build(opts) {
  const options = opts || {}
  const output = path.join(__dirname, '..', 'static', 'build', 'bundle.js')
  const doBrowserify = browserify({
    entries: [path.join(__dirname, '..', 'src', 'index.js')],
    cache: {},
    packageCache: {},
  })

  function onBuildEnd(msg) {
    console.log(colors.green('Completed') + ((msg) ? (`: ${msg}`) : ''))
  }

  function onBuildStart() {
    const outStream = fs.createWriteStream(output)

    process.stdout.write(`Build started at ${getTime()}... `)

    if (!options.dev) outStream.on('close', onBuildEnd)

    doBrowserify.bundle().on('error', (error) => {
      const isSyntaxError = (error instanceof SyntaxError)
      const errorMatches = (error.message.match(/while parsing file/))
      if (!isSyntaxError && !errorMatches) {
        console.error(error)
        return
      }

      // Format syntax error messages nicely
      const re = new RegExp(`${error.filename}:? ?`)
      let msg = error.message.replace(re, '')
      msg = msg.replace(/ while parsing file:.*/, '')
      console.error()
      console.error(`\n${colors.red('Error')}: ${msg.underline}`)
      console.error()
      console.error('Filename:', error.filename)
      console.error()
      console.error(error.loc)
      console.error()
      console.error(error.codeFrame)
      console.error()
    })

    doBrowserify.bundle().pipe(outStream)
  }

  if (options.dev) {
    console.log(colors.yellow('Watching for changes...'))
    doBrowserify.plugin(watchify)
  }

  if (options.hot) {
    console.log(colors.yellow('Hot module reloading enabled'))
    doBrowserify.plugin(hmr)
  }

  doBrowserify.on('update', () => onBuildStart())

  if (options.dev) doBrowserify.on('log', onBuildEnd)

  doBrowserify.transform('babelify', {
    presets: ['es2015'],
    plugins: [['transform-react-jsx', { pragma: 'h' }]],
  })

  onBuildStart()
}

(function doBuild() {
  if (require.main === module) {
    const argv = minimist(process.argv.slice(2), {
      alias: { d: 'dev' },
      boolean: ['dev', 'hot'],
      default: {},
    })

    build(argv)
    return
  }

  module.exports = {
    build,
    watch: (opts) => {
      const options = opts || {}
      options.dev = true

      return build(options)
    },
    hot: (opts) => {
      const options = opts || {}
      options.dev = true
      options.hot = true

      return build(options)
    },
  }
}())
