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
      // emit an even for a refreshed list of services and images
      this.emit('servicesAndImagesList', data)
    })

    // on startup bind a periodical updates emitter
    this.notifyOnServiceInfo()

    if (!this.widgetsRepo.has('toolbar')) {
      return null
    }

    const toolbar = this.widgetsRepo.get('toolbar')
    toolbar.on('key', (keyString) => {
      // on refresh keypress, update all services and images information
      if (keyString === '=') {
        this.getFreshData((err, data) => {
          if (err) {
            data = {}
          }
          // emit an even for a refreshed list of services and images
          this.emit('servicesAndImagesList', data)
        })
      }
    })
  }

  notifyOnServiceInfo () {
    setInterval(() => {
      if (this.widgetsRepo && this.widgetsRepo.has('servicesList')) {
        // Update on Docker Info
        this.utilsRepo.get('docker').getInfo((data) => {
          this.emit('servicesStatus', data)
        })
      }
    }, 500)
  }

  getFreshData (cb) {
    this.utilsRepo.get('docker').listServices((err, services) => {
      if (err) {
        return cb(err, {})
      }
      this.utilsRepo.get('docker').listImages((err, images) => {
        if (err) {
          return cb(err, {})
        }
        return cb(null, { services, images })
      })
    })
  }
}

module.exports = hook
