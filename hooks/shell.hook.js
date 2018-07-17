'use strict'

const path = require('path')
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
      let containerIdFile = path.join(__dirname, '/../containerId.txt')
      fs.writeFile(containerIdFile, containerId, 'utf8', (err) => {
        if (!err) {
          return opn(`${__dirname}/../dockerRunScript.sh`)
            .catch((err) => {
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
