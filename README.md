# volumnes : allways specify RO, RW with -v
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

 
