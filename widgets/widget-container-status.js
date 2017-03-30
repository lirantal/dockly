'use strict'

class myWidget {
  constructor(blessed = {}, screen = {}) {
    this.blessed = blessed
    this.screen = screen

    this.widget = this.getWidget()
  }

  setWidgetsRepo(widgets = {}) {
    this.widgetsRepo = widgets
  }

  setUtilsRepo(utils = {}) {
    this.utilsRepo = utils
  }

  init() {
    if (!this.widgetsRepo.dockerHook) {
      return null
    }

    const dockerHook = this.widgetsRepo.dockerHook
    dockerHook.on('containerStatus', (data) => {
      return this.update(data)
    })
  }

  getWidget() {
    return this.blessed.gauge({
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

  renderWidget() {
    return this.screen.append(this.widget)
  }

  update(data) {
    if (!data || Object.keys(data).length === 0) {
      return;
    }

    if (data.Containers !== 0) {

      let stack = [];
      if (data.ContainersRunning !== 0) {
        stack.push({
          percent: Math.round((data.ContainersRunning / data.Containers) * 100),
          stroke: 'green'
        });
      }

      if (data.ContainersPaused !== 0) {
        stack.push({
          percent: Math.round((data.ContainersPaused / data.Containers) * 100),
          stroke: 'yellow'
        });
      }

      if (data.ContainersStopped !== 0) {
        stack.push({
          percent: Math.round((data.ContainersStopped / data.Containers) * 100),
          stroke: 'red'
        });
      }

      this.widget.setStack(stack)
      this.screen.render()
    }
  }

}

module.exports = myWidget
