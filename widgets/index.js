'use strict';

var widgetDockerInfo = require('./widget-docker-info');
var widgetContainerUtilization = require('./widget-container-utilization');
var widgetContainerLogs = require('./widget-container-logs');
var widgetContainerStatus = require('./widget-container-status');
var widgetContainerInfo = require('./widget-container-info');
var widgetContainerList = require('./widget-container-list');
var widgetToolbar = require('./widget-toolbar');

module.exports = {
  dockerInfo: widgetDockerInfo,
  containerUtilization: widgetContainerUtilization,
  containerLogs: widgetContainerLogs,
  containerStatus: widgetContainerStatus,
  containerInfo: widgetContainerInfo,
  containerList: widgetContainerList,
  toolbar: widgetToolbar,
};
