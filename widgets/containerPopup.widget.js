'use strict'
const baseWidget = require('../src/baseWidget')

class myWidget extends baseWidget() {
  constructor ({blessed = {}, contrib = {}, screen = {}}) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen

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
    return this.blessed.box({
      label: 'Status',
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      vi: true,
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
      width: '60%',
      height: '20%',
      top: 'center',
      left: 'center',
      align: 'left',
      content: ''
    })
  }

  update (data) {
    this.screen.append(this.widget)

    if (data && data.label) {
      this.widget.setLabel(data.label)
    }

    if (data && data.message) {
      this.widget.setContent(data.message)
    }

    this.screen.render()
    this.widget.focus()
  }
}

module.exports = myWidget
