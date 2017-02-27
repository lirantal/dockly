'use strict';

exports.commands = {};

exports.getToolbar = function(blessed, screen) {
  return blessed.listbar({
    keys: false,
    vi: true,
    mouse: true,
    style: {
      bg: 'green'
    },
    height: 'shrink',
    bottom: '0',
    left: '0',
    right: '0',
    autoCommandKeys: false,
    commands: this.commands
  });
};
