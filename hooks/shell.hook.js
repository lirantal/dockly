'use strict'

const baseWidget = require('../src/baseWidget')
const cp = require('child_process')
const console = require('console')

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
    const containerList = this.widgetsRepo.get('containerList')
    const containerId = containerList.getSelectedContainer()

    if (containerId) {
      this.utilsRepo.get('docker').getContainer(containerId, (_, container) => {
        if (!container.State.Running) {
          this.emitActionStatus('Oops!', 'Cannot attach interactive shell - Container is not running.')
          return
        }

        try {
          console.clear()

          cp.execFileSync('docker', ['exec', '-it', containerId, '/bin/sh', '-c', '[ -e /bin/bash ] && /bin/bash || /bin/sh'], {
            'stdio': 'inherit'
          })

          this.emitActionStatus('Ok', 'Exited shell.')
        } catch (error) {
          this.emitActionStatus('Error', error)
        } finally {
          console.clear()
          // Force realloc buffers because tracked history is not valid anymore
          containerList.screen.realloc()
        }
      })
    }
  }

  emitActionStatus (title, message) {
    const actionStatus = this.widgetsRepo.get('actionStatus')
    actionStatus.emit('message', {
      message,
      title
    })
  }
}

module.exports = hook
