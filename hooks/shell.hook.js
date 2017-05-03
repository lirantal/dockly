'use strict'

const opn = require('opn')
const fs = require('fs')
const baseWidget = require('../src/baseWidget')

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
      let containerIdFile = __dirname + '/../containerId.txt'
      fs.writeFile(containerIdFile, containerId, 'utf8', function (err) {
        if (!err) {
          opn(`${__dirname}/../dockerRunScript.sh`)
        }
      })
    }
  }
}

module.exports = hook
