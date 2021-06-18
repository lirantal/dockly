'use strict'

const LogWidget = require('../../src/widgetsTemplates/logs.widget.template')

class myWidget extends LogWidget {
  getLabel () {
    return 'Container Logs'
  }

  getList () {
    return this.widgetsRepo.get('containerList')
  }
}

module.exports = myWidget
