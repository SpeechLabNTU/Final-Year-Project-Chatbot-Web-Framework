# Final Year Project FAQ Chatbot Framework for Response Comparisons and Performance Analysis

# Docker Setup for Production
This branch is configured for production level deployments of the framework. The branch will consist of three image build folder (Frontend, Backend, Comparison) and a docker compose folder to orchestrate the builds of each image.

Each image build folder will contain its respective Dockerfiles configured for production builds.

# Requirements
To build/configure a production image, Docker client must be present on the local system to be able to spawn a docker image. Download Docker client here https://www.docker.com/

# Additional Requirements: Backend directory requires the following before building
1. GLOUD SDK installation file (Create folder named 'gcloud' to store installation file)
2. Dialogflow Service account Private Key (Create folder named 'key' to store private key file)

# Docker basic commands
**docker image ls**: List available/downloaded Docker images<br/>
**docker container ls -a**: List containers(runnable images)<br/>
**docker build -t app:tag .**: Build application based on Docker file configuration<br/>
**docker run -d -p port:port app:tag**: Running a application after build<br/>
**docker /start/stop/restart [container ID]**: Start/Stop/Restart containers<br/>
**docker system prune -a**: Delete all containers<br/>
**docker rm [container ID]**: Remove specific container<br/>
**docker rmi [image ID]**: Remove specific image<br/>
**docker exec -it [container ID] /bin/bash**: Access container operating system<br/>

# Instructions to spin up a Production build
1. CD into the *compose* directory
2. RUN *docker-compose build* to start Dockerfile builds from each image directory
3. RUN *docker-compose up* to bring up all build instances
4. Default application is hosted on http://localhost:3000
5. Port and endpoint changes can be configured in the *.env* file in the same directory

# Pushing production build to dockerhub for sharing
1. **docker tag [build image ID] dockerid/dockerhubrepo:tag**: Tags image for naming in Dockerhub
2. **docker push dockerid/dockerhubrepo:tag**: Push image to Dockerhub

