<p align="center">
	<br>
  <img width="200" src="https://user-images.githubusercontent.com/316371/28937414-67ee5ffa-7893-11e7-95f9-5059cacf9170.png">
	<br>
 Immersive terminal interface for managing docker containers, services and images
</p>


[![Node Version](https://img.shields.io/badge/node-%3E=7.6.0-brightgreen.svg)]()
[![view on npm](http://img.shields.io/npm/v/dockly.svg)](https://www.npmjs.org/package/dockly)
[![view on npm](http://img.shields.io/npm/l/dockly.svg)](https://www.npmjs.org/package/dockly)
[![npm module downloads](http://img.shields.io/npm/dt/dockly.svg)](https://www.npmjs.org/package/dockly)
[![Known Vulnerabilities](https://snyk.io/test/npm/dockly/badge.svg)](https://snyk.io/test/npm/dockly)
[![Security Responsible Disclosure](https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg)](./SECURITY.md
)
[![dockly](https://snyk.io/advisor/npm-package/dockly/badge.svg)](https://snyk.io/advisor/npm-package/dockly)

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
| --containerFilters | string | String to apply to filter shown containers |
| -h or --help | null | Display help |
| -v or --version | null | Display version information |

### `--containerFilters`

This is a string that could be used to filter the shown containers;
its format is in the x-www-form-urlencoded style and the filters you could apply are listed here: [https://docs.docker.com/engine/api/v1.37/#operation/ContainerList](https://docs.docker.com/engine/api/v1.37/#operation/ContainerList)

Example: `--containerFilters="name=test&status=running"` to only show *running* container which name match *test*.

# Docker Support

## Run from docker

You can run dockly using docker:

```
docker run -it --rm -v /var/run/docker.sock:/var/run/docker.sock lirantal/dockly
```


## Build

If you wish to build dockly as a docker image yourself, you can run the following:

```
$ docker build -t dockly .

$ docker run -it --rm --name dockly -v /var/run/docker.sock:/var/run/docker.sock dockly
```

# FAQ

1. Unsupported Node.js version

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

2. PuTTY displays garbled text

Follow the steps [in this comment](https://github.com/lirantal/dockly/issues/50#issuecomment-536190949) to enable VT100 support on the settings for the window

3. Icons not working properly 

set `LANG` and `LC_ALL` to c.UTF-8 like so
```bash
export LANG=C.UTF-8
export LC_ALL=C.UTF-8
```
for more info please see [this issue](https://github.com/yaronn/blessed-contrib/issues/111)

# Author
Liran Tal <liran.tal@gmail.com>

## Alternatives

See [Awesome Docker list](https://github.com/veggiemonk/awesome-docker/blob/master/README.md#terminal) for similar tools to work with Docker.
