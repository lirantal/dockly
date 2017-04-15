'use strict'
const baseWidget = require('../src/baseWidget')

class myWidget extends baseWidget() {
  constructor ({blessed = {}, contrib = {}, screen = {}}) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen

    this.widget = this.getWidget()
  }

  init () {
    if (!this.widgetsRepo.has('containers')) {
      return null
    }

    const dockerHook = this.widgetsRepo.get('containers')
    dockerHook.on('containersAndImagesList', (data) => {
      return this.update({
        containers: data.containers.length,
        images: data.images.length
      })
    })
  }

  getWidget () {
    return this.contrib.bar({
      label: 'Containers vs Images',
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
      barWidth: 6,
      barSpacing: 15,
      xOffset: 3,
      maxHeight: 15,
      width: '20%',
      height: '17%',
      top: '38%',
      left: '80%'
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
