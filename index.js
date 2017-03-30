#! /usr/bin/env node
'use strict';

/**
 * Required dependencies
 */
var blessed = require('blessed'),
  contrib = require('blessed-contrib'),
  util = require('util'),
  os = require('os'),
  chalk = require('chalk'),
  fs = require('fs');

/**
 * Project dependencies
 */
var dockerUtil = require('./src/dockerUtil'),
  widgets = require('./widgets'),
  cli = require('./src/cli');

const ContainerHook = require('./hooks/containers.hook.js')
const ShellHook = require('./hooks/shell.hook.js')

const widgetsRepository = {};

var docker = new dockerUtil(cli.cliParse());

// --------- hooks
const dockerHook = new ContainerHook()
widgetsRepository.dockerHook = dockerHook

const shellHook = new ShellHook()
widgetsRepository.shellHook = shellHook
//

var screen = blessed.screen({
  title: 'Dockly',
  fullUnicode: true,
  dockBorders: true
});

// -- Container List
var widgetContainerListObj = new widgets.containerList(blessed, screen)
var widgetContainerList = widgetContainerListObj.getWidget()
widgetContainerListObj.renderWidget()
// add it to widgets DI repository
widgetsRepository.widgetContainerList = widgetContainerListObj
// ---

// -- Container Status
var widgetContainerStatusObj = new widgets.containerStatus(contrib, screen);
var widgetContainerStatus = widgetContainerStatusObj.getWidget()
widgetContainerStatusObj.renderWidget()
// add it to widgets DI repository
widgetsRepository.widgetContainerStatus = widgetContainerStatusObj
// ---

// -- Container Logs
var widgetContainerLogsObj = new widgets.containerLogs(blessed, screen);
var widgetContainerLogs = widgetContainerLogsObj.getWidget()
widgetContainerLogsObj.renderWidget()
// add it to widgets DI repository
widgetsRepository.widgetContainerLogs = widgetContainerLogsObj
// --

// -- ToolBar
var widgetToolBarObj = new widgets.toolbar(blessed, screen);
var widgetToolBar = widgetToolBarObj.getWidget();
widgetToolBarObj.renderWidget();
// --
// add it to widgets DI repository
widgetsRepository.widgetToolBar = widgetToolBarObj;
// --

// -- container Info
var widgetContainerInfoObj = new widgets.containerInfo(blessed, screen);
var widgetContainerInfo = widgetContainerInfoObj.getWidget();
widgetContainerInfoObj.renderWidget();
// add it to widgets DI repository
widgetsRepository.widgetContainerInfo = widgetContainerInfoObj;
// ---

// -- containers vs images
var widgetContainersVsImagesObj = new widgets.containersVsImages(contrib, screen);
var widgetContainersVsImages = widgetContainersVsImagesObj.getWidget();
widgetContainersVsImagesObj.renderWidget();
// add it to widgets DI repository
widgetsRepository.widgetContainersVsImages = widgetContainersVsImagesObj;
// ---

// -- docker host info
// var widgetDockerInfo = widgets.dockerInfo.getWidget(blessed, containerUtilizationscreen);
var widgetDockerInfoObj = new widgets.dockerInfo(contrib, screen)
var widgetDockerInfo = widgetDockerInfoObj.getWidget()
widgetDockerInfoObj.renderWidget()
// add it to widgets DI repository
widgetsRepository.widgetDockerInfo = widgetDockerInfoObj
// ---

// -- Container Utilization
var widgetContainerUtilizationObj = new widgets.containerUtilization(contrib, screen)
var widgetContainerUtilization = widgetContainerUtilizationObj.getWidget()
widgetContainerUtilizationObj.renderWidget()
// // add it to widgets DI repository
widgetsRepository.widgetContainerUtilization = widgetContainerUtilizationObj
// ---

// -- Popup
var widgetContainerPopupObj = new widgets.containerPopup(blessed, screen)
var widgetContainerPopup = widgetContainerPopupObj.getWidget()
widgetContainerPopupObj.renderWidget()
// // add it to widgets DI repository
widgetsRepository.widgetContainerPopup = widgetContainerPopupObj
// ---

// -- set all widgets
dockerHook.setWidgetsRepo(widgetsRepository)
shellHook.setWidgetsRepo(widgetsRepository)
widgetContainerInfoObj.setWidgetsRepo(widgetsRepository)
widgetContainersVsImagesObj.setWidgetsRepo(widgetsRepository)
widgetContainerListObj.setWidgetsRepo(widgetsRepository)
widgetDockerInfoObj.setWidgetsRepo(widgetsRepository)
widgetContainerLogsObj.setWidgetsRepo(widgetsRepository)
widgetContainerStatusObj.setWidgetsRepo(widgetsRepository)
widgetContainerUtilizationObj.setWidgetsRepo(widgetsRepository)
widgetContainerPopupObj.setWidgetsRepo(widgetsRepository)
// --


const utils = {
  docker
}

// -- set all utils
dockerHook.setUtilsRepo(utils)
shellHook.setUtilsRepo(utils)
widgetContainerInfoObj.setUtilsRepo(utils)
widgetContainerListObj.setUtilsRepo(utils)
widgetDockerInfoObj.setUtilsRepo(utils)
widgetContainerLogsObj.setUtilsRepo(utils)
widgetContainerStatusObj.setUtilsRepo(utils)
widgetContainerUtilizationObj.setUtilsRepo(utils)
widgetContainerPopupObj.setUtilsRepo(utils)
// --

// -- init all widgets and hooks
widgetContainersVsImagesObj.init()
widgetContainerInfoObj.init()
dockerHook.init()
shellHook.init()
widgetContainerListObj.init()
widgetDockerInfoObj.init()
widgetContainerLogsObj.init()
widgetContainerStatusObj.init()
widgetContainerUtilizationObj.init()
widgetContainerPopupObj.init()

screen.render()

var toggleWidgetFocus = true;

screen.on('keypress', function (ch, key) {
  if (key.name === 'tab') {
    toggleWidgetFocus ? widgetContainerLogsObj.focus() : widgetContainerListObj.focus()
    toggleWidgetFocus = !toggleWidgetFocus
    screen.render()
  }
});

screen.on('element focus', function (curr, old) {
  if (old.border) old.style.border.fg = 'default'
  if (curr.border) curr.style.border.fg = 'green'
  screen.render();
});


screen.key('q', function () {
  screen.destroy()
  return process.exit(0)
});

process.on('uncaughtException', function (err) {

  // Make sure the screen is cleared
  screen.destroy();

  cli.showUsage();

  if (err && err.message) {
    console.log('\x1b[31m');

    console.trace('Error: ' + err.message);
    if (err.message === 'Unable to determine the domain name') {
      console.log('-> check your connection options to the docker daemon and confirm containers exist');
    }
    console.log('\x1b[0m');
  }

  process.exit(-1);
});
