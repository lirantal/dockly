<p align="center">
	<br>
  <img width="200" src="https://user-images.githubusercontent.com/316371/28937414-67ee5ffa-7893-11e7-95f9-5059cacf9170.png">
	<br>
 Immersive terminal interface for managing docker containers and services
</p>


[![Node Version](https://img.shields.io/badge/node-%3E=7.6.0-brightgreen.svg)]()
[![view on npm](http://img.shields.io/npm/v/dockly.svg)](https://www.npmjs.org/package/dockly)
[![view on npm](http://img.shields.io/npm/l/dockly.svg)](https://www.npmjs.org/package/dockly)
[![npm module downloads](http://img.shields.io/npm/dt/dockly.svg)](https://www.npmjs.org/package/dockly)
[![Dependency Status](https://david-dm.org/lirantal/dockly.svg)](https://david-dm.org/lirantal/dockly)
[![Codefresh build status]( https://g.codefresh.io/api/badges/build?repoOwner=lirantal&repoName=dockly&branch=master&pipelineName=dockly&accountName=lirantal&type=cf-1)]( https://g.codefresh.io/repositories/lirantal/dockly/builds?filter=trigger:build;branch:master;service:58127ed36b0e230100f421f6~dockly)
[![Security Responsible Disclosure](https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg)](https://github.com/nodejs/security-wg/blob/master/processes/responsible_disclosure_template.md
)


🌟 Featured on [![Awesome Docker](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/veggiemonk/awesome-docker) [![DevOps Weekly](https://img.shields.io/badge/DevOpsWeekly-%F0%9F%95%B6-yellow.svg
)](http://devopsweekly.com) 
[![terminals are sexy](https://img.shields.io/badge/TerminalsAreSexy-%F0%9F%92%BB-green.svg
)](https://github.com/k4m4/terminals-are-sexy) 



![dockly-demo-2](https://cloud.githubusercontent.com/assets/316371/25682867/c5212216-3027-11e7-8f36-72d38516d2af.gif)

# Install
Install the API module as a dependency in your project so you can easily use it to query Operations Orchestration REST API

```javascript
npm install -g dockly
```

# Usage

Just fire up dockly and it will automatically connect to your localhost docker daemon through the unix socket:

```
dockly
```

## Command line options:

It's also possible to provide command line options for dockly to customize the docker connection

| Param | Type | Description |
| --- | --- | --- |
| -s or --socketPath | string | Docker socket to connect to |
| -h or --help | null | Display help |
| -v or --version | null | Display version information |

# Docker Support

## Run from docker

You can run dockly using docker:

```
docker run -it -v /var/run/docker.sock:/var/run/docker.sock lirantal/dockly
```


## Build

If you wish to build dockly as a docker image yourself, you can run the following:

```
$ docker build -t dockly .

$ docker run -it --name dockly -v /var/run/docker.sock:/var/run/docker.sock dockly
```

# FAQ

1. Unsupported Node.js Version

If you're getting the following error in your CLI:
```
root@neo:~# dockly
/usr/local/lib/node_modules/dockly/src/screen.js:36
constructor (utils = new Map()) {
^

SyntaxError: Unexpected token =
at exports.runInThisContext (vm.js:53:16)
at Module._compile (module.js:374:25)
```

Or this kind of error:
```
Trace: TypeError: Object.values is not a function                                                                                                            
    at screen.toggleMode (/home/vokiel/.nvm/versions/node/v6.11.1/lib/node_modules/dockly/src/screen.js:149:35)
    at Screen.screen.key (/home/vokiel/.nvm/versions/node/v6.11.1/lib/node_modules/dockly/src/screen.js:190:12)
    at Screen.EventEmitter._emit
    (/home/vokiel/.nvm/versions/node/v6.11.1/lib/node_modules/dockly/node_modules/blessed/lib/events.js:98:20)
```

This is most likely because you're using an unsupported Node.js version.
Dockly requires Node.js v7.6 and above




# Author
Liran Tal <liran.tal@gmail.com>
