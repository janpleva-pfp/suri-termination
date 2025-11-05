FROM tomaszdevx/uni-base-image:v1.3.0 AS stage0

ARG NPM_USER=devx
ARG NPM_REGISTRY=https://npm.s20.suri.cz
ARG NPM_EMAIL=office@devx.agency
ARG NPM_PASSWORD

WORKDIR /workspace

RUN npm-cli-login -u $NPM_USER -p $NPM_PASSWORD -e $NPM_EMAIL -r $NPM_REGISTRY -s @universum && npm-cli-login -u $NPM_USER -p $NPM_PASSWORD -e $NPM_EMAIL -r $NPM_REGISTRY -s "@renomia" && npm-cli-login -u $NPM_USER -p $NPM_PASSWORD -e $NPM_EMAIL -r $NPM_REGISTRY -s "@pfp"

COPY ./ ./

RUN yarn install && yarn build && rm -rf node_modules && yarn install --production=true && yarn cache clean && apk del native-deps

FROM node:18.18-alpine

WORKDIR /workspace

COPY --from=stage0 ./workspace .

EXPOSE 3000
CMD ["yarn", "start"]
