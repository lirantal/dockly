'use strict'

const baseWidget = require('../../src/baseWidget')

class myWidget extends baseWidget() {
  constructor({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.label = 'Image Utilization'
    this.color = {
      'ImageInUse': 'green',
      'ImageNotInUse': 'red'
    }

    this.widget = this.getWidget()
  }

  init() {
    if (!this.widgetsRepo.has('images')) {
      return null
    }

    const dockerHook = this.widgetsRepo.get('images')
    dockerHook.on('imagesUtilization', (data) => {
      return this.update(data)
    })
  }

  getWidget() {
    return this.grid.gridObj.set(...this.grid.gridLayout, this.contrib.gauge, {
      label: this.label,
      style: this.getWidgetStyle({ fg: 'blue' }),
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

  update(data) {
    if (!data || (typeof data !== 'object')) {
      return
    }

    if (!data.Images) {
      return
    }

    const UseImages = []
    const UnuseImages = []

    data.Images.forEach(image => {
      if (image.Containers > 0) {
        UseImages.push(image)
      } else {
        UnuseImages.push(image)
      }
    })

    const stack = []

    if (UseImages !== 0) {
      stack.push({
        percent: Math.round((UseImages.length / data.Images.length) * 100),
        stroke: this.color['ImageInUse']
      })
    }

    if (UnuseImages !== 0) {
      stack.push({
        percent: Math.round((UnuseImages.length / data.Images.length) * 100),
        stroke: this.color['ImageNotInUse']
      })
    }

    this.widget.setStack(stack)
    this.screen.render()
  }
}

module.exports = myWidget
