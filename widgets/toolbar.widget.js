'use strict'

const EventEmitter = require('events')
const baseWidget = require('../src/baseWidget')

class myWidget extends baseWidget(EventEmitter) {
  constructor ({blessed = {}, contrib = {}, screen = {}, grid = {}}) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.widget = this.createWidget()
  }

  init () {
    return null
  }

  getWidget () {
    return this.widget
  }

  createWidget () {
    return this.grid.gridObj.set(...this.grid.gridLayout, this.blessed.listbar, {
      keys: false,
      vi: true,
      mouse: true,
      style: {
        bg: 'green'
      },
      height: 'shrink',
      bottom: '0',
      left: '0',
      right: '0',
      autoCommandKeys: false,
      commands: {
        'refresh': {
          keys: ['='],
          callback: () => { this.emit('key', '=') }
        },
        'info': {
          keys: ['i'],
          callback: () => { this.emit('key', 'i') }
        },
        // 'host info': {
        //   keys: ['0'],
        //   callback: () => { this.emit('key', '0') }
        // },
        'shell': {
          keys: ['l'],
          callback: () => { this.emit('key', 'l') }
        },
        'logs': {
          keys: ['[RETURN]'],
          callback: () => { this.emit('key', '[RETURN]') }
        },
        'restart': {
          keys: ['r'],
          callback: () => { this.emit('key', 'r') }
        },
        'stop': {
          keys: ['s'],
          callback: () => { this.emit('key', 's') }
        },
        'menu': {
          keys: ['m'],
          callback: () => { this.emit('key', 'm') }
        },
        'quit': {
          keys: ['q'],
          callback: () => { this.emit('key', 'q') }
        },

      }
    })

    return widget
  }
}

module.exports = myWidget
