'use strict'

const path = require('path')
const blessed = require('blessed')
const contrib = require('blessed-contrib')
const assetsLoader = require(__dirname + '/assetsLoader')

class screen {
  constructor (utils = new Map()) {
    this.screen = undefined
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
      dockBorders: true
    })
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

  initWidgets () {
    for (let [widgetName, WidgetObject] of this.assets.get('widgets').entries()) {
      let widget = new WidgetObject({
        blessed,
        contrib,
        screen: this.screen
      })

      this.widgets.set(widgetName, widget)
      this.widgetsRepository.set(widgetName, widget)
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
  }

  render () {
    this.screen.render()
  }

  teardown () {
    this.screen.destroy()
  }
}

module.exports = screen
