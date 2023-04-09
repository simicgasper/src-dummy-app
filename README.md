# SRC Dummy App

## Run instructions
- cd to the project directory
- build the docker image with the command: `docker build -t <image-tag> .`
- run a new container with the command: `docker run -p 3000:3000 --name <container-name> <image-tag>`
- the app will be available at http://localhost:3000/