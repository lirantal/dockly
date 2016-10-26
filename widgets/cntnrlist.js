'use strict';

var cntnrList = function(blessed, screen) {
  return blessed.listtable({
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
};

module.exports = cntnrList;
