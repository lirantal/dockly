'use strict'

const EventEmitter = require('events')
const baseWidget = require('../src/baseWidget')

class myWidget extends baseWidget(EventEmitter) {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.label = 'Status'
    this.widget = this.getWidget()
  }

  init () {
    this.on('message', (data) => {
      return this.update(data)
    })
  }

  renderWidget () {
    return null
  }

  getWidget () {
    return this.grid.gridObj.set(...this.grid.gridLayout, this.blessed.box, {
      label: this.label,
      scrollable: true,
      alwaysScroll: true,
      tags: true,
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
      vi: true,
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

  // TODO this sucks 
  renderWidget () {
    return null
  }
}

module.exports = myWidget
