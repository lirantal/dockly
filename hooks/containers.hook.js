'use strict'

const EventEmitter = require('events')
const baseWidget = require('../src/baseWidget')

class hook extends baseWidget(EventEmitter) {
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
        if (containerId && containerId !== 0) {
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
        return cb(null, { containers, images })
      })
    })
  }

  restartContainer () {
    if (this.widgetsRepo && this.widgetsRepo.has('containerList')) {
      const containerId = this.widgetsRepo.get('containerList').getSelectedContainer()
      if (containerId && containerId !== 0 && containerId !== false) {
        const actionStatus = this.widgetsRepo.get('actionStatus')

        const title = 'Restarting container'
        let message = 'Restarting container...'

        actionStatus.emit('message', {
          title: title,
          message: message
        })

        this.utilsRepo.get('docker').restartContainer(containerId, (err, data) => {
          if (err && err.statusCode === 500) {
            message = err.json.message
          } else {
            message = 'Container restarted successfully'
          }

          actionStatus.emit('message', {
            title: title,
            message: message
          })
        })
      }
    }
  }

  stopContainer () {
    if (this.widgetsRepo && this.widgetsRepo.has('containerList')) {
      const containerId = this.widgetsRepo.get('containerList').getSelectedContainer()
      if (containerId && containerId !== 0 && containerId !== false) {
        const actionStatus = this.widgetsRepo.get('actionStatus')

        const title = 'Stop container'
        let message = 'Stopping container...'

        actionStatus.emit('message', {
          title: title,
          message: message
        })

        this.utilsRepo.get('docker').stopContainer(containerId, (err, data) => {
          if (err && err.statusCode === 500) {
            message = err.json.message
          } else {
            message = 'Container stopped successfully'
          }

          actionStatus.emit('message', {
            title: title,
            message: message
          })
        })
      }
    }
  }
}

module.exports = hook
