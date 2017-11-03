'use strict'

const DockerLib = require('dockerode')
let dockerCon

function util (connection) {
  if (typeof connection !== 'object') {
    throw new Error('Error: docker connection string is faulty, please review command line arguments.')
  }

  // If a socketPath was explicitly specified, attempt connection based on it
  if (connection.socketPath) {
    dockerCon = new DockerLib(connection)
  } else {
    dockerCon = new DockerLib()
  }
}

util.prototype.ping = function (cb) {
  dockerCon.ping(function (err, data) {
    if (err) {
      return cb(err, {})
    }

    return cb(null, data)
  })
}

util.prototype.listImages = function (cb) {
  dockerCon.listImages(function (err, images) {
    if (err) {
      return cb(err, {})
    }

    if (images) {
      return cb(null, images)
    }
  })
}

util.prototype.listContainers = function (cb) {
  dockerCon.listContainers({'all': true}, function (err, containers) {
    if (err) {
      return cb(err, {})
    }

    return cb(null, containers)
  })
}

util.prototype.stopAllContainers = function (cb) {
  this.listContainers((err, containers) => {
    if (err) {
      return cb(err, {})
    }

    containers.forEach((containerInfo) => {
      this.stopContainer(containerInfo.Id, cb)
    })
  })
}

util.prototype.removeAllContainers = function (cb) {
  this.listContainers((err, containers) => {
    if (err) {
      return cb(err, {})
    }

    containers.forEach((containerInfo) => {
      this.removeContainer(containerInfo.Id, cb)
    })
  })
}

util.prototype.removeAllImages = function (cb) {
  this.listImages((err, images) => {
    if (err) {
      return cb(err, {})
    }

    images.forEach((imageInfo) => {
      this.removeImage(imageInfo.Id, cb)
    })
  })
}

util.prototype.getInfo = function (cb) {
  const host = {}
  dockerCon.info(function (err, data) {
    if (err) {
      return cb(null)
    }

    if (!data || (typeof data !== 'object')) {
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
  const container = dockerCon.getContainer(containerId)
  return container.inspect(cb)
}

util.prototype.restartContainer = function (containerId, cb) {
  const container = dockerCon.getContainer(containerId)
  container.restart(cb)
}

util.prototype.stopContainer = function (containerId, cb) {
  const container = dockerCon.getContainer(containerId)
  container.stop(cb)
}

util.prototype.removeContainer = function (containerId, cb) {
  const container = dockerCon.getContainer(containerId)
  container.remove({
    force: true
  }, cb)
}

util.prototype.removeImage = function (imageId, cb) {
  const image = dockerCon.getImage(imageId)
  image.remove({
    force: true
  }, cb)
}

util.prototype.getContainerStats = function (containerId, cb) {
  if (!containerId) {
    return cb(null)
  }

  const container = dockerCon.getContainer(containerId)
  container.stats({stream: false}, function (err, stream) {
    if (err) {
      return cb(null)
    }
    return cb(stream)
  })
}

util.prototype.getContainerLogs = function (containerId, cb) {
  const container = dockerCon.getContainer(containerId)
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
