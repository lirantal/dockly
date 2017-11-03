'use strict'
const baseWidget = require('../src/baseWidget')

class myWidget extends baseWidget() {
  constructor ({blessed = {}, contrib = {}, screen = {}, grid = {}}) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.widget = this.getWidget()
  }

  init () {
    if (!this.widgetsRepo.has('containers')) {
      return null
    }

    this.widget.on('keypress', (ch, key) => {
      if (key.name === 'escape') {
        this.widget.destroy()
      }
    })

    const dockerHook = this.widgetsRepo.get('containers')
    dockerHook.on('loaderStart', (data) => {
      return this.update(data)
    })

    dockerHook.on('loaderEnd', (data) => {
      return this.update(data)
    })
  }

  renderWidget () {
    return null
  }

  getWidget () {
    return this.grid.gridObj.set(...this.grid.gridLayout, this.blessed.box, {
      label: 'Status',
      scrollable: true,
      alwaysScroll: true,
      tags: true,
      style: {
        selected: {
          bg: 'green'
        }
      },
      border: {
        type: 'line'
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
    if (data && data.label) {
      this.widget.setLabel(data.label)
    }

    if (data && data.message) {
      let dateTime = new Date().toLocaleString()
      let actionStatus = `${dateTime} - ${data.message}`

      this.widget.setContent(actionStatus)
    }

    this.screen.render()
  }
}

module.exports = myWidget
