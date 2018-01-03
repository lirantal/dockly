'use strict'

const EventEmitter = require('events')
const chalk = require('chalk')
const os = require('os')

const baseWidget = require('../../src/baseWidget')

class myWidget extends baseWidget(EventEmitter) {
  constructor ({blessed = {}, contrib = {}, screen = {}, grid = {}}) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.label = 'Services'
    this.widget = this.getWidget()
    this.toggleWidgetServiceListColor = 0
  }

  init () {
    this.refreshServices()
    this.focus()

    this.widget.on('select', (item, idx) => {
      // extract the first column out of the table row which is the service id
      const serviceId = item.getContent().toString().trim().split(' ').shift()
      if (!serviceId) {
        return null
      }

      // get logs for the service
      this.utilsRepo.get('docker').getServiceLogs(serviceId, (err, stream) => {
        if (err) {
          return null
        }

        let str
        if (stream && stream.pipe) {
          stream.on('data', (chunk) => {
            // toggle for alternating the colors
            this.toggleWidgetServiceListColor = !this.toggleWidgetServiceListColor

            if (this.toggleWidgetServiceListColor) {
              str = chalk.cyan(chunk.toString('utf-8').trim())
            } else {
              str = chalk.green(chunk.toString('utf-8').trim())
            }

            this.widgetsRepo.get('servicesLogs').update(str + os.EOL)
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
        this.refreshServices()
      }
    })
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
      align: 'center'
    })
  }

  refreshServices () {
    this.utilsRepo.get('docker').listServices((err, data) => {
      if (!err) {
        this.update(this.formatServicesList(data))
        this.widget.select(1)
        this.focus()
        this.screen.render()
      }
    })
  }

  formatServicesList (services) {
    const list = []

    if (services) {
      services.forEach((service) => {
        const replicas = service.Spec.Mode.Replicated ? '' + service.Spec.Mode.Replicated.Replicas : '0'
        list.push([
          service.ID.substring(0, 5),
          service.Spec.Name.substring(0, 25),
          service.Spec.TaskTemplate.ContainerSpec.Image.substring(0, 25),
          replicas])
      })
    }

    list.unshift(['Id', 'Name', 'Image', 'Replicas'])

    return list
  }

  /**
   * returns a selected service from the services listbox
   * @return {string} service id
   */
  getSelectedService () {
    return this.widget.getItem(this.widget.selected).getContent().toString().trim().split(' ').shift()
  }

  update (data) {
    return this.widget.setData(data)
  }
}

module.exports = myWidget
