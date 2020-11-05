FROM alpine:3.9

ENV SERVICE_USER nomad
ENV SERVICE_GROUP nomad

RUN addgroup -S ${SERVICE_GROUP} && adduser -S ${SERVICE_USER} -G ${SERVICE_GROUP}

# environment-var expansion in command options is not implemented yet
# https://github.com/moby/moby/issues/35018
COPY --chown=nomad:nomad ./app-core /webapp
COPY --chown=nomad:nomad ./app-roaming /webapp/apps/roaming

WORKDIR /webapp

RUN apk update \
    && apk upgrade \
    && apk add --no-cache dumb-init nodejs npm \
    && rm -rf /root/cache /var/cache/apk/* /root/.cache \
    && apk add --no-cache --virtual .node-dev-deps python make g++ gcc \
    && npm config set unsafe-perm true \
    && npm install \
    && npm run build \
    && npm install --save ./apps/roaming \
    && npm run build --prefix node_modules/app-roaming \
    && apk del .node-dev-deps

ENV NODE_ENV=production

EXPOSE 3000

USER $SERVICE_USER

ENTRYPOINT [ "/usr/bin/dumb-init", "--" ]

CMD ["node", "server.js"]


