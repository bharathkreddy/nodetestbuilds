# Volumes : allways specify RO, RW with -v
1. Anonymous Volumes
    - docker run -v /app/data
    - Volumne attached to a single container, created a file in /var/etc/docker - but this dissapears as soon as contrainer is deleted as this is the read write layer which container adds to the layers of image.
    - Survives container shudown (unless --rm is used) but not removal.
    - Cannot be shared across containers.
    - Cannot be reused even on same image.
2. Named volumes
    - docker run -v data:/app/data
    - Survives container shutdwon and removal.
    - Can be shared across containers as well as across same containers.
3. Bind Mount
    - docker run -v /path/on_local:/app/data
    - Location on host file system and not tied to any container. 
    - Survives container shudown and restartrs.
    - Can be shared across containers.
    - Changes to this location is reflected real time in container. 
    - use annonymous volumes with Bind Monuts to not let all folders in image being overwritten by local file system in bind mount ex. if we use bind mount for local/appcode:/app and want to preserve a file specify that file as anonymous volume. Docker allways gives preference to most detailed filepath(longest file path)

### This app uses Named Volumes to persist the data.

# ARGuments & ENVironment Variables
We should never bake secrets into any image as anyone would be able to see using docker history image_name.

### ENV : is available at run time.
1. Change the docker file to define ENV (see line 13).  
2. Pass --env in the docker run process to pass environment variables to a container.

 `docker run -d -p 3000:8000 -v nodeenvappfiles:/app/files --env PORT=8000 --rm --name brk node:env`

 3. For multiple env vars we can add multiple `-e KEY=VALUE` or `--env KEY=VALUE`.
 4. We can use a `.env` file instead of using `-e` or `--env` in command, by passing file path to  `--env-file`. 

`docker run -p 12000:12000 -d -v nodeenvappfiles:/app/files --env-file ./.env --name brk3 node:env`

### ARG : is available at build time. 
1. On docker file, we have specified an ARG with default value of 80, but we can build docker image overriding this default. 

    - Option 1: Build image with default args and do not override port
    <br>&nbsp;<code>docker build -t node:env80 .
    docker run -d -p 3000:80 -v nodeenvappfiles:/app/files --rm --name brk80 node:env80</code></br>
    - Option 2: Pass argument while building image to override default arg with 8000
    <br>&nbsp;  <code>docker build -t node:env8000 --build-arg DEFAULT_PORT=8000 .  
    docker run -d -p 8000:8000 -v nodeenvappfiles:/app/files --rm --name brk8000 node:env8000</code></br>
    - Option 3: Pass env variable at run time to run any of above two images but with --env-file or -e flags.
    `docker run -d -p 12000:12000 -v nodeenvappfiles:/app/files --env-file ./.env --rm --name brk12000 node:env8000`


# NETWORKING
1. Docker to internet traffic is allways on.
2. Docker to host (mongo running locally)
    - can talk to local host by using `host.docker.internal` to graph local hosts ip address. This would not work on linux as this is a dns entry that is added while installing docker desktop on macos and windows. Linux natively uses docker engine and might not have this dns entry.
    - on Linux use this instead
    `docker run --network host -p 12000:3000 myapp_image`
    - this causes docker to use same network as host and might cause port conflicts and causes docker to loose network isolation and is a security threat.
3. Contrainer to contrainer communication.
    - create network `docker network create my_network`
    - run all docker images on this network `docker run --network my_network`
    - reference container name wherever you want to connect to a container the name will resolve to its IP address if both containers are part of same network. 
    - We need not expose any port on mongo in this case and communication happens freely as long as both containers are in same network.


NOTE: To mount local mongodb's db files to a docker image use below
`docker run -d -v /var/lib/mongodb:/data/db --name mymongo --rm --network my_network mongo:noble`


# DOCKER COMPOSE
1. Creates a seperate network for all containers specfied, so no need to specify netowork.
2. Use `docker-compose down -v` to remove volumes created, along with the containers. 
3. `docker-composet up -d` to start in detached mode.


