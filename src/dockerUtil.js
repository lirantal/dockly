'use strict';

var dockerLib = require('dockerode');
var dockerCon;

function util(connection) {

  if (typeof connection !== 'object') {
    throw('Error: docker connection string is faulty, please review command line arguments.');
  }

  if (!dockerCon) {
    if (!connection.hasOwnProperty('socketPath') && !connection.hasOwnProperty('host')) {
      dockerCon = new dockerLib({socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock'});
    } else {
      dockerCon = new dockerLib(connection);
    }
  }

}

util.prototype.listContainers = function (cb) {

  dockerCon.listContainers({'all': true}, function (err, containers) {
    var list = [
      ['Id', 'Name', 'Image', 'Command', 'State', 'Status'],
    ];

    if (containers) {
      containers.forEach(function (container, index, array) {
        list.push([container.Id, container.Names[0], container.Image, container.Command, container.State, container.Status]);
      });
    }

    cb(list);

  });
};

util.prototype.getInfo = function (cb) {
  var host = {};
  dockerCon.info(function (err, data) {

    if (!data || Object.keys(data).length === 0) {
      return cb(host);
    }

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

    dockerCon.version(function (vErr, vData) {

      host.ApiVersion = vData.ApiVersion;

      cb(host);
    })
  });
}

util.prototype.getContainer = function (containerId, cb) {
  var container = dockerCon.getContainer(containerId);
  return container.inspect(cb);
};

util.prototype.getContainerStats = function (containerId, cb) {
  var container = dockerCon.getContainer(containerId);
  return container.stats({stream: false}, function (err, stream) {
    cb(stream);
  })

};

util.prototype.getContainerLogs = function (containerId, cb) {
  var container = dockerCon.getContainer(containerId);
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
