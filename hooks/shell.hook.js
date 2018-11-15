'use strict'
const path = require('path')
const fs = require('fs')
const baseWidget = require('../src/baseWidget')
const TerminalLauncher = require('../lib/TerminalLauncher')

class hook extends baseWidget() {
  init () {
    if (!this.widgetsRepo.has('toolbar')) {
      return null
    }

    const toolbar = this.widgetsRepo.get('toolbar')
    toolbar.on('key', (keyString) => {
      // on refresh keypress, update all containers and images information
      if (keyString === 'l') {
        this.openShell()
      }
    })
  }

  openShell () {
    let containerId = this.widgetsRepo.get('containerList').getSelectedContainer()
    if (containerId) {
      let containerIdFile = path.join(__dirname, '/../containerId.txt')
      fs.writeFile(containerIdFile, containerId, 'utf8', (err) => {
        if (!err) {
          TerminalLauncher.launchTerminal().catch((err) => {
            console.log(err)
            const actionStatus = this.widgetsRepo.get('actionStatus')

            const title = 'Shell login to container'
            const message = 'Failed opening shell login for container: ' + containerId + ' - ' + err

            actionStatus.emit('message', {
              title: title,
              message: message
            })
          })
        }
      })
    }
  }
}

module.exports = hook
