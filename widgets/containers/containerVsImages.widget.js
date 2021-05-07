'use strict'
const baseWidget = require('../../src/baseWidget')

class myWidget extends baseWidget() {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.label = 'Containers vs Images'
    this.widget = this.getWidget()
  }

  init () {
    if (!this.widgetsRepo.has('containers')) {
      return null
    }

    const dockerHook = this.widgetsRepo.get('containers')
    dockerHook.on('containersAndImagesList', (data) => {
      return this.update({
        containers: data && data.containers ? data.containers.length : 0,
        images: data && data.images ? data.images.length : 0
      })
    })
  }

  getWidget () {
    return this.grid.gridObj.set(...this.grid.gridLayout, this.contrib.bar, {
      label: this.label,
      style: this.getWidgetStyle(),
      border: {
        type: 'line',
        fg: '#00ff00'
      },
      hover: {
        bg: 'blue'
      },
      barWidth: 6,
      barSpacing: 15,
      xOffset: 3,
      maxHeight: 15,
      labelColor: this.getWidgetStyle().fg
    })
  }

  update (data) {
    this.widget.setData({
      titles: ['Containers', 'Images'],
      data: [
        data.containers,
        data.images
      ]
    })

    this.screen.render()
  }
}

module.exports = myWidget
