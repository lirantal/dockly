'use strict'
const opn = require('opn')

const dockerRunScriptPath = `${__dirname}/../dockerRunScript.sh`
const terminalAppsInfo = [
  // MacOS variations of terminal apps
  'Hyper',
  'iTerm',
  'terminal.app',
  // Linux variations of terminal apps
  ['x-terminal-emulator', '-e'],
  ['gnome-terminal', '-e'],
  ['konsole', '-e'],
  ['xterm', '-e'],
  ['urxvt', '-e'],
  [process.env.COLORTERM, '-e'],
  [process.env.XTERM, '-e']
]

class TerminalLauncher {
  static getTerminals () {
    const terminalApps = terminalAppsInfo.map((appInfo) => {
      return () => opn(dockerRunScriptPath, { app: appInfo })
    })

    terminalApps.push(() => opn(dockerRunScriptPath))
    return terminalApps
  }

  static launchTerminal () {
    const shellLauncher = TerminalLauncher.getTerminals().reduce((promise, nextPromise) => {
      return promise.catch(nextPromise)
    }, Promise.reject()) /* eslint prefer-promise-reject-errors: "off" */

    return shellLauncher
  }
}

module.exports = TerminalLauncher
