'use strict';

exports.commands = {};

exports.getToolbar = function(blessed, screen) {
  return blessed.listbar({
    keys: true,
    vi: true,
    mouse: true,
    style: {
      bg: 'green'
    },
    height: 'shrink',
    bottom: '0',
    left: '0',
    right: '0',
    autoCommandKeys: true,
    commands: this.commands
  });
};
