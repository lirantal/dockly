'use strict';

/* Required dependencies */
var blessed = require('blessed'),
  contrib = require('blessed-contrib'),
  fs = require('fs'),
  util = require('util');

/* Project dependencies */
var docker = require('./src/dockerUtil');

var screen = blessed.screen({
  dump: __dirname + '/logs/dock.log',
  title: 'Dockly',
  smartCSR: true,
  fullUnicode: true
});

var logsBox = blessed.log({
  label: 'Container Logs',
  mouse: true,
  scrollable: true,
  alwaysScroll: true,
  keys: true,
  vi: true,
  style: {
    fg: 'default',
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
  hover: {
    bg: 'blue'
  },
  scrollbar: {
    fg: 'blue',
    ch: '|'
  },
  width: '60%',
  height: '70%',
  top: '0',
  left: '0',
  align: 'left',
  content: 'Loading...',
  tags: true
});
screen.append(logsBox);


var containersBox = blessed.listtable({
  parent: screen,
  label: 'Containers List',
  keys: true,
  mouse: true,
  data: null,
  tags: true,
  interactive: true,
  border: 'line',
  hover: {
    bg: 'blue'
  },
  style: {
    header: {
      fg: 'blue',
      bold: true
    },
    cell: {
      fg: 'magenta',
      selected: {
        bg: 'blue'
      }
    }
  },
  width: '100%',
  height: '30%',
  top: '70%',
  left: '0',
  align: 'center'
});

var containerInfo = blessed.box({
  label: 'Container Info',
  scrollable: true,
  alwaysScroll: true,
  keys: true,
  vi: true,
  tags: true,
  style: {
    selected: {
      bg: 'green'
    }
  },
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
  width: '70%',
  height: '70%',
  top: 'center',
  left: 'center',
  align: 'left',
  content: 'Loading...'
});

var dockerInfo = blessed.table({
  label: 'Docker Host',
  parent: screen,
  border: 'line',
  align: 'center',
  tags: true,
  style: {
    border: {
      fg: 'default'
    },
    cell: {
      fg: 'magenta'
    }
  },
  width: '40%',
  top: '40%',
  left: '60%'
});

var containersStatus = contrib.gauge({
  label: 'Running/Paused/Stopped',
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
  hover: {
    bg: 'blue'
  },
  width: '40%',
  height: '16%',
  top: '0',
  left: '60%',
});
screen.append(containersStatus);

var containerStat = contrib.donut({
  label: 'Container Utilization',
  radius: 10,
  arcWidth: 3,
  remainColor: 'black',
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
  hover: {
    bg: 'blue'
  },
  width: '40%',
  height: '22%',
  top: '18%',
  left: '60%',
});
screen.append(containerStat);

setInterval(function() {
  docker.getInfo(function(data) {

    dockerInfo.setData([
       [ 'Host', data.Host ],
       [ 'OS', data.OperatingSystem ],
       [ 'Arch', data.Architecture ],
       [ 'Host Version', data.ServerVersion ],
       [ 'Host API Version', data.ApiVersion ],
       [ 'Memory', data.MemTotal.toString() ]
     ]);

     if (data.Containers !== 0) {

       var stack = [];
       if (data.ContainersRunning !== 0) {
         stack.push({ percent: Math.round((data.ContainersRunning / data.Containers) * 100), stroke: 'green' });
       }

       if (data.ContainersPaused !== 0) {
         stack.push({ percent: Math.round((data.ContainersPaused / data.Containers) * 100), stroke: 'yellow' });
       }

       if (data.ContainersStopped !== 0) {
         stack.push({ percent: Math.round((data.ContainersStopped / data.Containers) * 100), stroke: 'red' });
       }

       containersStatus.setStack(stack);

     }

     screen.render();

  });
}, 1000);

screen.render();

docker.listContainers(function(data) {
  containersBox.setData(data);
  containersBox.select(0);
  screen.render();
  containersBox.focus();
});


setInterval(function() {

    var containerId = containersBox.getItem(containersBox.selected).getContent().trim().split(' ').shift();
    docker.getContainerStats(containerId, function(data) {

      // Calculate CPU usage based on delta from previous measurement
      var cpuUsageDelta = data.cpu_stats.cpu_usage.total_usage -  data.precpu_stats.cpu_usage.total_usage;
      var systemUsageDelta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
      var cpuCoresAvail = data.cpu_stats.cpu_usage.percpu_usage.length;
      var cpuUsagePercent = cpuUsageDelta / systemUsageDelta * cpuCoresAvail * 100;

      // Calculate Memory usage
      var memUsage = data.memory_stats.usage;
      var memAvail = data.memory_stats.limit;
      var memUsagePercent = memUsage / memAvail * 100;

      // logsBox.setContent(cpuUsagePercent.toString() + '\n' + memUsagePercent.toString() + '\n');

      containerStat.setData([
        { percent: Math.round(cpuUsagePercent), label: 'cpu %', 'color': 'magenta' },
        { percent: Math.round(memUsagePercent), label: 'mem %', 'color': 'cyan' },
       ]);

       screen.render();

    });
  }, 200);

containersBox.on('select', function(item, idx) {

  // extract the first column out of the table row which is the container id
  var containerId = item.getContent().trim().split(' ').shift();

  screen.append(containerInfo);
  containerInfo.focus();

  docker.getContainer(containerId, function(err, data) {
    containerInfo.setContent(util.inspect(data));
    screen.render();
  });

  docker.getContainerLogs(containerId, function(err, stream) {
    if (stream && stream.pipe) {
      stream.on('data', function(chink) {
        logsBox.add(chink.toString('utf-8').trim());
      });
    }
  });

})

containerInfo.on('keypress', function(ch, key) {
  if (key.name === 'escape') {
    containerInfo.destroy();
  }
});


screen.on('keypress', function(ch, key) {
  if (key.name === 'tab') {
    return key.shift
      ? screen.focusPrevious()
      : screen.focusNext();
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
