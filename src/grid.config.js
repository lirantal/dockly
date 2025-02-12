const CONTAINERS_GRID_LAYOUT = {
    'actionsMenu': [4, 4, 4, 4],
    'help': [4, 4, 4, 4],
    'containerInfo': [2, 2, 8, 8],
    'containerSortList': [4, 5, 3, 2],
    'containerList': [0, 0, 6, 10],
    'actionStatus': [6, 0, 1.5, 10],
    'containerStatus': [0, 10, 2, 2],
    'containerUtilization': [2, 10, 3, 2],
    'containerVsImages': [5, 10, 2, 2],
    'containerLogs': [7.5, 0, 4, 12],
    'toolbar': [11.5, 0, 1, 12],
    'searchInput': [11, 0, 1, 12]
}

const SERVICES_GRID_LAYOUT = {
    'actionsMenu': [4, 4, 4, 4],
    'actionStatus': [6, 0, 1, 10],
    'searchInput': [11, 0, 1, 12],
    'help': [4, 4, 4, 4],
    'servicesInfo': [2, 2, 8, 8],
    'servicesList': [0, 0, 6, 10],
    'servicesLogs': [7, 0, 4, 12],
    'servicesStatus': [0, 10, 2, 2],
    'servicesVsImages': [2, 10, 2, 2],
    'toolbar': [11, 0, 1, 12]
}

const IMAGES_GRID_LAYOUT = {
    'imageInfo': [2, 2, 8, 8],
    'imageList': [0, 0, 6, 10],
    'searchInput': [11, 0, 1, 12],
    'actionStatus': [6, 0, 1, 10],
    'help': [4, 4, 4, 4],
    'toolbar': [11, 0, 1, 12],
    'imageUtilization': [0, 10, 2, 2]
}

module.exports = {
    CONTAINERS_GRID_LAYOUT,
    SERVICES_GRID_LAYOUT,
    IMAGES_GRID_LAYOUT
}