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

    this.widget.on('keypress', (ch, key) => {
      if (key.name === 'escape') {
        this.widget.destroy()
      }
    })

    const dockerHook = this.widgetsRepo.dockerHook
    dockerHook.on('loaderStart', (data) => {
      return this.update(data)
    })

    dockerHook.on('loaderEnd', (data) => {
      return this.update(data)
    })
  }

  getWidget() {
    return this.blessed.box({
      label: 'Status',
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      vi: true,
      tags: true,
      style: {
        selected: {
          bg: 'green'
        }
      },
      border: {
        type: 'line'
      },
      hover: {
        bg: 'blue'
      },
      scrollbar: {
        fg: 'blue',
        ch: '|'
      },
      width: '60%',
      height: '20%',
      top: 'center',
      left: 'center',
      align: 'left',
      content: ''
    })
  }

  renderWidget() {
    return null
  }

  update(data) {

    this.screen.append(this.widget)

    if (data && data.label) {
      this.widget.setLabel(data.label)
    }

    if (data && data.message) {
      this.widget.setContent(data.message)
    }

    this.screen.render()
    this.widget.focus()
  }

}

module.exports = myWidget