'use strict'

const EventEmitter = require('events')
const baseWidget = require('../src/baseWidget')
const clipboardy = require('clipboardy')

class hook extends baseWidget(EventEmitter) {
  init () {
    if (!this.widgetsRepo.has('toolbar')) {
      return null
    }

    this.notifyOnImageUpdate()

    const toolbar = this.widgetsRepo.get('toolbar')
    toolbar.on('key', (keyString) => {
      // on refresh keypress, update all containers and images information

      if (keyString === 'r') {
        this.removeImage()
      }

      if (keyString === 'c') {
        this.copyImageIdToClipboard()
      }
    })
  }

  copyImageIdToClipboard () {
    if (this.widgetsRepo && this.widgetsRepo.has('imageList')) {
      const imageId = this.widgetsRepo.get('imageList').getSelectedImage()
      if (imageId) {
        clipboardy.writeSync(imageId)

        const actionStatus = this.widgetsRepo.get('actionStatus')
        const message = `Image Id ${imageId} was copied to the clipboard`

        actionStatus.emit('message', {
          message: message
        })
      }
    }
  }

  notifyOnImageUpdate () {
    setInterval(() => {
      if (this.widgetsRepo && this.widgetsRepo.has('imageList')) {
        // Update on Docker Info
        this.utilsRepo.get('docker').systemDf((data) => {
          if (!data.Images) {
            return
          }

          const UseImages = []
          const UnuseImages = []

          data.Images.forEach(image => {
            if (image.Containers > 0) {
              UseImages.push(image)
            } else {
              UnuseImages.push(image)
            }
          })

          data.UseImages = UseImages
          data.UnuseImages = UnuseImages

          this.emit('imagesUtilization', data)
          this.emit('imageSize', data)
        })
      }
    }, 1000)
  }

  removeImage () {
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
          if (err) {
            message = err.json.message
          } else {
            message = 'Removed image successfully'
            this.widgetsRepo.get('imageList').refreshList()
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
