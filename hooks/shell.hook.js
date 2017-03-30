'use strict'

const opn = require('opn')
const fs = require('fs')

class hook {
  constructor () {
  }

  setWidgetsRepo (widgets = {}) {
    this.widgetsRepo = widgets
  }

  setUtilsRepo (utils = {}) {
    this.utilsRepo = utils
  }

  init () {
    if (!this.widgetsRepo.widgetToolBar) {
      return null
    }

    const toolbar = this.widgetsRepo.widgetToolBar
    toolbar.on('key', (keyString) => {
      // on refresh keypress, update all containers and images information
      if (keyString === 'l') {
        this.openShell()
      }
    })
  }

  openShell () {
    let containerId = this.widgetsRepo.widgetContainerList.getSelectedContainer()
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