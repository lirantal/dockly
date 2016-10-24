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

util.getInfo = function(cb) {
  var host = {};
  docker.info(function (err, data) {
    host.Containers = data.Containers;
    host.ContainersRunning = data.ContainersRunning;
    host.ContainersPaused = data.ContainersPaused;
    host.ContainersStopped = data.ContainersStopped;
    host.Images = data.Images;

    host.OperatingSystem = data.OperatingSystem;
    host.Architecture = data.Architecture;
    host.MemTotal = data.MemTotal;
    host.Host = data.Name;
    host.ServerVersion = data.ServerVersion;

    docker.version(function(vErr, vData) {

      host.ApiVersion = vData.ApiVersion;

      cb(host);
    })
  });
}

util.getContainer = function(containerId, cb) {
  var container = docker.getContainer(containerId);
  return container.inspect(cb);
};

util.getContainerStats = function(containerId, cb) {
  var container = docker.getContainer(containerId);
  return container.stats({stream: false}, function(err, stream) {
    cb(stream);
  })

};

util.getContainerLogs = function(containerId, cb) {
  var container = docker.getContainer(containerId);
  return container.logs({
        follow: true,
        stdout: true,
        stderr: true,
        details: false,
        tail: 50,
        timestamps: true
      }, cb);
}

module.exports = util;
