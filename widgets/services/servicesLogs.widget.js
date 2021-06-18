'use strict'

const LogWidget = require('../../src/widgetsTemplates/logs.widget.template')

class myWidget extends LogWidget {
  getLabel () {
    return 'Service Logs'
  }

  getList () {
    return this.widgetsRepo.get('servicesList')
  }
}

module.exports = myWidget
