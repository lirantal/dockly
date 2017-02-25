'use strict';

var widgetDockerInfo = require('./widget-docker-info');
var widgetContainerUtilization = require('./widget-container-utilization');
var widgetContainerLogs = require('./widget-container-logs');
var widgetContainerStatus = require('./widget-container-status');
var widgetContainersVsImages = require('./widget-container-vs-images');
var widgetContainerInfo = require('./widget-container-info');
var widgetContainerList = require('./widget-container-list');
var widgetToolbar = require('./widget-toolbar');
var widgetContainerPopup = require('./widget-container-popup');


module.exports = {
  dockerInfo: widgetDockerInfo,
  containerUtilization: widgetContainerUtilization,
  containerLogs: widgetContainerLogs,
  containerStatus: widgetContainerStatus,
  containersVsImages: widgetContainersVsImages,
  containerInfo: widgetContainerInfo,
  containerList: widgetContainerList,
  toolbar: widgetToolbar,
  containerPopup: widgetContainerPopup
};
