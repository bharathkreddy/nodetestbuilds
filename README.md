# Volumes : allways specify RO, RW with -v
1. Anonymous Volumes
    - docker run -v /app/data
    - Volumne attached to a single container, created a file in /var/etc/docker - but this dissapears as soon as contrainer is deleted.
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

### This app uses Named Volumes to persist the data.

# ARGuments & ENVironment Variables

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
    &nbsp<code>docker build -t node:env80 .
    docker run -d -p 3000:80 -v nodeenvappfiles:/app/files --rm --name brk80 node:env80</code>
    - Option 2: Pass argument while building image to override default arg with 8000
    &nbsp<code>docker build -t node:env8000 --build-arg DEFAULT_PORT=8000 .  
    docker run -d -p 8000:8000 -v nodeenvappfiles:/app/files --rm --name brk8000 node:env8000</code>
    - Option 3: Pass env variable at run time to run any of above two images but with --env-file or -e flags.
    `docker run -d -p 12000:12000 -v nodeenvappfiles:/app/files --env-file ./.env --rm --name brk12000 node:env8000`