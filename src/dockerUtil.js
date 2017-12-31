'use strict'

const DockerLib = require('dockerode')

class Util {
  constructor (connection) {
    if (typeof connection !== 'object') {
      throw new Error('Error: docker connection string is faulty, please review command line arguments.')
    }

    // If a socketPath was explicitly specified, attempt connection based on it
    if (connection.socketPath) {
      this.dockerCon = new DockerLib(connection)
    } else {
      this.dockerCon = new DockerLib()
    }
  }

  ping (cb) {
    this.dockerCon.ping(function (err, data) {
      if (err) {
        return cb(err, {})
      }

      return cb(null, data)
    })
  }

  listImages (cb) {
    this.dockerCon.listImages(function (err, images) {
      if (err) {
        return cb(err, {})
      }

      if (images) {
        return cb(null, images)
      }
    })
  }

  listContainers (cb) {
    this.dockerCon.listContainers({'all': true}, function (err, containers) {
      if (err) {
        return cb(err, {})
      }

      return cb(null, containers)
    })
  }

  stopAllContainers (cb) {
    this.listContainers((err, containers) => {
      if (err) {
        return cb(err, {})
      }

      containers.forEach((containerInfo) => {
        this.stopContainer(containerInfo.Id, cb)
      })
    })
  }

  removeAllContainers (cb) {
    this.listContainers((err, containers) => {
      if (err) {
        return cb(err, {})
      }

      containers.forEach((containerInfo) => {
        this.removeContainer(containerInfo.Id, cb)
      })
    })
  }

  removeAllImages (db) {
    this.listImages((err, images) => {
      if (err) {
        return cb(err, {})
      }

      images.forEach((imageInfo) => {
        this.removeImage(imageInfo.Id, cb)
      })
    })
  }

  getInfo (cb) {
    const host = {}
    this.dockerCon.info((err, data) => {
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

      this.dockerCon.version(function (vErr, vData) {
        host.ApiVersion = vData.ApiVersion

        cb(host)
      })
    })
  }

  getContainer (containerId, cb) {
    const container = this.dockerCon.getContainer(containerId)
    return container.inspect(cb)
  }

  restartContainer (containerId, cb) {
    const container = this.dockerCon.getContainer(containerId)
    container.restart(cb)
  }

  stopContainer (containerId, cb) {
    const container = this.dockerCon.getContainer(containerId)
    container.stop(cb)
  }

  removeContainer (containerId, cb) {
    const container = this.dockerCon.getContainer(containerId)
    container.remove({
      force: true
    }, cb)
  }

  removeImage (imageId, cb) {
    const image = this.dockerCon.getImage(imageId)
    image.remove({
      force: true
    }, cb)
  }

  getContainerStats (containerId, cb) {
    if (!containerId) {
      return cb(null)
    }

    const container = this.dockerCon.getContainer(containerId)
    container.stats({stream: false}, function (err, stream) {
      if (err) {
        return cb(null)
      }
      return cb(stream)
    })
  }

  getContainerLogs (containerId, cb) {
    const container = this.dockerCon.getContainer(containerId)
    return container.logs({
      follow: true,
      stdout: true,
      stderr: true,
      details: false,
      tail: 50,
      timestamps: true
    }, cb)
  }
}

module.exports = Util
