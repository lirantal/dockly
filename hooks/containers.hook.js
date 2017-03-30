'use strict'

const EventEmitter = require('events')

class hook extends EventEmitter {
  constructor () {
    super()
  }

  setWidgetsRepo (widgets = {}) {
    this.widgetsRepo = widgets
  }

  setUtilsRepo (utils = {}) {
    this.utilsRepo = utils
  }

  init () {
    // on startup we first emit data from the docker server
    this.getFreshData((data) => {
      // emit an even for a refreshed list of containers and images
      this.emit('containersAndImagesList', data)
    })

    // on startup bind a periodical updates emitter
    this.notifyOnContainerInfo()
    this.notifyOnContainerUtilization()

    if (!this.widgetsRepo.widgetToolBar) {
      return null
    }

    const toolbar = this.widgetsRepo.widgetToolBar
    toolbar.on('key', (keyString) => {
      // on refresh keypress, update all containers and images information
      if (keyString === '=') {
        this.getFreshData((data) => {
          // emit an even for a refreshed list of containers and images
          this.emit('containersAndImagesList', data)
        })
      }

      if (keyString === 'r') {
        this.restartContainer()
      }
    })
  }

  notifyOnContainerInfo () {
    setInterval(() => {
      if (this.widgetsRepo && this.widgetsRepo.widgetContainerList) {
        // Update on Docker Info
        this.utilsRepo.docker.getInfo((data) => {
          this.emit('containerStatus', data)
        })
      }
    }, 500)

  }

  notifyOnContainerUtilization () {
    setInterval(() => {
      if (this.widgetsRepo && this.widgetsRepo.widgetContainerList) {
        const containerId = this.widgetsRepo.widgetContainerList.getSelectedContainer()
        if (containerId !== 0 && containerId !== false) {
          this.utilsRepo.docker.getContainerStats(containerId, (data) => {
            this.emit('containerUtilization', data)
          })
        }
      }
    }, 500)
  }

  getFreshData (cb) {
    this.utilsRepo.docker.listContainers((containers) => {
      this.utilsRepo.docker.listImages((images) => {
        cb({containers, images})
      })
    })
  }

  restartContainer () {

    const title = 'Restarting container'
    let message = 'Restarting container...'

    this.emit('loaderStart', {
      title: title,
      message: message
    })

    if (this.widgetsRepo && this.widgetsRepo.widgetContainerList) {
      const containerId = this.widgetsRepo.widgetContainerList.getSelectedContainer()
      if (containerId !== 0 && containerId !== false) {
        this.utilsRepo.docker.restartContainer(containerId, (err, data) => {

          if (err && err.statusCode === 500) {
            message = err.json.message
          } else {
            message = 'Container restarted successfully'
          }

          this.emit('loaderEnd', {
            title: title,
            message: message
          })

        })
      }
    }

  }

}

module.exports = hook
