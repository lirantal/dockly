'use strict'

const HelpWidget = require('../src/widgetsTemplates/help.widget.template')

class myWidget extends HelpWidget {
  getLabel () {
    return 'Dockly Help'
  }
}

module.exports = myWidget
