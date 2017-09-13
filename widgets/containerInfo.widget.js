'use strict'

const util = require('util')
const baseWidget = require('../src/baseWidget')

class myWidget extends baseWidget() {
  constructor ({blessed = {}, contrib = {}, screen = {}, grid = {}}) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.widget = this.getWidget()

    this.toggleVisibility = 0
  }

  init () {
    if (!this.widgetsRepo.has('toolbar')) {
      return null
    }

    this.widget.on('keypress', (ch, key) => {
      if (key.name === 'escape' || key.name === 'return') {
        this.toggleVisibility = !this.toggleVisibility
        this.widget.destroy()
      }
    })

    const toolbar = this.widgetsRepo.get('toolbar')
    toolbar.on('key', (keyString) => {
      // on info keypress i
      if (keyString === 'i') {
        const containerId = this.widgetsRepo.get('containerList').getSelectedContainer()
        if (!containerId) {
          return null
        }

        this.toggleVisibility = !this.toggleVisibility
        if (this.toggleVisibility) {
          // show the widget and focus on it,
          // widget showing a 'loading...' state
          this.screen.append(this.widget)
          this.screen.render()
          this.widget.focus()

          // then show the information on the container
          this.utilsRepo.get('docker').getContainer(containerId, (err, data) => {
            if (!err) {
              this.update(util.inspect(data))
              this.screen.render()
            }
          })
        } else {
          this.screen.remove(this.widget)
        }
      }
    })
  }

  getWidget () {
    return this.grid.gridObj.set(...this.grid.gridLayout, this.blessed.box, {
      label: 'Container Info',
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
      align: 'left',
      content: 'Loading...'
    })
  }

  renderWidget () {
    return null
  }

  update (data) {
    this.widget.setContent(data)
    this.screen.render()
  }
}

module.exports = myWidget
