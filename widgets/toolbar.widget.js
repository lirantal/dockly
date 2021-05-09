'use strict'

const EventEmitter = require('events')
const baseWidget = require('../src/baseWidget')

class myWidget extends baseWidget(EventEmitter) {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {}, mode }) {
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
        keys: ['space'], // refresh key
        callback: () => { this.emit('key', 'space') } // key space
      },
      'info': {
        keys: ['i'],
        callback: () => { this.emit('key', 'i') }
      },
      'logs': {
        keys: ['[RETURN]'],
        callback: () => { this.emit('key', '[RETURN]') }
      },
      'expand logs': {
        keys: ['-'],
        callback: () => { this.emit('key', '-') }
      },
      'copy container id': {
        keys: ['c'],
        callback: () => { this.emit('key', 'c') }
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
      'menu': {
        keys: ['m'],
        callback: () => { this.emit('key', 'm') }
      },
      'search': {
        keys: ['/'],
        callback: () => { this.emit('key', '/') }
      }
    }

    const imageCommands = {
      'Remove': {
        keys: ['r'],
        callback: () => { this.emit('key', 'r') }
      }
    }

    const commandExtension = {
      containers: containerCommands,
      services: {},
      images: imageCommands
    }

    const commands = Object.assign({}, baseCommands, commandExtension[this.mode])

    return this.grid.gridObj.set(...this.grid.gridLayout, this.blessed.listbar, {
      keys: false,
      mouse: true,
      style: {
        prefix: {
          fg: 'yellow'
        },
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
      commands:
        Object.assign(
          {},
          commands,
          {
            'help': {
              keys: ['h'],
              callback: () => { this.emit('key', 'h') }
            },
            'view mode': {
              keys: ['v'],
              callback: () => { this.emit('key', 't') }
            },
            'quit': {
              keys: ['q'],
              callback: () => { this.emit('key', 'q') }
            }
          })
    })
  }
}

module.exports = myWidget
