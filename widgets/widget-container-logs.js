'use strict';

var widgetContainerLogs = function(blessed, screen) {
  return blessed.log({
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
    width: '100%',
    height: '45%',
    top: '55%',
    left: '0',
    align: 'left',
    content: '',
    tags: true
  });

};

module.exports = widgetContainerLogs;
