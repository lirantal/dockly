'use strict'

const EventEmitter = require('events')
const chalk = require('chalk')
const os = require('os')
const figures = require('figures')

class myWidget extends EventEmitter {
  constructor ({blessed = {}, contrib = {}, screen = {}}) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen

    this.widget = this.getWidget()
    this.toggleWidgetContainerListColor = 0
  }

  setWidgetsRepo (widgets = {}) {
    this.widgetsRepo = widgets
  }

  setUtilsRepo (utils = new Map()) {
    this.utilsRepo = utils
  }

  init () {
    this.refreshContainers()
    this.focus()

    this.widget.on('select', (item, idx) => {
      // extract the first column out of the table row which is the container id
      var containerId = item.getContent().toString().trim().split(' ').shift()

      // get logs for the container
      this.utilsRepo.get('docker').getContainerLogs(containerId, (err, stream) => {
        if (err) {
          return null
        }

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

            this.widgetsRepo.get('containerLogs').update(str + os.EOL)
          })
        }
      })
    })

    if (!this.widgetsRepo.has('toolbar')) {
      return null
    }

    const toolbar = this.widgetsRepo.get('toolbar')
    toolbar.on('key', (keyString) => {
      if (keyString === '=') {
        this.refreshContainers()
      }
    })
  }

  getWidget () {
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

  focus () {
    this.widget.focus()
  }

  renderWidget () {
    return this.screen.append(this.widget)
  }

  refreshContainers () {
    this.utilsRepo.get('docker').listContainers((err, data) => {
      if (!err) {
        this.update(this.formatContainersList(data))
        this.widget.select(1)
        this.focus()
        this.screen.render()
      }
    })
  }

  formatContainersList (containers) {
    const list = []

    if (containers) {
      containers.forEach((container) => {
        list.push([container.Id.substring(0, 5), container.Names[0].substring(0, 20), container.Image.substring(0, 19), container.Command.substring(0, 30), container.State, container.Status])
      })
    }

    list.sort(this.sortContainers)

    list.map((container) => {
      container[4] = this.formatContainerState(container[4])
      container[5] = this.formatContainerStatus(container[5])
      return container
    })

    list.unshift(['Id', 'Name', 'Image', 'Command', 'State', 'Status'])

    return list
  }

  formatContainerStatus (status) {
    if (status.match(/^Up/)) {
      return status.replace(/Up/, figures.tick)
    }

    if (status.match(/^Exited \(\d+\)/)) {
      return status.replace(/^Exited \(\d+\)/, figures.cross)
    }

    return status
  }

  formatContainerState (state) {
    let stateFormatted = figures.square

    if (state === 'restarting') {
      return chalk.blue(stateFormatted)
    }

    if (state === 'running') {
      return chalk.green(stateFormatted)
    }

    if (state === 'paused') {
      return chalk.yellow(stateFormatted)
    }

    if (state === 'exited') {
      return chalk.gray(stateFormatted)
    }

    if (state === 'dead') {
      return chalk.red(stateFormatted)
    }

    return stateFormatted
  }

  /**
   * returns a selected container from the containers listbox
   * @return {string} container id
   */
  getSelectedContainer () {
    return this.widget.getItem(this.widget.selected).getContent().toString().trim().split(' ').shift()
  }

  update (data) {
    return this.widget.setData(data)
  }

  /**
   * Sort containers by their state: running, created, then exited.
   *
   * @param item left
   * @param item right
   * @returns {number} for position
   */
  sortContainers (a, b) {
    if (a[4] === 'running' && b[4] !== 'running') {
      return -1
    }

    if (a[4] === 'paused' && b[4] !== 'paused') {
      return -1
    }

    if (a[4] === 'exited' && b[4] !== 'exited') {
      return 1
    }

    return 0
  }
}

module.exports = myWidget
