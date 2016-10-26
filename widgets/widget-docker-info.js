'use strict';

var widgetContainerUtilization = function(blessed, screen) {
  return blessed.table({
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
};

module.exports = widgetContainerUtilization;
