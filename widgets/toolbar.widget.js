'use strict'

const EventEmitter = require('events')
const baseWidget = require('../src/baseWidget')

class myWidget extends baseWidget(EventEmitter) {
  constructor ({blessed = {}, contrib = {}, screen = {}, grid = {}, mode}) {
    super()
    this.createWidget = this.createWidget.bind(this)
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid
    this.mode = mode

    this.label = ''
    this.widget = this.createWidget()
  }

  init () {
    return null
  }

  getWidget () {
    return this.widget
  }

  createWidget () {
    const baseCommands = {
      'refresh': {
        keys: ['='],
        callback: () => { this.emit('key', '=') }
      },
      'info': {
        keys: ['i'],
        callback: () => { this.emit('key', 'i') }
      },
      'logs': {
        keys: ['[RETURN]'],
        callback: () => { this.emit('key', '[RETURN]') }
      }
    }

    const containerCommands = {
      'shell': {
        keys: ['l'],
        callback: () => { this.emit('key', 'l') }
      },
      'restart': {
        keys: ['r'],
        callback: () => { this.emit('key', 'r') }
      },
      'stop': {
        keys: ['s'],
        callback: () => { this.emit('key', 's') }
      },
      'view mode': {
        keys: ['v'],
        callback: () => { this.emit('key', 't') }
      },
      'menu': {
        keys: ['m'],
        callback: () => { this.emit('key', 'm') }
      }
    }

    const commands = this.mode === 'containers' ? Object.assign({}, baseCommands, containerCommands) : baseCommands

    return this.grid.gridObj.set(...this.grid.gridLayout, this.blessed.listbar, {
      keys: false,
      mouse: true,
      style: {
        bg: 'green',
        item: {
          bg: 'black',
          hover: {
            bg: 'blue'
          },
          focus: {
            bg: 'blue'
          }
        },
        selected: {
          bg: 'blue'
        }
      },
      autoCommandKeys: false,
      commands: {
        ...commands,
        'quit': {
          keys: ['q'],
          callback: () => { this.emit('key', 'q') }
        }
      }
    })
  }
}

module.exports = myWidget
