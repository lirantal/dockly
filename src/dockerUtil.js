'use strict'

const url = require('url')
const DockerLib = require('dockerode')

const DOCKER_SOCKET = process.env.DOCKER_SOCKET || '/var/run/docker.sock'
const DOCKER_HOST = process.env.DOCKER_HOST || false
let dockerCon

function util (connection) {
  if (typeof connection !== 'object') {
    throw new Error('Error: docker connection string is faulty, please review command line arguments.')
  }

  if (!connection.hasOwnProperty('socketPath') && !connection.hasOwnProperty('host')) {
    // attempt honoring the DOCKER_HOST variable, and fallback to connect using the
    // the docker daemon socket
    if (DOCKER_HOST) {
      const parsedUrl = parseUrl(DOCKER_HOST)
      dockerCon = new DockerLib({host: parsedUrl.host, port: parsedUrl.port})
    } else {
      dockerCon = new DockerLib({socketPath: DOCKER_SOCKET})
    }
  } else {
    dockerCon = new DockerLib(connection)
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

util.prototype.getInfo = function (cb) {
  const host = {}
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

function parseUrl (urlString) {
  if (urlString.indexOf('://') === -1) {
    return url.parse(`http://${urlString}`)
  }

  return url.parse(urlString)
}

module.exports = util
