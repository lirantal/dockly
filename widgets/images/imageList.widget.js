'use strict'

const ListWidget = require('../../src/widgetsTemplates/list.widget.template')

class myWidget extends ListWidget {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super({ blessed, contrib, screen, grid })
    this.imagesListData = []
  }

  getLabel () {
    return 'Images'
  }

  getListItems (cb) {
    this.utilsRepo.get('docker').listImages(cb)
  }

  filterList (data) {
    let imageTitleList = this.imagesListData[0]
    let imageList = this.imagesListData.slice(1)
    let filteredimages = []

    if (data) {
      filteredimages = imageList.filter((container, index, containerItems) => {
        const imageName = container[1]
        const imageTag = container[2]

        if ((imageName.indexOf(data) !== -1) || (imageTag.indexOf(data) !== -1)) {
          return true
        }
      })
    }

    if (filteredimages.length > 0) {
      filteredimages.unshift(imageTitleList)
      this.update(filteredimages)
    } else {
      this.update(this.imagesListData)
    }
  }

  formatList (images) {
    const imageList = []

    if (images) {
      images.forEach((image) => {
        const getTag = (tag, part) => tag ? tag[0].split(':')[part] : 'none'

        imageList.push([
          image.Id.substring(7, 12),
          image.RepoDigests ? image.RepoDigests[0].split('@')[0] : getTag(image[2], 0),
          getTag(image.RepoTags, 1),
          this.timeDifference(image.Created),
          this.formatBytes(image.Size)
        ])
      })
    }

    imageList.unshift(['Id', 'Name', 'Tag', 'Created', 'Size'])

    this.imagesListData = imageList

    return imageList
  }

  /**
   * Format raw bytes into human readable size.
   *
   * @param {number} bytes - number of bytes.
   * @returns {string} human readable size.
   */
  formatBytes (bytes, decimals) {
    if (bytes === 0) return '0 Bytes'
    let k = 1000

    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    let i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * Convert number of seceond to
   * @param {number} creationDate Images creation date in unix time.
   * @returns
   */
  timeDifference (creationDate) {
    const msPerMinute = 60 * 1000
    const msPerHour = msPerMinute * 60
    const msPerDay = msPerHour * 24
    const msPerMonth = msPerDay * 30
    const msPerYear = msPerDay * 365

    const elapsed = Date.now() - (creationDate * 1000)

    const cleanReturn = (number, format) => `${Math.round(number)} ${format}${Math.round(number) === 1 ? '' : 's'} ago`

    if (elapsed < msPerMinute) { return cleanReturn(elapsed / 1000, 'second') }
    if (elapsed < msPerHour) { return cleanReturn(elapsed / msPerMinute, 'minute') }
    if (elapsed < msPerDay) { return cleanReturn(elapsed / msPerHour, 'hour') }
    if (elapsed < msPerMonth) { return cleanReturn(elapsed / msPerDay, 'day') }
    if (elapsed < msPerYear) { return cleanReturn(elapsed / msPerMonth, 'month') }
    return cleanReturn(elapsed / msPerYear, 'year')
  }

  /**
   * returns a selected container from the containers listbox
   * @return {string} container id
   */
  getSelectedImage () {
    return this.widget.getItem(this.widget.selected).getContent().toString().trim().split(' ').shift()
  }

  getItemLogs (itemId, cb) {
    cb(new Error('image view don\'t have log widget'))
  }
}

module.exports = myWidget
