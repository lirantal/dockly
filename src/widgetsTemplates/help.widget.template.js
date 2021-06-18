'use strict'

const baseWidget = require('../../src/baseWidget')

class myWidget extends baseWidget() {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid
    this.label = this.getLabel()

    this.widget = this.getWidget()

    this.toggleVisibility = 0
  }

  init () {
    if (!this.widgetsRepo.has('toolbar')) {
      return null
    }

    this.widget.on('keypress', (ch, key) => {
      if (key.name === 'escape' || key.name === 'return') {
        this.toggleVisibility = !this.toggleVisibility
        this.widget.destroy()
      }
    })

    const toolbar = this.widgetsRepo.get('toolbar')
    toolbar.on('key', (keyString) => {
      // on info keypress i
      if (keyString === 'h') {
        this.toggleVisibility = !this.toggleVisibility
        if (this.toggleVisibility) {
          // show the widget and focus on it,
          // widget showing a 'loading...' state
          this.screen.append(this.widget)
          this.update(this.getWidgetContents())
          this.screen.render()
          this.widget.focus()
        } else {
          this.screen.remove(this.widget)
        }
      }
    })
  }

  getSelectedItemId () {
    throw new Error('need to implement getSelectedItemId')
  }

  getItemById (itemId, cb) {
    throw new Error('need to implement getItemById')
  }

  getWidget () {
    // @TODO
    //    `return this.grid.gridObj.set(...this.grid.gridLayout, this.blessed.box, {`
    // removed the item popup information box from the grid because it would
    // have been expected to be drawn on the screen and take actual grid space
    // but instead its just a popup.
    // The @TODO is to create another kind of dashboard that will represent the
    // item info with its own grid and we can display/hide it on the screen
    // on toggle on and off
    return this.blessed.box({
      label: this.label,
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      style: this.getWidgetStyle(),
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
      align: 'left',
      width: '70%',
      height: '70%',
      top: 'center',
      left: 'center',
      content: 'Loading...'
    })
  }

  getWidgetContents () {
    return `
    __        _            _    _               
    \\ \\    __| | ___   ___| | _| |_   _         
     \\ \\  / _\` |/ _ \\ / __| |/ / | | | |        
     / / | (_| | (_) | (__|   <| | |_| |        
    /_/   \\__,_|\\___/ \\___|_|\\_\\_|\\__, |  _____ 
                                  |___/  |_____|
    
    Docker console UI and Dashboard for quick managing and inspecting of Containers and Images
    
    Available key commands:

    ▸ h:       Show/hide this window
    ▸ <space>: Refresh the current view
    ▸ /:       Search the current list view
    ▸ i:       Display information dialog about the selected container, service, or images
    ▸ ⏎:       Show the logs of the current container or service
    ▸ c:       Copy id to the clipboard
    ▸ v:       Toggle between Containers, Services, and images view
    ▸ q:       Quit dockly
    
    The following commands are only available in Container view:
    
    ▸ l:       Launch a /bin/bash session on the selected container
    ▸ r:       Restart the selected container
    ▸ s:       Stop the selected container
    ▸ m:       Show a menu with additional actions

    The following commands are only available in Image view:
    
    ▸ r:       Remove the selected image

    Thanks for using dockly!
    `
  }

  renderWidget () {
    return null
  }

  getLabel () {
    throw new Error('method getLabel not implemented')
  }

  update (data) {
    this.widget.setContent(data)
    this.screen.render()
  }
}

module.exports = myWidget
