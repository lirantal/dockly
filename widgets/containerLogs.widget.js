
'use strict';

class myWidget {
  constructor({blessed = {}, contrib = {}, screen = {}}) {
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen

    this.widget = this.getWidget()
  }

  setWidgetsRepo(widgets = new Map()) {
    this.widgetsRepo = widgets
  }

  setUtilsRepo(utils = new Map()) {
    this.utilsRepo = utils
  }

  init() {
    return null
  }

  focus() {
    this.widget.focus()
  }

  getWidget() {
    return this.blessed.log({
      label: 'Container Logs',
      mouse: true,
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      vi: true,
      style: {
        fg: 'default',
        bg: 'default',
        border: {
          fg: 'default',
          bg: 'default'
        },
        selected: {
          bg: 'green'
        }
      },
      border: {
        type: 'line',
        fg: '#00ff00'
      },
      hover: {
        bg: 'blue'
      },
      scrollbar: {
        fg: 'blue',
        ch: '|'
      },
      width: '100%',
      height: '45%',
      top: '55%',
      left: '0',
      align: 'left',
      content: ''
    })
  }

  renderWidget() {
    return this.screen.append(this.widget)
  }

  update(data) {
    return this.widget.add(data)
  }

}

module.exports = myWidget