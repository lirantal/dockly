'use strict'

const EventEmitter = require('events')
const chalk = require('chalk')
const os = require('os')

class myWidget extends EventEmitter {
  constructor(blessed = {}, screen = {}) {
    super()
    this.blessed = blessed
    this.screen = screen

    this.widget = this.getWidget()
    this.toggleWidgetContainerListColor = 0
  }

  setWidgetsRepo(widgets = {}) {
    this.widgetsRepo = widgets
  }

  setUtilsRepo(utils = {}) {
    this.utilsRepo = utils
  }

  init() {
    this.refreshContainers()
    this.focus()

    this.widget.on('select', (item, idx) => {

      // extract the first column out of the table row which is the container id
      var containerId = item.getContent().toString().trim().split(' ').shift()

      // get logs for the container
      this.utilsRepo.docker.getContainerLogs(containerId, (err, stream) => {
        var str
        if (stream && stream.pipe) {
          stream.on('data', (chunk) => {

            // toggle for alternating the colors
            this.toggleWidgetContainerListColor = !this.toggleWidgetContainerListColor

            if (this.toggleWidgetContainerListColor) {
              str = chalk.cyan(chunk.toString('utf-8').trim())
            } else {
              str = chalk.green(chunk.toString('utf-8').trim())
            }

            this.widgetsRepo.widgetContainerLogs.update(str + os.EOL)
          })
        }
      })
    })

    if (!this.widgetsRepo.widgetToolBar) {
      return null
    }

    const toolbar = this.widgetsRepo.widgetToolBar
    toolbar.on('key', (keyString) => {
      if (keyString === '=') {
        this.refreshContainers()
      }
    })
  }

  getWidget() {
    return this.blessed.listtable({
      parent: this.screen,
      label: 'Containers',
      keys: true,
      mouse: true,
      data: null,
      tags: true,
      interactive: true,
      border: 'line',
      hover: {
        bg: 'blue'
      },
      style: {
        header: {
          fg: 'blue',
          bold: true
        },
        cell: {
          fg: 'magenta',
          selected: {
            bg: 'blue'
          }
        }
      },
      width: '80%',
      height: '55%',
      top: '0',
      left: '0',
      align: 'center'
    })

  }

  focus() {
    this.widget.focus()
  }

  renderWidget() {
    return this.screen.append(this.widget)
  }

  refreshContainers() {
    this.utilsRepo.docker.listContainers((data) => {
      this.update(data)
      this.widget.select(1)
      this.focus()
      this.screen.render()
    })
  }

  /**
   * returns a selected container from the containers listbox
   * @return {string} container id
   */
  getSelectedContainer() {
    return this.widget.getItem(this.widget.selected).getContent().toString().trim().split(' ').shift()
  }

  update(data) {
    return this.widget.setData(data)
  }
}

module.exports = myWidget