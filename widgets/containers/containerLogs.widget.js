'use strict'

const LogWidget = require('../../src/widgetsTemplates/logs.widget.template')

class myWidget extends LogWidget {
  getLabel () {
    return 'Container Logs'
  }
}

module.exports = myWidget
