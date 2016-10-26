'use strict';

var widgetDockerInfo = function(blessed, screen) {
  return blessed.donut({
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
};

module.exports = widgetDockerInfo;
