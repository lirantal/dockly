'use strict';

var dockerNode = require('dockerode');
var docker = new dockerNode({socketPath: '/var/run/docker.sock'});

var util = {};

util.listContainers = function(cb) {
  docker.listContainers(function (err, containers) {
    var list = [
      ['Id', 'Name', 'Image', 'Command', 'State', 'Status'],
    ];

    containers.forEach(function(container, index, array) {
      list.push([container.Id, container.Names[0], container.Image, container.Command, container.State, container.Status]);
    });

    cb(list);

  });
};

util.getContainer = function(containerId, cb) {
  var container = docker.getContainer(containerId);
  return container.inspect(cb);
};

module.exports = util;
