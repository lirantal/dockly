'use strict'

const EventEmitter = require('events')
const chalk = require('chalk')

const baseWidget = require('../baseWidget')

class myWidget extends baseWidget(EventEmitter) {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid
    this.label = this.getLabel()

    this.widget = this.getWidget()
    this.toggleWidgetListColor = 0
  }

  init () {
    this.refreshList()
    this.focus()

    this.widget.on('select', (item, idx) => {
      // extract the first column out of the table row which is the item id
      const itemId = this.getItemId(item)
      if (!itemId) {
        return null
      }

      // get logs for the items
      this.getItemLogs(itemId, (err, stream) => {
        if (err) {
          return null
        }

        // clear log box of previous logs
        this.clearItemLogs()

        let str
        if (stream && stream.pipe) {
          stream.on('data', (chunk) => {
            // toggle for alternating the colors
            this.toggleWidgetListColor = !this.toggleWidgetListColor

            if (this.toggleWidgetListColor) {
              str = chalk.cyan(chunk.toString('utf-8').trim())
            } else {
              str = chalk.green(chunk.toString('utf-8').trim())
            }

            this.updateItemLogs(str)
          })
        }
      })
    })

    if (!this.widgetsRepo.has('toolbar')) {
      return null
    }

    const toolbar = this.widgetsRepo.get('toolbar')
    toolbar.on('key', (keyString) => {
      if (keyString === 'space') { // refresh key
        this.refreshList()
      }
    })

    if (this.widgetsRepo && this.widgetsRepo.has('searchInput')) {
      const searchInput = this.widgetsRepo.get('searchInput')

      searchInput.on('keypress', (data) => {
        this.filterList(data)
      })

      searchInput.on('exitSearch', () => {
        this.focus()
      })
    }
  }

  getWidget () {
    return this.grid.gridObj.set(...this.grid.gridLayout, this.blessed.listtable, {
      parent: this.screen,
      label: this.label,
      keys: true,
      mouse: true,
      data: null,
      tags: true,
      interactive: true,
      border: 'line',
      hover: {
        bg: 'blue'
      },
      style: this.getWidgetStyle(),
      align: 'center'
    })
  }

  refreshList () {
    this.getListItems((err, data) => {
      if (!err) {
        const selectedIndex = this.widget.selected
        this.update(this.formatList(data))
        this.widget.select(selectedIndex)
        this.focus()
        this.screen.render()
      }
    })
  }

  getItemId (item) {
    if (!item) {
      return null
    }

    return item.getContent().toString().trim().split(' ').shift()
  }

  getLabel () {
    throw new Error('method getLabel not implemented')
  }

  getListItems (cb) {
    throw new Error('method getListItems not implemented')
  }

  getItemLogs (cb) {
    throw new Error('method getItemLogs not implemented')
  }

  updateItemLogs (str) {
    throw new Error('method updateItemLogs not implemented')
  }

  clearItemLogs (str) {
    throw new Error('method clearItemlogs not implemented')
  }

  filterList (data) {
    throw new Error('method filterList not implemented')
  }

  formatList (data) {
    throw new Error('method formatList not implemented')
  }

  update (data) {
    this.widget.clearItems()
    return this.widget.setData(data)
  }
}

module.exports = myWidget
