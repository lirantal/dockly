
const baseWidget = require('../baseWidget')
const EventEmitter = require('events')
const clipboardy = require('clipboardy')

class myWidget extends baseWidget(EventEmitter) {
  copyItemIdToClipboard () {
    const itemId = this.getSelectedItem()
    if (!itemId) {
      return
    }

    let message
    try {
      clipboardy.writeSync(itemId)

      message = `Container Id ${itemId} was copied to the clipboard`
    } catch (error) {
      message = error
    } finally {
      const actionStatus = this.widgetsRepo.get('actionStatus')

      actionStatus.emit('message', {
        message: message
      })
    }
  }

  getSelectedItem () {
    throw new Error('method getSelectedItem not implemented')
  }
}

module.exports = myWidget
