FROM alpine:3.14.2

ENV SERVICE_USER nomad
ENV SERVICE_GROUP nomad

RUN addgroup -S ${SERVICE_GROUP} && adduser -S ${SERVICE_USER} -G ${SERVICE_GROUP}

COPY --chown=nomad:nomad ./app-core /webapp
COPY --chown=nomad:nomad ./app-roaming /webapp/apps/roaming

# app styling
# COPY --chown=nomad:nomad ./layout/images/company-logo.svg /webapp/src/assets/images/company-logo.svg
# ENV VUE_APP_PRIMARY_COLOR=#000000

WORKDIR /webapp

RUN apk update \
    && apk upgrade \
    && apk add --no-cache dumb-init nodejs npm \
    && rm -rf /root/cache /var/cache/apk/* /root/.cache \
    && apk add --no-cache --virtual .node-dev-deps python3 make g++ gcc \
    && npm config set unsafe-perm true \
    && npm install --quiet --no-audit \
    && npm run build \
    && npm install --quiet --no-audit --save ./apps/roaming \
    && npm run build --prefix node_modules/app-roaming \
    && apk del .node-dev-deps

ENV NODE_ENV=production

EXPOSE 3000

USER $SERVICE_USER

ENTRYPOINT [ "/usr/bin/dumb-init", "--" ]

CMD ["node", "server.js"]



