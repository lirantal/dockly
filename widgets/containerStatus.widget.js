'use strict'

const baseWidget = require('../src/baseWidget')

class myWidget extends baseWidget() {
  constructor ({blessed = {}, contrib = {}, screen = {}, grid = {}}) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.widget = this.getWidget()
  }

  init () {
    if (!this.widgetsRepo.has('containers')) {
      return null
    }

    const dockerHook = this.widgetsRepo.get('containers')
    dockerHook.on('containerStatus', (data) => {
      return this.update(data)
    })
  }

  getWidget () {
    return this.grid.gridObj.set(...this.grid.gridLayout, this.contrib.gauge, {
      label: 'Running/Paused/Stopped',
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

  update (data) {
    if (!data || (typeof data !== 'object')) {
      return
    }

    if (data.Containers !== 0) {
      let stack = []
      if (data.ContainersRunning !== 0) {
        stack.push({
          percent: Math.round((data.ContainersRunning / data.Containers) * 100),
          stroke: 'green'
        })
      }

      if (data.ContainersPaused !== 0) {
        stack.push({
          percent: Math.round((data.ContainersPaused / data.Containers) * 100),
          stroke: 'yellow'
        })
      }

      if (data.ContainersStopped !== 0) {
        stack.push({
          percent: Math.round((data.ContainersStopped / data.Containers) * 100),
          stroke: 'red'
        })
      }

      this.widget.setStack(stack)
      this.screen.render()
    }
  }
}

module.exports = myWidget
