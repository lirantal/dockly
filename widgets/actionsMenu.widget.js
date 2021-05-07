'use strict'

const baseWidget = require('../src/baseWidget')

class myWidget extends baseWidget() {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
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
    const actionStatus = this.widgetsRepo.get('actionStatus')
    const data = {
      title: 'Stopping all containers',
      message: 'Stopping all containers...'
    }

    actionStatus.emit('message', data)
    this.utilsRepo.get('docker').stopAllContainers((res) => {
      actionStatus.emit('message', Object.assign(data, { message: 'All containers stopped successfully' }))
    })
  }

  removeAllContainers () {
    const actionStatus = this.widgetsRepo.get('actionStatus')
    const data = {
      title: 'Removing all containers',
      message: 'Removing all containers...'
    }

    this.utilsRepo.get('docker').removeAllContainers((res) => {
      actionStatus.emit('message', Object.assign(data, { message: 'All containers removed successfully' }))
    })
  }

  removeAllImages () {
    const actionStatus = this.widgetsRepo.get('actionStatus')
    const data = {
      title: 'Removing all images',
      message: 'Removing all images...'
    }

    this.utilsRepo.get('docker').removeAllImages((res) => {
      actionStatus.emit('message', Object.assign(data, { message: 'All images removed successfully' }))
    })
  }

  deleteSelectedContainer () {
    const actionStatus = this.widgetsRepo.get('actionStatus')
    const data = {
      title: 'Removing selected container',
      message: 'Removing selected container...'
    }

    if (this.widgetsRepo && this.widgetsRepo.has('containerList')) {
      const containerId = this.widgetsRepo.get('containerList').getSelectedContainer()
      if (containerId && containerId !== 0 && containerId !== false) {
        this.utilsRepo.get('docker').removeContainer(containerId, () => {
          actionStatus.emit('message', Object.assign(data, { message: `Container removed successfully: ${containerId}` }))
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
        this.toggleVisibility = !this.toggleVisibility
        this.widget.destroy()
      }
    })

    this.widget.on('select', (el, selected) => {
      this.toggleVisibility = !this.toggleVisibility
      const option = el.getText()

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
      style: this.getWidgetStyle(),
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
