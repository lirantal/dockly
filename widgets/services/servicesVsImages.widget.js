'use strict'
const baseWidget = require('../../src/baseWidget')

class myWidget extends baseWidget() {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.label = 'Services vs Images'
    this.widget = this.getWidget()
  }

  init () {
    if (!this.widgetsRepo.has('services')) {
      return null
    }

    const dockerHook = this.widgetsRepo.get('services')
    dockerHook.on('servicesAndImagesList', (data) => {
      return this.update({
        services: data && data.services ? data.services.length : 0,
        images: data && data.images ? data.images.length : 0
      })
    })
  }

  getWidget () {
    return this.grid.gridObj.set(...this.grid.gridLayout, this.contrib.bar, {
      label: this.label,
      style: this.getWidgetStyle({ fg: 'blue' }),
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
      maxHeight: 15
    })
  }

  update (data) {
    this.widget.setData({
      titles: ['Services', 'Images'],
      data: [
        data.services,
        data.images
      ]
    })

    this.screen.render()
  }
}

module.exports = myWidget
