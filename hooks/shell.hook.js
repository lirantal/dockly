'use strict'

const opn = require('opn')
const fs = require('fs')

class hook {
  setWidgetsRepo (widgets = new Map()) {
    this.widgetsRepo = widgets
  }

  setUtilsRepo (utils = new Map()) {
    this.utilsRepo = utils
  }

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
      let containerIdFile = process.cwd() + '/containerId.txt'
      fs.writeFile(containerIdFile, containerId, 'utf8', function (err) {
        if (!err) {
          opn(`${process.cwd()}/dockerRunScript.sh`)
        }
      })
    }
  }
}

module.exports = hook
