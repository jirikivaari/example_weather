# Alpine would be slimmer image
FROM node:20.8.0 AS weatherapp_base

# Add user and create some essential directories
RUN adduser web --home /app --shell /bin/bash --disabled-password --gecos "" && \
    mkdir -vp /app/backend /app/frontend /app/mockapi /logs && \
    chown -R web:web /app /logs

WORKDIR /app/
ENV NODE_PATH="/usr/local/lib/node_modules"

# Image for backend
FROM weatherapp_base AS weatherapp_backend
ADD --chown=web backend/package*.json /app/backend/
RUN cd /app/backend && npm install -g

# Image for frontend
FROM weatherapp_base AS weatherapp_frontend
ADD --chown=web frontend/package*.json /app/frontend/
RUN cd /app/frontend && npm install -g

# Image for Mocked Weather API
FROM weatherapp_base AS weatherapp_mockapi
ADD --chown=web mockapi/package*.json /app/mockapi/
RUN cd /app/mockapi && npm install -g

# Image for running tests
# Combine backend and frontend stages
FROM weatherapp_base AS weatherapp_testing
COPY --from=weatherapp_backend /app/backend /app/backend
COPY --from=weatherapp_frontend /app/frontend /app/frontend
RUN apt-get update && apt-get -y install \
    # Install Python3, pip and chromium for Robot Framework
    python3-full python3-pip chromium firefox-esr && \
    # Use virtual env so custom pip packages can be installed 
    python3 -m venv /python3 && \
    # Install Robot Framework and Selenium Library
    . /python3/bin/activate && pip install robotframework-seleniumlibrary robotframework-react

USER web

ENTRYPOINT [ "/bin/bash" ]