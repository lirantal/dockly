'use strict'

const chalk = require('chalk')
const figures = require('figures')

const ListWidget = require('../../src/widgetsTemplates/list.widget.template')

const ContainerState = require('../../src/enum.js').ContainerState

class myWidget extends ListWidget {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super({ blessed, contrib, screen, grid })
    this.containersList = {}
    this.containersListData = []
    this.sortBy = ContainerState.running
  }

  getLabel () {
    return 'Containers'
  }

  getItemLogs (containerId, cb) {
    if (this.widgetsRepo.has('containerLogs')) {
      return this.utilsRepo.get('docker').getContainerLogs(containerId, cb)
    }
  }

  updateItemLogs (str) {
    if (this.widgetsRepo.has('containerLogs')) {
      return this.widgetsRepo.get('containerLogs').update(str)
    }
  }

  clearItemLogs () {
    if (this.widgetsRepo.has('containerLogs')) {
      return this.widgetsRepo.get('containerLogs').clear()
    }
  }

  getListItems (cb) {
    this.utilsRepo.get('docker').listContainers(cb)
  }

  filterList (data) {
    let filteredContainersList = this.containersListData[0]
    let containersList = this.containersListData.slice(1)
    let filteredContainers = []
    const headerRow = this.containersListData[0]
    if (data) {
      filteredContainers = containersList.filter((container, index, containerItems) => {
        const containerName = container[1]
        const containerImageName = container[2]

        if ((containerName.indexOf(data) !== -1) || (containerImageName.indexOf(data) !== -1)) {
          return true
        }
      })
    }
    // Render filtered services if available; otherwise, it means either the user hasn't provided input or no matches were found.
    if (filteredContainers.length > 0) {
      filteredContainers.unshift(filteredContainersList)
      this.update(filteredContainers)
    } else {
      if (data.length > 0) {
        this.update([
          headerRow,
          ['', 'No containers found matching: ' + data, '', '', '', '', '']
        ])
      } else {
        this.update(this.containersListData)
      }
    }
  }

  sortContainersByState (state) {
    this.sortBy = state
    this.refreshList()
  }

  // TODO refactor this
  formatList (containers) {
    const containerList = {}
    if (containers) {
      containers.forEach((container) => {
        let containerPortPublic = (container.Ports && container.Ports[0] && container.Ports[0].PublicPort) ? String(container.Ports[0].PublicPort) : ''
        let containerPortPrivate = (container.Ports && container.Ports[0] && container.Ports[0].PrivatePort) ? String(container.Ports[0].PrivatePort) : ''
        let containerPort = containerPortPrivate + ':' + containerPortPublic

        containerList[container.Id] = [
          container.Id.substring(0, 5),
          container.Names[0].substring(0, 40),
          container.Image.substring(0, 35),
          // remove any new lines or carriage return line feed from the string in container.Command
          container.Command.substring(0, 30).replace(/(\r\n|\n|\r)/gm, ''),
          container.State,
          container.Status,
          containerPort
        ]
      })
    }

    let list = []
    list = Object.keys(containerList).map((key) => {
      let container = []

      container = containerList[key]
      const status = container[4]
      container[4] = this.formatContainerState(container[4])
      container[5] = this.formatContainerStatus(container[5])
      container[7] = status

      return container
    })

    list.sort(this.sortContainers(this.sortBy))
    list = list.map(a => {
      a.pop()
      return a
    })
    list.unshift(['Id', 'Name', 'Image', 'Command', 'State', 'Status', 'Ports'])
    this.containersListData = list
    this.containersList = containerList

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

  sortContainers (state) {
    return (a, b) => {
      if (a[7] === state && b[7] !== state) {
        return -1
      }

      if (b[7] === state && a[7] !== state) {
        return 1
      }
      return 0
    }
  }
}

module.exports = myWidget
