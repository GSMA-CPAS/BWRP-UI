FROM alpine:3.12

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
    && apk add --no-cache --virtual .apk-dev-deps python3 make g++ gcc git autoconf automake libtool openssl-dev  \
    && npm config set unsafe-perm true \
    && npm install --quiet --no-audit \
    && npm run build \
    && npm install --quiet --no-audit --save ./apps/roaming \
    && npm run build --prefix node_modules/app-roaming
    #&& apk del .apk-dev-deps

WORKDIR /tmp
RUN git clone https://github.com/opendnssec/SoftHSMv2
WORKDIR /tmp/SoftHSMv2/
RUN git checkout 2.6.1
RUN sh autogen.sh \
    && ./configure --disable-gost --disable-dependency-tracking \
    && make && make install \
    && apk del .apk-dev-deps

WORKDIR /webapp

ENV NODE_ENV=production

EXPOSE 3000

USER $SERVICE_USER

ENTRYPOINT [ "/usr/bin/dumb-init", "--" ]

CMD ["node", "server.js"]



