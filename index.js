#!/usr/bin/env node
'use strict'

/**
 * Project dependencies
 */
const DockerUtil = require('./src/dockerUtil')
const cli = require('./src/cli')

const utils = new Map([
  ['docker', new DockerUtil(cli.cliParse())]
])

const Screen = require('./src/screen')
const screen = new Screen(utils)
screen.init()

process.on('uncaughtException', (err) => {
  // Make sure the screen is cleared
  screen.teardown()

  cli.showUsage()

  if (err && err.message) {
    console.log('\x1b[31m')

    console.trace('Error: ' + err.message)
    if (err.message === 'Unable to determine the domain name') {
      console.log('-> check your connection options to the docker daemon and confirm containers exist')
    }
    console.log('\x1b[0m')
  }

  process.exit(-1)
})
