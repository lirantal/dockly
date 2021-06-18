'use strict'

const ListWidget = require('../../src/widgetsTemplates/list.widget.template')

class myWidget extends ListWidget {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super({ blessed, contrib, screen, grid })
    this.servicesListData = []
  }

  getLabel () {
    return 'Services'
  }

  getItemLogs (serviceId, cb) {
    return this.utilsRepo.get('docker').getServiceLogs(serviceId, cb)
  }

  updateItemLogs (str) {
    return this.widgetsRepo.get('servicesLogs').update(str)
  }

  clearItemLogs () {
    return this.widgetsRepo.get('servicesLogs').clear()
  }

  getListItems (cb) {
    this.utilsRepo.get('docker').listServices(cb)
  }

  filterList (data) {
    let filteredContainersList = this.servicesListData[0]
    let serviceList = this.servicesListData.slice(1)
    let filteredServices = []

    if (data) {
      filteredServices = serviceList.filter((service) => {
        const serviceName = service[1]
        const serviceImageName = service[2]

        if ((serviceName.indexOf(data) !== -1) || (serviceImageName.indexOf(data) !== -1)) {
          return true
        }
      })
    }

    if (filteredServices.length > 0) {
      filteredServices.unshift(filteredContainersList)
      this.update(filteredServices)
    } else {
      this.update(this.servicesListData)
    }
  }

  formatList (services) {
    const list = []

    if (services) {
      services.forEach((service) => {
        const replicas = service.Spec.Mode.Replicated ? '' + service.Spec.Mode.Replicated.Replicas : '0'
        list.push([
          service.ID.substring(0, 5),
          service.Spec.Name.substring(0, 25),
          service.Spec.TaskTemplate.ContainerSpec.Image.substring(0, 25),
          replicas])
      })
    }

    list.unshift(['Id', 'Name', 'Image', 'Replicas'])

    this.servicesListData = list

    return list
  }

  /**
   * returns a selected service from the services listbox
   * @return {string} service id
   */
  getSelectedService () {
    return this.widget.getItem(this.widget.selected).getContent().toString().trim().split(' ').shift()
  }
}

module.exports = myWidget
