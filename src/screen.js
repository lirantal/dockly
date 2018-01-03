'use strict'

const path = require('path')
const blessed = require('blessed')
const contrib = require('blessed-contrib')
const assetsLoader = require(path.join(__dirname, '/assetsLoader'))

const MODES = {
  container: 'containers',
  service: 'services'
}

// @TODO should be moved outside and used as a config
// from the user (index.js)
const CONTAINERS_GRID_LAYOUT = {
  'actionsMenu': [4, 4, 4, 4],
  'actionStatus': [6, 0, 1, 10],
  'containerInfo': [2, 2, 8, 8],
  'containerList': [0, 0, 6, 10],
  'containerLogs': [7, 0, 4, 12],
  'containerStatus': [0, 10, 2, 2],
  'containerUtilization': [2, 10, 3, 2],
  'containerVsImages': [5, 10, 2, 2],
  'toolbar': [11, 0, 1, 12]
}

const SERVICES_GRID_LAYOUT = {
  'actionsMenu': [4, 4, 4, 4],
  'actionStatus': [6, 0, 1, 10],
  'servicesInfo': [2, 2, 8, 8],
  'servicesList': [0, 0, 6, 10],
  'servicesLogs': [7, 0, 4, 12],
  'servicesStatus': [0, 10, 2, 2],
  'servicesVsImages': [2, 10, 2, 2],
  'toolbar': [11, 0, 1, 12]
}

class screen {
  constructor (utils = new Map()) {
    this.mode = MODES.container
    this.screen = undefined
    this.grid = undefined
    this.title = 'Dockly'

    this.utils = utils

    // toggle widgets focus
    this.toggleWidgetFocus = true

    this.widgetsRepository = new Map()
    this.hooks = new Map()
    this.widgets = new Map()
  }

  initScreen () {
    this.screen = blessed.screen({
      title: this.title,
      fullUnicode: true,
      dockBorders: true,
      smartCSR: true
    })

    // initialize 12x12 grid
    // eslint-disable-next-line new-cap
    this.grid = new contrib.grid({rows: 12, cols: 12, hideBorder: true, screen: this.screen})
  }

  init () {
    // load all hooks and widgets
    this.assets = assetsLoader.load()

    // initialize screen, and create the hooks and widgets repository
    this.initScreen()
    this.initHooks()
    this.initWidgets()

    // render the widgets and populate their information of available
    // widgets and utilities
    this.renderWidgets()
    this.setWidgetsRepo()
    this.setWidgetsUtils()

    // initialize all widgets
    this.setWidgetsInit()

    // register global screen events and render
    this.registerEvents()
    this.render()
  }

  initHooks () {
    for (let [hookName, HookObject] of this.assets.get('hooks').entries()) {
      let hook = new HookObject()
      this.hooks.set(hookName, hook)
      this.widgetsRepository.set(hookName, hook)
    }
  }

  clearHooks () {
    for (let [hookName] of this.assets.get('hooks').entries()) {
      this.hooks.delete(hookName)
      this.widgetsRepository.delete(hookName)
    }
  }

  initWidgets () {
    const layout = this.mode === MODES.container ? CONTAINERS_GRID_LAYOUT : SERVICES_GRID_LAYOUT
    for (let [widgetName, WidgetObject] of this.assets.get('widgets').entries()) {
      if (layout[widgetName]) {
        let widget = new WidgetObject({
          blessed,
          contrib,
          mode: this.mode,
          screen: this.screen,
          grid: {
            gridObj: this.grid,
            gridLayout: layout[widgetName]
          }
        })

        this.widgets.set(widgetName, widget)
        this.widgetsRepository.set(widgetName, widget)
      }
    }
  }

  setWidgetsRepo () {
    for (let widgetObject of this.widgetsRepository.values()) {
      widgetObject.setWidgetsRepo(this.widgetsRepository)
    }
  }

  setWidgetsUtils () {
    for (let widgetObject of this.widgetsRepository.values()) {
      widgetObject.setUtilsRepo(this.utils)
    }
  }

  setWidgetsInit () {
    for (let widgetObject of this.widgetsRepository.values()) {
      widgetObject.init()
    }
  }

  renderWidgets () {
    for (let widgetObject of this.widgets.values()) {
      widgetObject.renderWidget()
    }
  }

  toggleMode () {
    if (this.mode === MODES.container) {
      this.mode = MODES.service
    } else {
      this.mode = MODES.container
    }
  }

  registerEvents () {
    this.screen.on('keypress', (ch, key) => {
      if (key.name === 'tab') {
        this.toggleWidgetFocus ? this.widgetsRepository.get('containerLogs').focus() : this.widgetsRepository.get('containerList').focus()
        this.toggleWidgetFocus = !this.toggleWidgetFocus
        this.screen.render()
      }
    })

    this.screen.on('element focus', (curr, old) => {
      if (old.border) {
        old.style.border.fg = 'default'
      }

      if (curr.border) {
        curr.style.border.fg = 'green'
      }

      this.screen.render()
    })

    this.screen.key('q', () => {
      this.screen.destroy()
      return process.exit(0)
    })

    this.screen.key('v', () => {
      this.clearHooks()
      this.toggleMode()
      this.screen.destroy()
      this.init()
    })
  }

  render () {
    // var grid = new contrib.grid({rows: 12, cols: 12, screen: this.screen})

    // grid.set(row, col, rowSpan, colSpan, obj, opts)
    // var map = grid.set(0, 0, 4, 4, this.widgetsRepository.get('containerInfo').widget)
    // var box = grid.set(4, 4, 4, 4, blessed.box, {content: 'My Box'})

    // console.log(this.widgetsRepository.get('containerInfo').widget)

    this.screen.render()
  }

  teardown () {
    this.screen.destroy()
  }
}

module.exports = screen
