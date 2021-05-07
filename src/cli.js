'use strict'

const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

const pkg = require('../package.json')

function Cli () {
  this.cliOpts = [
    {
      name: 'socketPath',
      alias: 's',
      type: String,
      description: 'Docker daemon socket to connect to'
    },
    {
      name: 'help',
      alias: 'h',
      type: Boolean,
      description: 'Display this usage guide.'
    },
    {
      name: 'version',
      alias: 'v',
      type: Boolean,
      description: 'Display version'
    },
    {
      name: 'containerFilters',
      type: String,
      description: 'Filter containers'
    },
    {
      name: 'theme',
      type: String,
      description: 'Theme: light or dark (e.g. --theme light)'
    }
  ]
}

Cli.prototype.showVersion = function () {
  const author = pkg.author.name + '<' + pkg.author.email + '>'
  console.log(pkg.name + ' ' + pkg.version + ' by ' + author)
  console.log(pkg.description)
  console.log()
}

Cli.prototype.showUsage = function () {
  console.log()

  console.log(pkg.name + ' ' + pkg.version)
  console.log('Usage: dockly [OPTIONS]')

  const usage = commandLineUsage([
    {
      header: pkg.name,
      content: pkg.description
    },
    {
      header: 'Options',
      optionList: this.cliOpts
    },
    {
      content: 'Project home: {underline https://github.com/lirantal/dockly}'
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
