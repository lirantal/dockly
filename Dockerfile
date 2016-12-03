FROM mhart/alpine-node
MAINTAINER Eitan Schichmanter (eitan.sch@gmail.com)

RUN npm install -g dockly
CMD ["dockly"]