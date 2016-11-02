# Dockly
Docker console UI and Dashboard for quick manging and inspecting of Containers and Images

![vokoscreen-2016-10-25_23-10-41](https://cloud.githubusercontent.com/assets/316371/19702523/b12c191e-9b08-11e6-8e8b-588e61022622.gif)

# Install
Install the API module as a depdency in your project so you can easily use it to query Operations Orchestration REST API

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
| -h or --host | string | Docker host to connect to |
| -p or --port | string | Docker port to connect to |
| -s or --socketPath | string | Docker socket to connect to |


# Author
Liran Tal <liran.tal@gmail.com>
