'use strict';

var widgetContainerStatus = function(blessed, screen) {
  return blessed.gauge({
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

};

module.exports = widgetContainerStatus;
