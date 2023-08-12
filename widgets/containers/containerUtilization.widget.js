'use strict'
const baseWidget = require('../../src/baseWidget')

class myWidget extends baseWidget() {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.label = 'Containers Utilization (%)'
    this.widget = this.getWidget()
  }

  init () {
    if (!this.widgetsRepo.has('containers')) {
      return null
    }

    const dockerHook = this.widgetsRepo.get('containers')
    dockerHook.on('containerUtilization', (data) => {
      return this.update(data)
    })
  }

  getWidget () {
    return this.grid.gridObj.set(...this.grid.gridLayout, this.contrib.bar, {
      label: this.label,
      style: this.getWidgetStyle({ fg: 'blue' }),
      border: {
        type: 'line',
        fg: '#00ff00'
      },
      barBgColor: 'cyan',
      barFgColor: 'white',
      barWidth: 6,
      barSpacing: 15,
      xOffset: 3,
      maxHeight: 15,
      labelColor: this.getWidgetStyle().fg
    })
  }

  update (data) {
    if (!data || (typeof data !== 'object')) {
      return
    }

    if (!data.cpu_stats || !data.precpu_stats || !data.cpu_stats.cpu_usage ||
      !data.precpu_stats.cpu_usage || !data.cpu_stats.cpu_usage.total_usage ||
      !data.precpu_stats.cpu_usage.total_usage ||
      !data.cpu_stats.system_cpu_usage || !data.precpu_stats.system_cpu_usage) {
      return this.widget.setData({
        titles: ['CPU', 'Memory'],
        data: [
          0,
          0
        ]
      })
    }

    // Calculate CPU usage based on delta from previous measurement
    let cpuUsageDelta = data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage
    let systemUsageDelta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage
    let cpuCoresAvail = data.cpu_stats.online_cpus ? data.cpu_stats.online_cpus : 1

    let cpuUsagePercent = 0
    if (systemUsageDelta > 0) {
      cpuUsagePercent = (cpuUsageDelta / systemUsageDelta) * cpuCoresAvail * 100
    }

    // Calculate Memory usage
    let memUsage = data.memory_stats.usage
    let memAvail = data.memory_stats.limit

    let memUsagePercent = 0
    if ((memUsage !== undefined && memAvail !== undefined) && memAvail !== 0) {
      memUsagePercent = memUsage / memAvail * 100
    }

    this.widget.setData({
      titles: ['CPU', 'Memory'],
      data: [
        Math.round(Number(cpuUsagePercent)),
        Math.round(Number(memUsagePercent))
      ]
    })

    this.screen.render()
  }
}

module.exports = myWidget
