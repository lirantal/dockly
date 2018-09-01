'use strict'

const chalk = require('chalk')
const figures = require('figures')

const ListWidget = require('../../src/widgetsTemplates/list.widget.template')

class myWidget extends ListWidget {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super({ blessed, contrib, screen, grid })
    this.containersList = {}
    this.containersListData = []
  }

  getLabel () {
    return 'Containers'
  }

  getItemLogs (containerId, cb) {
    return this.utilsRepo.get('docker').getContainerLogs(containerId, cb)
  }

  updateItemLogs (str) {
    return this.widgetsRepo.get('containerLogs').update(str)
  }

  getListItems (cb) {
    this.utilsRepo.get('docker').listContainers(cb)
  }

  filterList (data) {
    let filteredContainersList = this.containersListData[0]
    let containersList = this.containersListData.slice(1)
    let filteredContainers = []

    if (data) {
      filteredContainers = containersList.filter((container, index, containerItems) => {
        const containerName = container[1]
        const containerImageName = container[2]

        if ((containerName.indexOf(data) !== -1) || (containerImageName.indexOf(data) !== -1)) {
          return true
        }
      })
    }

    if (filteredContainers.length > 0) {
      filteredContainers.unshift(filteredContainersList)
      this.update(filteredContainers)
    } else {
      this.update(this.containersListData)
    }
  }

  formatList (containers) {
    if (containers) {
      containers.forEach((container) => {
        this.containersList[container.Id] = [
          container.Id.substring(0, 5),
          container.Names[0].substring(0, 40),
          container.Image.substring(0, 35),
          container.Command.substring(0, 30),
          container.State,
          container.Status
        ]
      })
    }

    let list = []
    list = Object.keys(this.containersList).map((key) => {
      let container = []

      container = this.containersList[key]
      container[4] = this.formatContainerState(container[4])
      container[5] = this.formatContainerStatus(container[5])

      return container
    })

    list.unshift(['Id', 'Name', 'Image', 'Command', 'State', 'Status'])
    this.containersListData = list

    return list
  }

  formatContainerStatus (status) {
    if (status.match(/^Up/)) {
      return status.replace(/Up/, figures.tick)
    }

    if (status.match(/^Exited \(\d+\)/)) {
      return status.replace(/^Exited \(\d+\)/, figures.cross)
    }

    return status
  }

  formatContainerState (state) {
    let stateFormatted = figures.square

    if (state === 'restarting') {
      return chalk.blue(stateFormatted)
    }

    if (state === 'running') {
      return chalk.green(stateFormatted)
    }

    if (state === 'paused') {
      return chalk.yellow(stateFormatted)
    }

    if (state === 'exited') {
      return chalk.gray(stateFormatted)
    }

    if (state === 'dead') {
      return chalk.red(stateFormatted)
    }

    return stateFormatted
  }

  /**
   * returns a selected container from the containers listbox
   * @return {string} container id
   */
  getSelectedContainer () {
    return this.widget.getItem(this.widget.selected).getContent().toString().trim().split(' ').shift()
  }

  /**
   * Sort containers by their state: running, created, then exited.
   *
   * @param item left
   * @param item right
   * @returns {number} for position
   */
  sortContainers (a, b) {
    if (a[4] === 'running' && b[4] !== 'running') {
      return -1
    }

    if (a[4] === 'paused' && b[4] !== 'paused') {
      return -1
    }

    if (a[4] === 'exited' && b[4] !== 'exited') {
      return 1
    }

    return 0
  }
}

module.exports = myWidget
