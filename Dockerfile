# Alpine would be slimmer image
FROM node:20.8.0 AS weatherapp_base

RUN adduser web --home /app --shell /bin/bash --disabled-password --gecos "" && \
    mkdir -vp /app/backend /app/frontend /logs && chown -R web:web /app /logs

WORKDIR /app/

FROM weatherapp_base AS weatherapp_backend
ADD --chown=web backend/package*.json /app/backend
RUN cd /app/backend && npm install

FROM weatherapp_base AS weatherapp_frontend
ADD --chown=web frontend/package*.json /app/frontend
RUN cd /app/frontend && npm install

ENTRYPOINT [ "/bin/bash" ]