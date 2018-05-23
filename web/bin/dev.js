#!/usr/bin/env node

/* eslint-env node */

/**
 * This launches both the builder (in watchify mode) and the server. Console
 * output from builder and server are prefixed to differentiate them. If either
 * exits then this script exits.
 */

const path = require('path')
const byline = require('byline')
const colors = require('colors')
const minimist = require('minimist')
const { spawn } = require('child_process')

const argv = minimist(process.argv.slice(2), { boolean: ['cold'] })
const gulpTask = argv.cold ? 'watch' : 'hot'
const makeMessage = (color, prefix, data) => `${color(`[${prefix}]`)} ${data}\n`
// The '--color' argument is intercepted by the the 'colors' node module.
const builder = spawn(path.join(path.join(path.dirname(require
  .resolve('gulp')), 'bin', 'gulp.js')), [gulpTask, '--color'])
const buildMessage = data => makeMessage(colors.gray, 'build', data)
const server = spawn(path.join(__dirname, 'server.js'), [])
const serveMessage = data => makeMessage(colors.magenta, 'server', data)

builder.stdout.setEncoding('utf8')
byline(builder.stdout)
  .on('data', data => process.stdout.write(buildMessage(data)))
builder.stderr.setEncoding('utf8')
byline(builder.stderr)
  .on('data', data => process.stderr.write(buildMessage(data)))
builder.on('close', (code) => {
  server.kill()
  process.exit(code)
})

server.stdout.setEncoding('utf8')
byline(server.stdout).on('data', data => process.stdout.write(serveMessage(data)))
server.stderr.setEncoding('utf8')
byline(server.stderr).on('data', data => process.stderr.write(serveMessage(data)))
server.on('close', (code) => {
  server.kill()
  process.exit(code)
})

