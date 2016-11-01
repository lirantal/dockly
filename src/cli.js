'use strict';

var commandLineArgs = require('command-line-args');


function showVersion() {

  var pkg = require('../package.json');

  console.log(pkg.name + ' ' + pkg.version + ' by ' + pkg.author);
  console.log(pkg.description);
  console.log();
}

/**
 * @method cliParse
 * @return {object} [description]
 */
function cliInit() {

  var cliOpts = commandLineArgs([
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
  ]);

  return cliOpts;

}

showVersion();

module.exports = cliInit;
