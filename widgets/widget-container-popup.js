'use strict';

var widgetContainerPopup = function(blessed, screen) {
  return blessed.box({
    label: 'Status',
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
    width: '60%',
    height: '30%',
    top: 'center',
    left: 'center',
    align: 'left',
    content: ''
  });

};

module.exports = widgetContainerPopup;
