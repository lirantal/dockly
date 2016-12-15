'use strict';

exports.widget = {};
exports.getWidget = function(blessed, screen) {
  let widget = blessed.table({
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

  this.widget = widget;
  return widget;
};

exports.update = function(data) {

  if (!data || Object.keys(data).length === 0) {
    return;
  }

  this.widget.setData([
    ['Host', data.Host],
    ['OS', data.OperatingSystem],
    ['Arch', data.Architecture],
    ['Host Version', data.ServerVersion],
    ['Host API Version', data.ApiVersion],
    ['Memory', data.MemTotal.toString()]
  ]);

};
