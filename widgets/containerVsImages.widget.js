'use strict'

class myWidget {
  constructor({blessed = {}, contrib = {}, screen = {}}) {
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen

    this.widget = this.getWidget()
  }

  setWidgetsRepo(widgets = new Map()) {
    this.widgetsRepo = widgets
  }

  setUtilsRepo(utils = new Map) {
    this.utilsRepo = utils
  }

  init() {
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

  getWidget() {
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

  renderWidget() {
    return this.screen.append(this.widget)
  }

  update(data) {
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
