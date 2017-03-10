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

util.prototype.listImages = function (cb) {

  dockerCon.listImages(function (err, images) {
    if (images) {
      cb(images);
    }
  });

};

util.prototype.listContainers = function (cb) {

  dockerCon.listContainers({'all': true}, function (err, containers) {
    var list = [];

    if (containers) {
      containers.forEach(function (container, index, array) {
        list.push([container.Id.substring(0, 5), container.Names[0].substring(0, 20), container.Image.substring(0, 19), container.Command.substring(0, 30), container.State, container.Status]);
      });
    }

    list.sort(sortContainers);
    list.unshift(['Id', 'Name', 'Image', 'Command', 'State', 'Status']);
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

util.prototype.restartContainer = function (containerId, cb) {
  var container = dockerCon.getContainer(containerId);
  container.restart(cb);
};

util.prototype.stopContainer = function (containerId, cb) {
  var container = dockerCon.getContainer(containerId);
  container.stop(cb);
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

/**
 * Sort containers by their state: running, created, then exited.
 *
 * @param item left
 * @param item right
 * @returns {number} for position
 */
function sortContainers(a, b) {

  if (a[4] === 'running' && b[4] !== 'running') {
    return -1;
  }

  if (a[4] === 'exited' && b[4] !== 'exited') {
    return 1;
  }

  return 0;

}

module.exports = util;
