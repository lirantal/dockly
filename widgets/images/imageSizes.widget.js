'use strict'
const baseWidget = require('../../src/baseWidget')

class myWidget extends baseWidget() {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.label = 'In Use / Unused'
    this.widget = this.getWidget()
  }

  init () {
    if (!this.widgetsRepo.has('images')) {
      return null
    }

    const dockerHook = this.widgetsRepo.get('images')
    dockerHook.on('imageSize', (data) => {
      let useImagesSize = 0
      let unuseImagesSize = 0

      data.UseImages.forEach(image => { useImagesSize += image.Size })
      data.UnuseImages.forEach(image => { unuseImagesSize += image.Size })
      return this.update({
        inUse: useImagesSize,
        unused: unuseImagesSize
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
    const inUseTitle = this.widgetsRepo.get('imageList').formatBytes(data.inUse)
    const unuseTitle = this.widgetsRepo.get('imageList').formatBytes(data.unused)

    let inUse = 1; let unuse = 1

    if (data.inUse > data.unused) {
      inUse = parseInt(data.inUse / data.unused)
      unuse = data.inUse % data.unused
    }

    if (data.inUse < data.unused) {
      unuse = parseInt(data.unused / data.inUse)
      inUse = data.unused % data.inUse
    }

    this.widget.setData({
      titles: [inUseTitle, unuseTitle],
      data: [
        inUse,
        unuse
      ]
    })

    this.screen.render()
  }
}

module.exports = myWidget
