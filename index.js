'use strict'

/* Required dependencies */
var blessed = require('blessed'),
  fs = require('fs'),
  util = require('util');

/* Project dependencies */
var docker = require('./dockerUtil');

var screen = blessed.screen({
  dump: __dirname + '/logs/dock.log',
  title: 'widget test',
  smartCSR: true,
  dockBorders: true,
  warnings: true,
  autoPadding: false,
  fullUnicode: true,
  warnings: true
});

var logsBox = blessed.box({
  parent: screen,
  mouse: true,
  scrollable: true,
  alwaysScroll: true,
  keys: true,
  vi: true,
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
  scrollbar: {
    fg: 'blue',
    ch: '|'
  },
  width: '100%',
  height: '60%',
  top: '0',
  left: '0',
  align: 'center',
  content: 'Loading...',
  tags: true
});

var containersBox = blessed.listtable({
  parent: screen,
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
  height: '40%',
  top: '60%',
  left: '0',
  align: 'center'
});

var containerInfo = blessed.box({
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
  width: '70%',
  height: '70%',
  top: 'center',
  left: 'center',
  align: 'left',
  content: 'Loading...'
});

docker.listContainers(function(data) {
  containersBox.setData(data);
  screen.render();
  containersBox.focus();
});




containersBox.on('select', function(item, idx) {

  // extract the first column out of the table row which is the container id
  var containerId = item.getContent().trim().split(' ').shift();

  screen.append(containerInfo);
  containerInfo.focus();

  docker.getContainer(containerId, function(err, data) {
    containerInfo.setContent(util.inspect(data));
    screen.render();
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

screen.render();
