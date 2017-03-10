'use strict';

exports.widget = {};
exports.getWidget = function(blessed, screen) {
  let widget = blessed.gauge({
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
    width: '20%',
    height: '18%',
    top: '0',
    left: '80%'
  });

  this.widget = widget;
  return widget;

};

exports.update = function(data) {

  if (!data || Object.keys(data).length === 0) {
    return;
  }

  if (data.Containers !== 0) {

    let stack = [];
    if (data.ContainersRunning !== 0) {
      stack.push({
        percent: Math.round((data.ContainersRunning / data.Containers) * 100),
        stroke: 'green'
      });
    }

    if (data.ContainersPaused !== 0) {
      stack.push({
        percent: Math.round((data.ContainersPaused / data.Containers) * 100),
        stroke: 'yellow'
      });
    }

    if (data.ContainersStopped !== 0) {
      stack.push({
        percent: Math.round((data.ContainersStopped / data.Containers) * 100),
        stroke: 'red'
      });
    }

    this.widget.setStack(stack);

  }

};
