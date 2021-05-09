'use strict'

const EventEmitter = require('events')
const baseWidget = require('../src/baseWidget')

class hook extends baseWidget(EventEmitter) {
  init () {
    if (!this.widgetsRepo.has('toolbar')) {
      return null
    }

    const toolbar = this.widgetsRepo.get('toolbar')
    toolbar.on('key', (keyString) => {
      // on refresh keypress, update all containers and images information

      if (keyString === 'r') {
        this.removeImage()
      }
    })
  }

  removeImage() {
    if (this.widgetsRepo && this.widgetsRepo.has('imageList')) {
      const imageId = this.widgetsRepo.get('imageList').getSelectedImage()
      if (imageId && imageId !== 0 && imageId !== false) {
        const actionStatus = this.widgetsRepo.get('actionStatus')

        const title = 'Removing image'
        let message = 'Removing image...'

        actionStatus.emit('message', {
          title: title,
          message: message
        })

        this.utilsRepo.get('docker').removeImage(imageId, (err, data) => {
          if (err && err.statusCode === 500) {
            message = err.json.message
          } else {
            message = 'Removed image successfully'
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
