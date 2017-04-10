'use strict'

const EventEmitter = require('events')

class hook extends EventEmitter {
  setWidgetsRepo (widgets = new Map()) {
    this.widgetsRepo = widgets
  }

  setUtilsRepo (utils = new Map()) {
    this.utilsRepo = utils
  }

  init () {
    // on startup we first emit data from the docker server
    this.getFreshData((err, data) => {
      if (err) {
        data = {}
      }
      // emit an even for a refreshed list of containers and images
      this.emit('containersAndImagesList', data)
    })

    // on startup bind a periodical updates emitter
    this.notifyOnContainerInfo()
    this.notifyOnContainerUtilization()

    if (!this.widgetsRepo.has('toolbar')) {
      return null
    }

    const toolbar = this.widgetsRepo.get('toolbar')
    toolbar.on('key', (keyString) => {
      // on refresh keypress, update all containers and images information
      if (keyString === '=') {
        this.getFreshData((err, data) => {
          if (err) {
            data = {}
          }
          // emit an even for a refreshed list of containers and images
          this.emit('containersAndImagesList', data)
        })
      }

      if (keyString === 'r') {
        this.restartContainer()
      }

      if (keyString === 's') {
        this.stopContainer()
      }
    })
  }

  notifyOnContainerInfo () {
    setInterval(() => {
      if (this.widgetsRepo && this.widgetsRepo.has('containerList')) {
        // Update on Docker Info
        this.utilsRepo.get('docker').getInfo((data) => {
          this.emit('containerStatus', data)
        })
      }
    }, 500)
  }

  notifyOnContainerUtilization () {
    setInterval(() => {
      if (this.widgetsRepo && this.widgetsRepo.has('containerList')) {
        const containerId = this.widgetsRepo.get('containerList').getSelectedContainer()
        if (containerId !== 0 && containerId !== false) {
          this.utilsRepo.get('docker').getContainerStats(containerId, (data) => {
            this.emit('containerUtilization', data)
          })
        }
      }
    }, 500)
  }

  getFreshData (cb) {
    this.utilsRepo.get('docker').listContainers((err, containers) => {
      if (err) {
        return cb(err, {})
      }
      this.utilsRepo.get('docker').listImages((err, images) => {
        if (err) {
          return cb(err, {})
        }
        return cb(null, {containers, images})
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

    if (this.widgetsRepo && this.widgetsRepo.has('containerList')) {
      const containerId = this.widgetsRepo.get('containerList').getSelectedContainer()
      if (containerId !== 0 && containerId !== false) {
        this.utilsRepo.get('docker').restartContainer(containerId, (err, data) => {
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

  stopContainer () {
    const title = 'Stop container'
    let message = 'Stopping container...'

    this.emit('loaderStart', {
      title: title,
      message: message
    })

    if (this.widgetsRepo && this.widgetsRepo.has('containerList')) {
      const containerId = this.widgetsRepo.get('containerList').getSelectedContainer()
      if (containerId !== 0 && containerId !== false) {
        this.utilsRepo.get('docker').stopContainer(containerId, (err, data) => {
          if (err && err.statusCode === 500) {
            message = err.json.message
          } else {
            message = 'Container stopped successfully'
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
