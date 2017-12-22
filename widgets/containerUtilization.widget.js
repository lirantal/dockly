'use strict'
const baseWidget = require('../src/baseWidget')

class myWidget extends baseWidget() {
  constructor ({blessed = {}, contrib = {}, screen = {}, grid = {}}) {
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
      style: {
        fg: 'blue',
        bg: 'default',
        border: {
          fg: 'default',
          bg: 'default'
        },
        selected: {
          bg: 'green'
        }
      },
      border: {
        type: 'line',
        fg: '#00ff00'
      },
      barBgColor: 'cyan',
      barFgColor: 'white',
      barWidth: 6,
      barSpacing: 15,
      xOffset: 3,
      maxHeight: 15
    })
  }

  update (data) {
    if (!data || (typeof data !== 'object')) {
      return
    }

    if (!data.cpu_stats || !data.precpu_stats || !data.cpu_stats.cpu_usage ||
      !data.precpu_stats.cpu_usage || !data.cpu_stats.cpu_usage.total_usage ||
      !data.precpu_stats.cpu_usage.total_usage ||
      !data.cpu_stats.system_cpu_usage || !data.precpu_stats.system_cpu_usage ||
      !data.cpu_stats.cpu_usage.percpu_usage) {
      return this.widget.setData({
        titles: ['CPU', 'Memory'],
        data: [
          0,
          0
        ]
      })
    }

    // Calculate CPU usage based on delta from previous measurement
    var cpuUsageDelta = data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage
    var systemUsageDelta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage
    var cpuCoresAvail = data.cpu_stats.cpu_usage.percpu_usage ? data.cpu_stats.cpu_usage.percpu_usage.length : 0

    var cpuUsagePercent = 0
    if (systemUsageDelta !== 0 || cpuCoresAvail !== 0) {
      var totalUsage = systemUsageDelta * cpuCoresAvail * 100
      cpuUsagePercent = 0
      if (totalUsage && totalUsage !== 0) {
        cpuUsagePercent = cpuUsageDelta / totalUsage
      }
    }

    // Calculate Memory usage
    var memUsage = data.memory_stats.usage
    var memAvail = data.memory_stats.limit

    var memUsagePercent = 0
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
