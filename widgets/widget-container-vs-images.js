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
    dockerHook.on('containersAndImagesList', (data) => {
      return this.update({
        containers: data.containers.length,
        images: data.images.length
      })
    })
  }

  getWidget() {
    return this.blessed.bar({
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
