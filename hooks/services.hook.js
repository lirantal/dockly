'use strict'

const baseHook = require('../src/widgetsTemplates/base.hook.template')

class hook extends baseHook {
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
      if (keyString === 'space') { // refresh key
        this.getFreshData((err, data) => {
          if (err) {
            data = {}
          }
          // emit an even for a refreshed list of services and images
          this.emit('servicesAndImagesList', data)
        })
      }

      if (keyString === 'c') {
        this.copyItemIdToClipboard()
      }
    })

    if (this.widgetsRepo.has('servicesLogs') && this.widgetsRepo.has('servicesList')) {
      this.setupSwitchFocus()
    }
  }

  setupSwitchFocus () {
    const containerLogs = this.widgetsRepo.get('servicesLogs')
    const containerList = this.widgetsRepo.get('servicesList')
    const screen = containerLogs.screen

    this.toggleWidgetFocus = true

    screen.on('keypress', (ch, key) => {
      if (key && key.name === 'tab') {
        this.toggleWidgetFocus ? containerLogs.focus() : containerList.focus()
        this.toggleWidgetFocus = !this.toggleWidgetFocus
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

  getSelectedItem () {
    if (!this.widgetsRepo.has('servicesList')) {
      return null
    }

    return this.widgetsRepo.get('servicesList').getSelectedService()
  }
}

module.exports = hook
