#! /usr/bin/env node
'use strict';

/**
 * Required dependencies
 */
var blessed = require('blessed'),
  contrib = require('blessed-contrib'),
  util = require('util');

/**
 * Project dependencies
 */
var dockerUtil = require('./src/dockerUtil'),
  widgets = require('./widgets'),
  cli = require('./src/cli');

var docker = new dockerUtil(cli.cliParse());

var screen = blessed.screen({
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

var widgetToolbarHelper = widgets.toolbar;

widgetToolbarHelper.commands = {
  'info': {
    keys: ['i'],
    callback: function () {

      var containerId = widgetContainerList.getItem(widgetContainerList.selected).getContent().trim().split(' ').shift();

      screen.append(widgetContainerInfo);
      widgetContainerInfo.focus();

      docker.getContainer(containerId, function (err, data) {
        widgetContainerInfo.setContent(util.inspect(data));
        screen.render();
      });
    }
  },
  'logs': {
    keys: ['[RETURN]']
  },
  'quit': {
    keys: ['q']
  }
};

var widgetToolbar = widgetToolbarHelper.getToolbar(blessed, screen);
screen.append(widgetToolbar);

setInterval(function () {
  docker.getInfo(function (data) {

    if (!data || Object.keys(data).length === 0) {
      return;
    }

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

docker.listContainers(function (data) {
  widgetContainerList.setData(data);
  widgetContainerList.select(0);
  screen.render();
  widgetContainerList.focus();
});

setInterval(function () {

  var containerId = widgetContainerList.getItem(widgetContainerList.selected).getContent().trim().split(' ').shift();
  docker.getContainerStats(containerId, function (data) {

    if (!data || Object.keys(data).length === 0) {
      return;
    }

    // Calculate CPU usage based on delta from previous measurement
    var cpuUsageDelta = data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage;
    var systemUsageDelta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
    var cpuCoresAvail = data.cpu_stats.cpu_usage.percpu_usage !== null ? data.cpu_stats.cpu_usage.percpu_usage.length : 0;

    var cpuUsagePercent = 0;
    if (systemUsageDelta != 0 || cpuCoresAvail != 0) {
      cpuUsagePercent = cpuUsageDelta / systemUsageDelta * cpuCoresAvail * 100;
    }

    // Calculate Memory usage
    var memUsage = data.memory_stats.usage;
    var memAvail = data.memory_stats.limit;

    var memUsagePercent = 0;
    if (memAvail != 0) {
      memUsagePercent = memUsage / memAvail * 100;
    }

    widgetContainerUtilization.setData([{
      percent: Math.round(Number(cpuUsagePercent)),
      label: 'cpu %',
      'color': 'magenta'
    }, {
      percent: Math.round(Number(memUsagePercent)),
      label: 'mem %',
      'color': 'cyan'
    },]);

    screen.render();

  });
}, 200);

widgetContainerList.on('select', function (item, idx) {

  // extract the first column out of the table row which is the container id
  var containerId = item.getContent().trim().split(' ').shift();

  docker.getContainerLogs(containerId, function (err, stream) {
    if (stream && stream.pipe) {
      stream.on('data', function (chink) {
        widgetContainerLogs.add(chink.toString('utf-8').trim());
      });
    }
  });

})

widgetContainerInfo.on('keypress', function (ch, key) {
  if (key.name === 'escape') {
    widgetContainerInfo.destroy();
  }
});

screen.on('keypress', function (ch, key) {
  if (key.name === 'tab') {
    return key.shift ?
      screen.focusPrevious() :
      screen.focusNext();
  }
  if (key.name === 'q') {
    return process.exit(0);
  }
});

screen.on('element focus', function (cur, old) {
  if (old.border) old.style.border.fg = 'default';
  if (cur.border) cur.style.border.fg = 'green';
  screen.render();
});

screen.key('q', function () {
  return screen.destroy();
});

process.on('uncaughtException', function(err) {

  // clear the screen
  screen.destroy();

  cli.showUsage();

  if (err && err.message) {
    console.log('\x1b[31m');

    console.log('Error: ' + err.message);
    if (err.message === 'Unable to determine the domain name') {
      console.log('-> check your connection options to the docker daemon and confirm containers exist');
    }
    console.log('\x1b[0m');
  }

  process.exit(-1);
});