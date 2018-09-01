'use strict'

const baseWidget = require('../../src/baseWidget')

class myWidget extends baseWidget() {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.label = 'Running/Stopped'
    this.color = {
      'ServicesRunning': 'green',
      'ServicesStopped': 'red'
    }

    this.widget = this.getWidget()
  }

  init () {
    this.utilsRepo.get('docker').listServices((err, data) => {
      if (!err) {
        this.update(data)
      }
    })
  }

  getWidget () {
    return this.grid.gridObj.set(...this.grid.gridLayout, this.contrib.gauge, {
      label: this.label,
      style: {
        fg: 'blue',
        bg: 'default',
        border: {
          fg: 'default',
          bg: 'default'
        },
        selected: {
          bg: 'green'
        }
      },
      border: {
        type: 'line',
        fg: '#00ff00'
      },
      hover: {
        bg: 'blue'
      },
      width: '20%',
      height: '18%',
      top: '0',
      left: '80%'
    })
  }

  update (services) {
    if (!services || (typeof services !== 'object')) {
      return
    }

    let running = 0
    services.forEach((service) => {
      const replicas = service.Spec.Mode.Replicated ? '' + service.Spec.Mode.Replicated.Replicas : ''
      if (replicas) {
        running++
      }
    })

    const stopped = services.length - running

    if (services.length !== 0) {
      let stack = []
      if (running !== 0) {
        stack.push({
          percent: Math.round((running / services.length) * 100),
          stroke: this.color['ServicesRunning']
        })
      }

      if (stopped !== 0) {
        stack.push({
          percent: Math.round((stopped / services.length) * 100),
          stroke: this.color['ServicesStopped']
        })
      }

      this.widget.setStack(stack)
      this.screen.render()
    }
  }
}

module.exports = myWidget
