'use strict'

const util = require('util')

class myWidget {
  constructor (blessed = {}, screen = {}) {
    this.blessed = blessed
    this.screen = screen

    this.widget = this.getWidget()

    this.screen.append(this.widget)
    this.screen.remove(this.widget)

    // variable to act as a toggle switch to hide/show the container
    this.toggleWidgetDockerInfo = 0
  }

  setWidgetsRepo (widgets = {}) {
    this.widgetsRepo = widgets
  }

  setUtilsRepo (utils = {}) {
    this.utilsRepo = utils
  }

  init () {
    this.screen.remove(this.widget)

    if (!this.widgetsRepo.widgetToolBar) {
      return null
    }

    this.widget.on('keypress', (ch, key) => {
      if (key.name === 'escape') {
        this.screen.remove(this.widget)
        this.screen.render()
      }
    })

    const toolbar = this.widgetsRepo.widgetToolBar
    toolbar.on('key', (keyString) => {
      // on info keypress i
      if (keyString === '0') {
        // show the widget and focus on it,
        // widget showing a 'loading...' state

        // then show the information on the container
        this.utilsRepo.docker.getInfo((data) => {
          this.update(data)
          this.screen.append(this.widget)
          this.screen.render()
        })
      }
    })
  }

  getWidget () {
    return this.blessed.table({
      keys: true,
      fg: 'white',
      selectedFg: 'white',
      selectedBg: 'blue',
      interactive: false,
      label: 'Docker Host Info',
      width: '20%',
      height: '25%',
      top: '0',
      left: '80%',
      border: {type: 'line', fg: 'default'},
      columnWidth: [12, 15]
    })
  }

  renderWidget () {
    return null
  }

  update (data) {
    if (!data || Object.keys(data).length === 0) {
      return null
    }

    return this.widget.setData({
      headers: ['Data', 'Metric'],
      data: [
        ['Host', data.Host],
        ['OS', data.OperatingSystem],
        ['Arch', data.Architecture],
        ['Host Version', data.ServerVersion],
        ['Host API Version', data.ApiVersion],
        ['Memory', data.MemTotal.toString()]
      ]
    })
  }
}

module.exports = myWidget
