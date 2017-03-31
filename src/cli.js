'use strict'

var commandLineArgs = require('command-line-args')
var commandLineUsage = require('command-line-usage')

var pkg = require('../package.json')

function Cli () {
  this.cliOpts = [
    {
      name: 'host',
      alias: 'u',
      type: String,
      description: 'Docker daemon hostname to connect to'
    },
    {
      name: 'port',
      alias: 'p',
      type: String,
      description: 'Docker daemon port to connect to'
    },
    {
      name: 'socketPath',
      alias: 's',
      type: String,
      description: 'Docker daemon socket to connect to'
    }
  ]
}

Cli.prototype.showVersion = function () {
  console.log(pkg.name + ' ' + pkg.version + ' by ' + pkg.author)
  console.log(pkg.description)
  console.log()
}

Cli.prototype.showUsage = function () {
  console.log('Usage: dockly [OPTIONS]')
  console.log('dockly [ --help | -v | --version ]')

  var usage = commandLineUsage([
    {
      header: pkg.name,
      content: pkg.description
    },
    {
      header: 'Options',
      optionList: this.cliOpts
    },
    {
      content: 'Project home: [underline]{https://github.com/lirantal/dockly}'
    }
  ])

  console.log(usage)
}

/**
 * @method cliParse
 * @return {object} [description]
 */
Cli.prototype.cliParse = function () {
  return commandLineArgs(this.cliOpts)
}

module.exports = new Cli()
