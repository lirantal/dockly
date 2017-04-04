'use strict'

var DockerLib = require('dockerode')
var dockerCon

function util (connection) {
  if (typeof connection !== 'object') {
    throw new Error('Error: docker connection string is faulty, please review command line arguments.')
  }

  if (!dockerCon) {
    if (!connection.hasOwnProperty('socketPath') && !connection.hasOwnProperty('host')) {
      dockerCon = new DockerLib({socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock'})
    } else {
      dockerCon = new DockerLib(connection)
    }
  }
}

util.prototype.listImages = function (cb) {
  dockerCon.listImages(function (err, images) {
    if (err) {
      return cb(null)
    }

    if (images) {
      return cb(images)
    }
  })
}

util.prototype.listContainers = function (cb) {
  dockerCon.listContainers({'all': true}, function (err, containers) {
    if (err) {
      return cb(null)
    }

    return cb(containers)
  })
}

util.prototype.getInfo = function (cb) {
  var host = {}
  dockerCon.info(function (err, data) {
    if (err) {
      return cb(null)
    }

    if (!data || Object.keys(data).length === 0) {
      return cb(host)
    }

    host.Containers = data.Containers
    host.ContainersRunning = data.ContainersRunning
    host.ContainersPaused = data.ContainersPaused
    host.ContainersStopped = data.ContainersStopped
    host.Images = data.Images

    host.OperatingSystem = data.OperatingSystem
    host.Architecture = data.Architecture
    host.MemTotal = data.MemTotal
    host.Host = data.Name
    host.ServerVersion = data.ServerVersion

    dockerCon.version(function (vErr, vData) {
      host.ApiVersion = vData.ApiVersion

      cb(host)
    })
  })
}

util.prototype.getContainer = function (containerId, cb) {
  var container = dockerCon.getContainer(containerId)
  return container.inspect(cb)
}

util.prototype.restartContainer = function (containerId, cb) {
  var container = dockerCon.getContainer(containerId)
  container.restart(cb)
}

util.prototype.stopContainer = function (containerId, cb) {
  var container = dockerCon.getContainer(containerId)
  container.stop(cb)
}

util.prototype.getContainerStats = function (containerId, cb) {
  var container = dockerCon.getContainer(containerId)
  return container.stats({stream: false}, function (err, stream) {
    if (err) {
      return cb(null)
    }
    return cb(stream)
  })
}

util.prototype.getContainerLogs = function (containerId, cb) {
  var container = dockerCon.getContainer(containerId)
  return container.logs({
    follow: true,
    stdout: true,
    stderr: true,
    details: false,
    tail: 50,
    timestamps: true
  }, cb)
}

module.exports = util
