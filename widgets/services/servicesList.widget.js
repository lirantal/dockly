'use strict'

const ListWidget = require('../../src/widgetsTemplates/list.widget.template')

class myWidget extends ListWidget {
  getLabel () {
    return 'Services'
  }

  getItemLogs (serviceId, cb) {
    return this.utilsRepo.get('docker').getServiceLogs(serviceId, cb)
  }

  updateItemLogs (str) {
    return this.widgetsRepo.get('servicesLogs').update(str)
  }

  getListItems (cb) {
    this.utilsRepo.get('docker').listServices(cb)
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
