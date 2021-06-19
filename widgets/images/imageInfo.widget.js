'use strict'

const InfoWidget = require('../../src/widgetsTemplates/info.widget.template')

class myWidget extends InfoWidget {
  getLabel () {
    return 'Image Info'
  }

  getSelectedItemId () {
    return this.widgetsRepo.get('imageList').getSelectedImage()
  }

  getItemById (itemId, cb) {
    return this.utilsRepo.get('docker').getImage(itemId, cb)
  }
}

module.exports = myWidget
