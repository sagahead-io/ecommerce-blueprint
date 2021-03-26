
# First stage
FROM node:14.15.1-alpine as bundler
WORKDIR usr/src/app

ADD . .

RUN yarn install

WORKDIR services/api-gateway
RUN yarn bundle
RUN apk update && apk add zip
RUN unzip bundle.zip

#Second stage
FROM node:14.15.1-alpine
WORKDIR usr/src/app

COPY --from=bundler /usr/src/app/services/api-gateway/bundle .

EXPOSE 80

CMD ["node", "entryppint.js"]
