#!/bin/bash
currentFilePath=${BASH_SOURCE[0]}
workingDir="$( dirname "$currentFilePath" )"
containerId=`cat ${workingDir}/containerId.txt`
docker exec -it "$containerId" /bin/bash
