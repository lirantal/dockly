'use strict'

const LogWidget = require('../../src/widgetsTemplates/logs.widget.template')

class myWidget extends LogWidget {
  constructor (args) {
    super(args)

    this.label = 'Container Logs'
  }
}

module.exports = myWidget
