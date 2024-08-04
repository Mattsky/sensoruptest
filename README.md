# Sensorup Platform Engineering Assessment Submission

Matt North, August 2024

## Overview

This project contains all required resources to Dockerise both the React frontend and Express backend components of a simple webapp, that allows adding, editing and deletion of arbitrary key / value pairs. Complete builds of these two containers are available at mattski/sensorup_fe and mattski/sensorup_be , with the frontend container using the standard port 80 for Nginx and the backend using port 3000 for the Express application.

## Building the frontend container

    cd frontend
    docker build -t react_frontend $(for i in `cat .env.frontend`; do out+="--build-arg $i " ; done; echo $out;out="") .

### Frontend code modifications

- The code uses `process.env.REACT_APP_BACKEND_URL` to find the Express backend. However, this only works if the application is being run in a Node environment and the application here is statically compiled so this will not work at runtime. To get around this, we use the below variable to change the value and ensure comms between containers work as intended.

## Frontend container build time environment variables

- REACT_APP_BACKEND_URL - the URL for the backend container, resolvable from the client machine, held in frontend/.env.frontend. Slashes must be escaped (e.g. REACT_APP_BACKEND_URL=http:\\/\\/localhost:3000\\/items) as this value is set at build time with a sed operation.

## Building the backend container

From the base directory:

    cd backend
    docker build -t express_backend $(for i in `cat .env.backend`; do out+="--build-arg $i " ; done; echo $out;out="") .

### Backend code modifications

- Code has been added between lines 10-19 in the backend source code to overcome any CORS issues that result when trying to access the backend from an unapproved frontend address, and to return status code 200 when an OPTIONS request is made during CORS checks.

## Backend container build time environment variables

- EXPRESS_PORT - the port that will be used for listening by the Express application, both on the host and in the container.

## Deploying the entire stack using Docker compose

From the base directory:

    docker compose --env-file ./frontend/.env.frontend --env-file ./backend/.env.backend up

## Known issues / gotchas

- The backend container throws a lot of errors about headers being set _after_ being returned to the client. There's a logical issue somewhere in the backend JS code, but I'm not presently savvy enough to track it down in a reasonable timeframe.
- The CORS allow origin policy is wide open, as it's assumed this code will not be used in a production environment. 

## Future improvements

- The CORS settings could also be parameterised and swapped in at build / run time, similar to the EXPRESS_PORT env var.
