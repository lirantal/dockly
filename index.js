#! /usr/bin/env node
'use strict';

/**
 * Required dependencies
 */
var blessed = require('blessed'),
  contrib = require('blessed-contrib'),
  util = require('util'),
  os = require('os');

/**
 * Project dependencies
 */
var dockerUtil = require('./src/dockerUtil'),
  widgets = require('./widgets'),
  cli = require('./src/cli');

var docker = new dockerUtil(cli.cliParse());

var screen = blessed.screen({
  title: 'Dockly',
  fullUnicode: true,
  dockBorders: true
});

var widgetContainerUtilization = widgets.containerUtilization.getWidget(contrib, screen);
screen.append(widgetContainerUtilization);

var widgetContainerStatus = widgets.containerStatus.getWidget(contrib, screen);
screen.append(widgetContainerStatus);

var widgetContainerLogs = widgets.containerLogs(blessed, screen);
screen.append(widgetContainerLogs);

var widgetContainerList = widgets.containerList(blessed, screen);
screen.append(widgetContainerList);

var toggleWidgetDockerInfo = 0

var widgetContainerInfo = widgets.containerInfo(blessed, screen);
var widgetContainerPopup = widgets.containerPopup(blessed, screen);

var widgetToolbarHelper = widgets.toolbar;

// We have to immediately append and remove it so it doesn't appear on screen
var widgetDockerInfo = widgets.dockerInfo.getWidget(blessed, screen);
screen.append(widgetDockerInfo);
screen.remove(widgetDockerInfo);

widgetToolbarHelper.commands = {
  'refresh': {
    keys: ['='],
    callback: listContainersUpdate
  },
  'info': {
    keys: ['i'],
    callback: function () {

      screen.append(widgetContainerInfo);
      widgetContainerInfo.focus();

      docker.getContainer(getSelectedContainer(), function (err, data) {
        widgetContainerInfo.setContent(util.inspect(data));
        screen.render();
      });
    }
  },
  'host info': {
    keys: ['0'],
    callback: function () {

      toggleWidgetDockerInfo = !toggleWidgetDockerInfo;
      if (toggleWidgetDockerInfo) {

        docker.getInfo(function (data) {
          screen.append(widgetDockerInfo);
          widgets.dockerInfo.update(data);
        });
      } else {
        screen.remove(widgetDockerInfo)
      }

    }
  },
  'logs': {
    keys: ['[RETURN]']
  },
  'restart': {
    keys: ['r'],
    callback: function() {

      let containerId = getSelectedContainer();

      screen.append(widgetContainerPopup);

      widgetContainerPopup.setLabel('Container: ' + containerId)
      widgetContainerPopup.setContent('Restarting container...');
      widgetContainerPopup.focus();

      docker.restartContainer(containerId, function (err, data) {

        if (err && err.statusCode === 500) {
          widgetContainerPopup.setContent(err.json.message);
        } else {
          widgetContainerPopup.setContent('Container restarted successfully');
        }

        screen.render();

      });
    }
  },
  'quit': {
    keys: ['q']
  }
};

var widgetToolbar = widgetToolbarHelper.getToolbar(blessed, screen);
screen.append(widgetToolbar);

setInterval(function () {

  // Update Docker Info
  docker.getInfo(function (data) {
    widgets.containerStatus.update(data);
  });

  // Update Container Utilization
  docker.getContainerStats(getSelectedContainer(), function (data) {
    widgets.containerUtilization.update(data);
  });

  screen.render();

}, 500);

docker.listContainers(function (data) {
  widgetContainerList.setData(data);
  widgetContainerList.select(0);
  screen.render();
  widgetContainerList.focus();
});

screen.render();

widgetContainerList.on('select', function (item, idx) {

  // extract the first column out of the table row which is the container id
  var containerId = item.getContent().trim().split(' ').shift();

  docker.getContainerLogs(containerId, function (err, stream) {
    if (stream && stream.pipe) {
      stream.on('data', function (chink) {
        widgetContainerLogs.add(chink.toString('utf-8').trim() + os.EOL);
      });
    }
  });

});

widgetContainerInfo.on('keypress', function (ch, key) {
  if (key.name === 'escape' || key.name === 'return') {
    widgetContainerInfo.destroy();
  }
});

widgetContainerPopup.on('keypress', function (ch, key) {
  if (key.name === 'escape' || key.name === 'return') {
    widgetContainerPopup.destroy();
  }
});

/**
 * returns a selected container from the containers listbox
 * @return {string} container id
 */
function getSelectedContainer() {
  return widgetContainerList.getItem(widgetContainerList.selected).getContent().trim().split(' ').shift();
}

/**
 * render the containers list on demand
 */
function listContainersUpdate() {

  docker.listContainers(function (data) {
    widgetContainerList.setData(data);
    screen.render();
  });

}

var toggleWidgetFocus = 1;
screen.on('keypress', function (ch, key) {
  if (key.name === 'tab') {
    toggleWidgetFocus ? screen.focusPush(widgetContainerLogs) : screen.focusPush(widgetContainerList);
    toggleWidgetFocus = !toggleWidgetFocus;
  }
  if (key.name === 'q') {
    return process.exit(0);
  }
});

screen.on('element focus', function (cur, old) {
  if (old.border) old.style.border.fg = 'default';
  if (cur.border) cur.style.border.fg = 'green';
  screen.render();
});

screen.key('q', function () {
  return screen.destroy();
});

process.on('uncaughtException', function(err) {

  // Make sure the screen is cleared
  screen.destroy();

  cli.showUsage();

  if (err && err.message) {
    console.log('\x1b[31m');

    console.log('Error: ' + err.message);
    if (err.message === 'Unable to determine the domain name') {
      console.log('-> check your connection options to the docker daemon and confirm containers exist');
    }
    console.log('\x1b[0m');
  }

  process.exit(-1);
});
