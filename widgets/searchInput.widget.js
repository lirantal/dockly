'use strict'

const EventEmitter = require('events')
const baseWidget = require('../src/baseWidget')

const ASCII_CHAR_START = 32
const ASCII_CHAR_END = 126

class myWidget extends baseWidget(EventEmitter) {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.toggleVisibility = 0
    this.label = this.getLabel()
    this.widget = this.getWidget()

    this.inputValue = []
  }

  getLabel () {
    return ''
  }

  renderWidget () {
    return null
  }

  captureText (key) {
    if (!key || typeof key !== 'object') {
      return ''
    }

    if (key.ch) {
      this.inputValue.push(key.ch)
    }

    if (key.sequence) {
      if (key.name === 'backspace') {
        this.inputValue.pop()
      }

      const charactarCode = key.sequence.charCodeAt(0)
      if (charactarCode >= ASCII_CHAR_START && charactarCode <= ASCII_CHAR_END) {
        this.inputValue.push(key.sequence)
      }
    }

    return this.inputValue.join('')
  }

  init () {
    if (!this.widgetsRepo.has('toolbar')) {
      return null
    }

    this.widget.on('keypress', (ch, key) => {
      if (key.name === 'escape' || key.name === 'return' || key.name === 'enter') {
        this.toggleVisibility = !this.toggleVisibility
        this.widget.clearValue()
        this.inputValue = []
        this.widget.destroy()
        this.emit('exitSearch')
        this.screen.remove(this.widget)
        this.screen.render()
      } else {
        const searchText = this.captureText(key)
        this.widget.setValue(searchText)
        this.emit('keypress', searchText)
        this.screen.render()
      }
    })

    const toolbar = this.widgetsRepo.get('toolbar')
    toolbar.on('key', (keyString) => {
      if (keyString === '/') {
        this.toggleVisibility = !this.toggleVisibility
        if (this.toggleVisibility) {
          this.screen.append(this.widget)
          this.screen.render()
          this.widget.focus()
        } else {
          this.screen.remove(this.widget)
        }
      }
    })

    // by default, remove this widget from the screen
    this.screen.remove(this.widget)
  }
  getWidget () {
    return this.grid.gridObj.set(...this.grid.gridLayout, this.blessed.textbox, {
      focused: true,
      border: 'line',
      style: this.getWidgetStyle(),
      align: 'left',
      inputOnFocus: true,
      vi: true,
      value: ''
    })
  }
}

module.exports = myWidget
