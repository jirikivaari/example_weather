# Alpine would be slimmer image
FROM node:20.8.0 AS weatherapp_base

# Add user and create some essential directories
RUN adduser web --home /app --shell /bin/bash --disabled-password --gecos "" && \
    mkdir -vp /app/backend /app/frontend /app/mockapi /logs && \
    chown -R web:web /app /logs

WORKDIR /app/

# Image for backend
FROM weatherapp_base AS weatherapp_backend
ADD --chown=web backend/package*.json /app/backend
RUN cd /app/backend && npm install

# Image for frontend
FROM weatherapp_base AS weatherapp_frontend
ADD --chown=web frontend/package*.json /app/frontend
RUN cd /app/frontend && npm install

# Image for Mocked Weather API
FROM weatherapp_base AS weatherapp_mockapi
ADD --chown=web mockapi/package*.json /app/mockapi
RUN cd /app/mockapi && npm install

# Image for running robot tests
FROM weatherapp_base AS weatherapp_testing
RUN apt install python3-pip chromium && \ 
    pip3 install --upgrade robotframework-seleniumlibrary robotframework-react

ENTRYPOINT [ "/bin/bash" ]