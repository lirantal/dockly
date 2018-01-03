'use strict'

const baseWidget = require('../../src/baseWidget')

class myWidget extends baseWidget() {
  constructor ({blessed = {}, contrib = {}, screen = {}, grid = {}}) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.label = 'Service Logs'
    this.widget = this.getWidget()
  }

  init () {
    return null
  }

  getWidget () {
    return this.grid.gridObj.set(...this.grid.gridLayout, this.blessed.log, {
      label: this.label,
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
      align: 'left',
      content: ''
    })
  }

  update (data) {
    return this.widget.add(data)
  }
}

module.exports = myWidget
