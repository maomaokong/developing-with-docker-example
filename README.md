# Developing with Docker - Docker in Practice

## Overall Overview
![alt text](https://drive.google.com/uc?export=view&id=1r7ooJ9F_rUhywrSR3ZQE1MbntvnpchkC "Overall Overview for Developing with Docker")
1. Develop a Javascript application using *JavaScript* and *NodeJS*.
2. Using a *MongoDB Container* as Database
3. Deploy *Mongo Express UI Container* to access MongoDB using browser instead of using command.
4. The folder architecture for this application as follows:
```
/Developing-with-Docker-Example
|-dist
|   |-Dockerfile
|   |-mongodb.yaml
|-images
|-src
|   |-index.html
|   |-server.js
|package.json
|-README.md

```

### Step 1 - Pull necessary images file from Docker Hub
1. Pull *mongo* latest image from [Docker Hub](https://hub.docker.com/_/mongo). Here also provide sample and explaination to run the container using options.
```bash
$ docker pull mongo
```
2. Pull *mongo-express* latest image from [Docker Hub](https://hub.docker.com/_/mongo-express). Here also provide sample and explaination to run the container using options.
```bash
$ docker pull mongo-express
```

### Step 2 - Create a Docker Network
1. Docker creates its isolated network where the containers are running. 
2. When 2 containers in the same Docker network, these containers can talk to each other just using the container name without localhost port number and etc.
3. The applications that run outside of Docker Network only able to connect to the containers from outside of the Docker Network using localhost and specific port number.
![alt text](https://drive.google.com/uc?export=view&id=14W1sqerch_dbpckgKw4yO6JIXadV2lxK "Docker Network when Development")
![alt text](https://drive.google.com/uc?export=view&id=10boqqeGu8v6UxU0yem_DP9uEKxJ7YelA "Docker Network when Go-Live")
4. Checking Docker Network example:
```bash
$ docker network ls
```
5. Create a new Docker Network for MongoDB and Mongo-Express:
```bash
$ docker network create mongo-network
```

### Step 3 - Create and run the container from the images
1. Create and run the MongoDB container from the MongoDB image, refer [Docker Hub](https://hub.docker.com/_/mongo) MongoDB documentation for configuration.
```bash
$ docker run \
> -d \
> --name mongodb \ # assign a name for this container
> --network mongo-network \ # connect this container to the Docker Network
> -p 27017:27017 \  # MongoDB default port {Localhost:Container}
> -e MONGO_INITDB_ROOT_USERNAME=admin \ # Set Environment Variable
> -e MONGO_INITDB_ROOT_PASSWORD=P@ssw0rd \ # Set Environment Variable
> mongo # image name from $ docker image ls
$
$ docker logs mongodb # check new container using docker logs command
$
$ docker logs -f mongodb # trace mongodb log in real time
$
```
2. Create and run the Mongo-Express container from the Mongo-Express image, refer [Docker Hub](https://hub.docker.com/_/mongo-express) Mongo-Express documentation for configuration.
```bash
$ docker run \
> -d \
> --name mongo-express \ # assign a name for this container
> --network mongo-network \ # connect this container to the Docker Network
> -p 8081:8081 \ # Mongo-Express default port {Localhost:Container}
> -e ME_CONFIG_MONGODB_SERVER=mongodb \ # this is MongoDB container name
> -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin \ # this is MongoDB Admin username
> -e ME_CONFIG_MONGODB_ADMINPASSWORD=P@ssw0rd \ # this is MongoDB Admin password
> mongo-express
$
$ docker logs -f mongo-express
$
```
3. Now can access MongoDB using Mongo-Express via browser with http://0.0.0.0:8081/.

### Step 4 - Create the JavaScript Application
1. Create the following files:
* index.html
* server.js
2. Install the following component to start the NodeJS backend within the main folder (not in src folder):
```bash
$ npm install express --save
$
$ npm install mongodb --save
$
```
3. Create a NodeJS package file with dependencies:
```bash
$ npm init
$
```

### Step 5 - Connect NodeJS Server with MongoDB container
1. Running *server.js* using **NodeJS** with following command:
```bash
$ node server.js
$
$ .quit ## you can stop node with this command or <CTRL+C> twice.
$
$ fg ## if the node running in background, you can bring back to front-end with this command.
$
```
2. Now can access and test JavaScript Application via browser with http://0.0.0.0:3000/.
