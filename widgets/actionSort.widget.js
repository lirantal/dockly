'use strict'

const baseWidget = require('../src/baseWidget')
const EventEmitter = require('events')

class myWidget extends baseWidget(EventEmitter) {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.label = 'Sort containers'
    this.widget = this.getWidget()

    this.toggleVisibility = 0

    this.menuItems = {
      'Sort by state': this.sortByState,
      'Sort by name': this.sortByName,
      'Sort by image': this.sortByImage
    }

    this.widget.setItems(Object.keys(this.menuItems))
  }

  close () {
    this.toggleWidgetListColor = 0
    this.widget.destroy()
    this.screen.remove(this.widget)
  }

  sortByState () {
    this.emit('sort', 'state')
  }

  sortByName () {
    this.emit('sort', 'name')
  }

  sortByImage () {
    this.emit('sort', 'image')
  }

  init () {
    if (!this.widgetsRepo.has('toolbar')) {
      return null
    }

    this.widget.on('keypress', (ch, key) => {
      if (key.name === 'escape') {
        this.close()
      }
    })

    this.widget.on('select', (el, selected) => {
      this.toggleVisibility = !this.toggleVisibility
      const option = el.getText()

      const optionFunction = this.menuItems[option]
      if (typeof optionFunction === 'function') {
        optionFunction.call(this)
        this.close()
      }
    })

    const toolbar = this.widgetsRepo.get('toolbar')
    toolbar.on('key', (keyString) => {
      if (keyString === 'x') {
        this.toggleVisibility = !this.toggleVisibility
        if (this.toggleVisibility) {
          this.screen.append(this.widget)
          this.screen.render()
          this.widget.focus()
        }
      }
    })

    this.close()
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
