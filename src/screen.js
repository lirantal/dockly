'use strict'

const path = require('path')
const blessed = require('blessed')
const contrib = require('blessed-contrib')
const assetsLoader = require(path.resolve('./src/assetsLoader'))

class screen {
  constructor(utils = new Map()) {
    this.screen = undefined
    this.title = 'Dockly'

    this.utils = utils

    // toggle widgets focus
    this.toggleWidgetFocus = true

    this.widgetsRepository = new Map()
    this.hooks = new Map()
    this.widgets = new Map()
  }

  initScreen() {
    this.screen = blessed.screen({
      title: this.title,
      fullUnicode: true,
      dockBorders: true
    })
  }

  init() {
    this.assets = assetsLoader.load()
    this.initScreen()
    this.initHooks()
    this.initWidgets()

    this.renderWidgets()
    this.setWidgetsRepo()
    this.setWidgetsUtils()

    this.setWidgetsInit()



    // console.log(this.widgetsRepository)
    // 1. get all widgets and instantiate them
    //



    this.registerEvents()
    this.render()
  }


  initHooks() {
    for (let [hookName, hookObject] of this.assets.get('hooks').entries()) {
      let hook = new hookObject()
      this.hooks.set(hookName, hook)
      this.widgetsRepository.set(hookName, hook)
    }
  }

  initWidgets() {
    for (let [widgetName, widgetObject] of this.assets.get('widgets').entries()) {
      let widget = new widgetObject({
        blessed,
        contrib,
        screen: this.screen
      })

      this.widgets.set(widgetName, widget)
      this.widgetsRepository.set(widgetName, widget)
    }
  }

  setWidgetsRepo() {
    for (let widgetObject of this.widgetsRepository.values()) {
      widgetObject.setWidgetsRepo(this.widgetsRepository)
    }
  }

  setWidgetsUtils() {
    for (let widgetObject of this.widgetsRepository.values()) {
      widgetObject.setUtilsRepo(this.utils)
    }
  }

  setWidgetsInit() {
    for (let widgetObject of this.widgetsRepository.values()) {
      widgetObject.init()
    }
  }

  renderWidgets() {
    for (let widgetObject of this.widgets.values()) {
      widgetObject.renderWidget()
    }
  }

  registerEvents() {
    this.screen.on('keypress', (ch, key) => {
      if (key.name === 'tab') {
        this.toggleWidgetFocus ? widgetContainerLogsObj.focus() : widgetContainerListObj.focus()
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
  }

  render() {
    this.screen.render()
  }

  teardown() {
    this.screen.destroy()
  }
}

module.exports = screen

