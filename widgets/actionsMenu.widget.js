'use strict'

const baseWidget = require('../src/baseWidget')

class myWidget extends baseWidget() {
  constructor ({blessed = {}, contrib = {}, screen = {}, grid = {}}) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.label = 'Menu'
    this.widget = this.getWidget()

    this.toggleVisibility = 0

    this.menuItems = {
      'Stop All Containers': this.stopAllContainers,
      'Remove Selected Container': this.deleteSelectedContainer,
      'Remove All Containers': this.removeAllContainers,
      'Remove All Images': this.removeAllImages
    }

    this.widget.setItems(Object.keys(this.menuItems))
  }

  stopAllContainers () {
    this.utilsRepo.get('docker').stopAllContainers((res) => {
      // @TODO not doing anything yet with the result
    })
  }

  removeAllContainers () {
    this.utilsRepo.get('docker').removeAllContainers((res) => {
      // @TODO not doing anything yet with the result
    })
  }

  removeAllImages () {
    this.utilsRepo.get('docker').removeAllImages((res) => {
      // @TODO not doing anything yet with the results
    })
  }

  deleteSelectedContainer () {
    if (this.widgetsRepo && this.widgetsRepo.has('containerList')) {
      const containerId = this.widgetsRepo.get('containerList').getSelectedContainer()
      if (containerId && containerId !== 0 && containerId !== false) {
        this.utilsRepo.get('docker').removeContainer(containerId, (err, data) => {
          // TODO: emit an event for a refreshed list of containers and images
        })
      }
    }
  }

  init () {
    if (!this.widgetsRepo.has('toolbar')) {
      return null
    }

    this.widget.on('keypress', (ch, key) => {
      if (key.name === 'escape' || key.name === 'return') {
        this.widget.destroy()
      }
    })

    this.widget.on('select', (el, selected) => {
      const option = el.getText()

      this.toggleVisibility = !this.toggleVisibility

      const optionFunction = this.menuItems[option]
      if (typeof optionFunction === 'function') {
        optionFunction.call(this)
      }
    })

    const toolbar = this.widgetsRepo.get('toolbar')
    toolbar.on('key', (keyString) => {
      // on info keypress m
      if (keyString === 'm') {
        this.toggleVisibility = !this.toggleVisibility
        if (this.toggleVisibility) {
          // show the widget and focus on it,
          this.screen.append(this.widget)
          this.screen.render()
          this.widget.focus()
        } else {
          this.screen.remove(this.widget)
        }
      }
    })
  }

  getWidget () {
    return this.grid.gridObj.set(...this.grid.gridLayout, this.blessed.list, {
      label: this.label,
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      interactive: true,
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
      align: 'center'
    })
  }

  renderWidget () {
    return null
  }
}

module.exports = myWidget
