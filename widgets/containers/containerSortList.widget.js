const baseWidget = require('../../src/baseWidget')
const { ContainerState } = require('../../src/enum')

class ContainerSortListWidget extends baseWidget() {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid
    this.label = 'Sort By:'
    this.isVisible = false
    const sortedStates = Object.keys(ContainerState);
    sortedStates.sort((a, b) => a.length - b.length);
    this.items = sortedStates
      .map(state =>
        ({
          [`By ${state.charAt(0).toUpperCase()}${state.slice(1)}`]:
            {
              handler: () => this.sortContainerList(state)
            }
        })
      ).reduce((accum, obj) => ({...accum, ...obj}), {})

    this.widget = this.getWidget()
  }

  init () {
    if (!this.widgetsRepo.has('toolbar')) {
      return null
    }

    this.registerEscapeKey()
    this.registerSortHandler()
    this.registerToolbarKey()
  }

  sortContainerList (state) {
    const containerList = this.widgetsRepo.get('containerList')
    if (!containerList) {
      // TODO throw error!
      return
    }
    containerList.sortContainersByState(state)
  }

  registerSortHandler () {
    this.widget.on('select', (el) => {
      this.items[el.getText()].handler()
      this.toggleVisibility()
    })
  }

  registerToolbarKey () {
    const toolbar = this.widgetsRepo.get('toolbar')
    toolbar.on('key', (keyString) => {
      if (keyString === 'o') {
        this.toggleVisibility()
      }
    })
  }

  registerEscapeKey () {
    this.widget.on('keypress', (ch, key) => {
      if (key.name === 'escape' || key.name === 'return') {
        this.toggleVisibility()
      }
    })
  }

  toggleVisibility () {
    if (this.isVisible) {
      this.screen.remove(this.widget)
    } else {
      this.screen.append(this.widget)
      this.screen.render()
      this.widget.focus()
    }
    this.isVisible = !this.isVisible
  }

  getWidget () {
    return this.blessed.list({
      label: this.label,
      keys: true,
      align: 'center',
      border: {
        type: 'line'
      },
      left: 'center',
      top: 'center',
      width: '16%',
      height: '25%',
      style: this.getWidgetStyle(),
      items: Object.keys(this.items)
    })
  }

  renderWidget () {
  }
}

module.exports = ContainerSortListWidget
