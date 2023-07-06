#!/usr/bin/env node
'use strict'

/**
 * Project dependencies
 */
const semver = require('semver')
const chalk = require('chalk')
const nodeVersion = require('./lib/node.version')
const Screen = require('./src/screen')
const DockerUtil = require('./src/dockerUtil')
const cli = require('./src/cli')

const cliOptions = cli.cliParse()
if (cliOptions.help) {
  cli.showUsage()
  process.exit(0)
}

if (cliOptions.version) {
  cli.showVersion()
  process.exit(0)
}

if (semver.lt(process.version, nodeVersion.minimum)) {
  cli.showUsage()
  console.log(chalk.red('unsupported node version, please use a version equal or greater than ' + nodeVersion.minimum))
  process.exit(0)
}

initDockerConnection()
  .then(initScreens)
  .then(function (screen) {
    // register listener 
    process.on('uncaughtException', (err) => {
      // Make sure the screen is cleared
      screen.teardown()
      exitError(err)
    })
  })
  .catch((err) => {
    return exitError(err)
  })

  // Returns docker in map 
function initDockerConnection () {
  return new Promise((resolve, reject) => {
    let utils
    let docker

    try {
      docker = new DockerUtil(cli.cliParse())
    } catch (err) {
      return exitError(err)
    }

    docker.ping((err) => {
      if (err) {
        return reject(err)
      }

      utils = new Map([
        ['docker', docker]
      ])

      return resolve(utils)
    })
  })
}

// draw screens 
function initScreens (utils) {
  return new Promise((resolve, reject) => {
    let screen
    try {
      screen = new Screen(utils)
      screen.init()
    } catch (err) {
      return reject(err)
    }

    return resolve(screen)
  })
}

function exitError (err) {
  cli.showUsage()

  if (err && err.message) {
    console.log('\x1b[31m')
    console.trace(err)

    if (err.message === 'Unable to determine the domain name') {
      console.log('-> check your connection options to the docker daemon and confirm containers exist')
    }
    console.log('\x1b[0m')
  }

  process.exit(-1)
}
