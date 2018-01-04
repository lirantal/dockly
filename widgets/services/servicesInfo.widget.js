'use strict'

const infoWidget = require('../../src/widgetsTemplates/info.widget.template')

class myWidget extends infoWidget {
  constructor (args) {
    super(args)
    this.label = 'Service Info'
  }

  getSelectedItemId () {
    return this.widgetsRepo.get('servicesList').getSelectedService()
  }

  getItemById (itemId, cb) {
    return this.utilsRepo.get('docker').getService(itemId, cb)
  }
}

module.exports = myWidget
