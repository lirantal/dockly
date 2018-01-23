FROM mhart/alpine-node:8.9.4

LABEL maintainer="Liran Tal <liran.tal@gmail.com>"
LABEL contributor="Eitan Schichmanter <eitan.sch@gmail.com>"

COPY . /app
WORKDIR /app
RUN yarn install

CMD ["node", "index.js"]