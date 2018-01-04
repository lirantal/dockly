'use strict'

const InfoWidget = require('../../src/widgetsTemplates/info.widget.template')

class myWidget extends InfoWidget {
  constructor (args) {
    super(args)
    this.label = 'Container Info'
  }

  getSelectedItemId () {
    return this.widgetsRepo.get('containerList').getSelectedContainer()
  }

  getItemById (itemId, cb) {
    return this.utilsRepo.get('docker').getContainer(itemId, cb)
  }
}

module.exports = myWidget
