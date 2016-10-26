'use strict';

var widgetContainerInfo = function(blessed, screen) {
  return blessed.box({
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

};

module.exports = widgetContainerInfo;
