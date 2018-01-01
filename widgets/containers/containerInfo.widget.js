'use strict'

const util = require('util')
const baseWidget = require('../../src/baseWidget')

class myWidget extends baseWidget() {
  constructor ({blessed = {}, contrib = {}, screen = {}, grid = {}}) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.label = 'Container Info'
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
    // @TODO
    //    `return this.grid.gridObj.set(...this.grid.gridLayout, this.blessed.box, {`
    // removed the container popup information box from the grid because it would
    // have been expected to be drawn on the screen and take actual grid space
    // but instead its just a popup.
    // The @TODO is to create another kind of dashboard that will represent the
    // container info with its own grid and we can display/hide it on the screen
    // on toggle on and off
    return this.blessed.box({
      label: this.label,
      scrollable: true,
      alwaysScroll: true,
      keys: true,
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
      width: '70%',
      height: '70%',
      top: 'center',
      left: 'center',
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
