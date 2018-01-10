'use strict'

const LogWidget = require('../../src/widgetsTemplates/logs.widget.template')

class myWidget extends LogWidget {
  getLabel () {
    return 'Service Logs'
  }
}

module.exports = myWidget
