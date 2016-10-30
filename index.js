'use strict';

/**
 * Required dependencies
 */
var blessed = require('blessed'),
  contrib = require('blessed-contrib'),
  fs = require('fs'),
  util = require('util');

/**
 * Project dependencies
 */
var docker = require('./src/dockerUtil'),
  widgets = require('./widgets');

var screen = blessed.screen({
  dump: __dirname + '/logs/dock.log',
  title: 'Dockly',
  smartCSR: true,
  fullUnicode: true
});

var widgetDockerInfo = widgets.dockerInfo(blessed, screen);
screen.append(widgetDockerInfo);

var widgetContainerUtilization = widgets.containerUtilization(contrib, screen);
screen.append(widgetContainerUtilization);

var widgetContainerStatus = widgets.containerStatus(contrib, screen);
screen.append(widgetContainerStatus);

var widgetContainerLogs = widgets.containerLogs(blessed, screen);
screen.append(widgetContainerLogs);

var widgetContainerList = widgets.containerList(blessed, screen);
screen.append(widgetContainerList);

var widgetContainerInfo = widgets.containerInfo(blessed, screen);

setInterval(function() {
  docker.getInfo(function(data) {

    widgetDockerInfo.setData([
      ['Host', data.Host],
      ['OS', data.OperatingSystem],
      ['Arch', data.Architecture],
      ['Host Version', data.ServerVersion],
      ['Host API Version', data.ApiVersion],
      ['Memory', data.MemTotal.toString()]
    ]);

    if (data.Containers !== 0) {

      var stack = [];
      if (data.ContainersRunning !== 0) {
        stack.push({
          percent: Math.round((data.ContainersRunning / data.Containers) * 100),
          stroke: 'green'
        });
      }

      if (data.ContainersPaused !== 0) {
        stack.push({
          percent: Math.round((data.ContainersPaused / data.Containers) * 100),
          stroke: 'yellow'
        });
      }

      if (data.ContainersStopped !== 0) {
        stack.push({
          percent: Math.round((data.ContainersStopped / data.Containers) * 100),
          stroke: 'red'
        });
      }

      widgetContainerStatus.setStack(stack);

    }

    screen.render();

  });
}, 1000);

screen.render();

docker.listContainers(function(data) {
  widgetContainerList.setData(data);
  widgetContainerList.select(0);
  screen.render();
  widgetContainerList.focus();
});

setInterval(function() {

  var containerId = widgetContainerList.getItem(widgetContainerList.selected).getContent().trim().split(' ').shift();
  docker.getContainerStats(containerId, function(data) {

    // Calculate CPU usage based on delta from previous measurement
    var cpuUsageDelta = data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage;
    var systemUsageDelta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
    var cpuCoresAvail = data.cpu_stats.cpu_usage.percpu_usage.length;
    var cpuUsagePercent = cpuUsageDelta / systemUsageDelta * cpuCoresAvail * 100;

    // Calculate Memory usage
    var memUsage = data.memory_stats.usage;
    var memAvail = data.memory_stats.limit;
    var memUsagePercent = memUsage / memAvail * 100;

    widgetContainerUtilization.setData([{
      percent: Math.round(cpuUsagePercent),
      label: 'cpu %',
      'color': 'magenta'
    }, {
      percent: Math.round(memUsagePercent),
      label: 'mem %',
      'color': 'cyan'
    }, ]);

    screen.render();

  });
}, 200);

widgetContainerList.on('select', function(item, idx) {

  // extract the first column out of the table row which is the container id
  var containerId = item.getContent().trim().split(' ').shift();

  screen.append(widgetContainerInfo);
  widgetContainerInfo.focus();

  docker.getContainer(containerId, function(err, data) {
    widgetContainerInfo.setContent(util.inspect(data));
    screen.render();
  });

  docker.getContainerLogs(containerId, function(err, stream) {
    if (stream && stream.pipe) {
      stream.on('data', function(chink) {
        widgetContainerLogs.add(chink.toString('utf-8').trim());
      });
    }
  });

})

widgetContainerInfo.on('keypress', function(ch, key) {
  if (key.name === 'escape') {
    widgetContainerInfo.destroy();
  }
});

screen.on('keypress', function(ch, key) {
  if (key.name === 'tab') {
    return key.shift ?
      screen.focusPrevious() :
      screen.focusNext();
  }
  if (key.name === 'q') {
    return process.exit(0);
  }
});

screen.on('element focus', function(cur, old) {
  if (old.border) old.style.border.fg = 'default';
  if (cur.border) cur.style.border.fg = 'green';
  screen.render();
});

screen.key('q', function() {
  return screen.destroy();
});
