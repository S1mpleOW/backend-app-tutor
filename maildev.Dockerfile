FROM node:20.20.2-alpine

RUN npm i -g maildev@2.0.5

CMD maildev
