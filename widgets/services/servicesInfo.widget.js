'use strict'

const InfoWidget = require('../../src/widgetsTemplates/info.widget.template')

class myWidget extends InfoWidget {
  getLabel () {
    return 'Service Info'
  }

  getSelectedItemId () {
    return this.widgetsRepo.get('servicesList').getSelectedService()
  }

  getItemById (itemId, cb) {
    return this.utilsRepo.get('docker').getService(itemId, cb)
  }
}

module.exports = myWidget
