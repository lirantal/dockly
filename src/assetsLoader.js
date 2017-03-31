'use strict'

const path = require('path')
const glob = require('glob')
const config = {
  'hooks': 'hooks/*.hook.js',
  'widgets': 'widgets/*.widget.js'
}

class assetsLoader {
  static load() {
    const assets = this.resolveAssetFiles()
    return assets
  }

  static resolveAssetFiles() {
    let assets = new Map([
      ['hooks', undefined],
      ['widgets', undefined]
    ])

    let hooksMap = new Map()
    let widgetsMap = new Map()

    glob.sync(config.hooks).forEach((item) => {
      hooksMap.set(this.formatAsset(item), require(path.resolve(item)))
    })

    glob.sync(config.widgets).forEach((item) => {
      widgetsMap.set(this.formatAsset(item), require(path.resolve(item)))
    })

    assets.set('hooks', hooksMap)
    assets.set('widgets', widgetsMap)

    return assets
  }

  static formatAsset(assetPath) {
    return path.basename(assetPath).split('.')[0]
  }
}

module.exports = assetsLoader
