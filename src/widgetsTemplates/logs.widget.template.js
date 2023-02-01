'use strict'

const baseWidget = require('../../src/baseWidget')

const EXPANDED_LAYOUT = [0, 0, 11, 12]

class myWidget extends baseWidget() {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid
    this.label = this.getLabel()

    this.widget = this.getWidget()
  }

  init () {
    if (!this.widgetsRepo.has('toolbar')) {
      return null
    }

    const toolbar = this.widgetsRepo.get('toolbar')
    toolbar.on('key', (keyString) => {
      // trigger resize on keypress -
      if (keyString === '-') {
        // get data from widget before destroy
        var data = this.widget.getContent()
        // remove existing log widget
        this.widget.destroy()
        // toggle isExpanded boolean
        this.isExpanded = !this.isExpanded
        // refresh widget
        this.widget = this.getWidget()
        // set data to widget after recreation
        this.widget.setContent(data)
        this.screen.render()
        // render the logs if in full view mode, or the containers if we drop to regular view
        this.isExpanded ? this.focus() : this.getList().focus()
      }
    })
  }

  getWidget () {
    // conditional grid formation based upon `isExpanded` boolean variable
    const formation = (this.isExpanded ? EXPANDED_LAYOUT : this.grid.gridLayout)
    return this.grid.gridObj.set(...formation, this.blessed.log, {
      label: this.label,
      mouse: true,
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      vi: true,
      style: this.getWidgetStyle(),
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

  getLabel () {
    throw new Error('method getLabel not implemented')
  }

  update (data) {
    return this.widget.add(data)
  }

  clear () {
    return this.widget.setContent()
  }

  getList () {
    throw new Error('method getList not implemented')
  }
}

module.exports = myWidget
