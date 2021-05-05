'use strict'
const getTheme = require('./themes/theme.selector')

module.exports = (extendsClass = class {}) => {
  return class extends extendsClass {
    setWidgetsRepo (widgets = new Map()) {
      this.widgetsRepo = widgets
    }

    setUtilsRepo (utils = new Map()) {
      this.utilsRepo = utils
    }

    renderWidget () {
      return this.screen.append(this.widget)
    }

    focus () {
      this.widget.focus()
    }

    getWidgetStyle (customStyle = {}) {
      return Object.assign({}, getTheme(), customStyle)
    }
  }
}
