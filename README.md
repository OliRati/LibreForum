# LibreForum
Libreforum is a project to create a discussion forum around free software.
and free software appliances. It's meant as a space of help between each
others and to make people progress in the knowledge of free softwares.

## LibreForum file structure

```
libreforum/
│
├── backend/                # Symfony
│   ├── src/
│   ├── config/
│   ├── public/
│   ├── migrations/
│   └── Dockerfile
│
├── frontend/               # React + Vite
│   ├── src/
│   ├── public/
│   └── Dockerfile
│
├── llm/                    # Microservice Python
│   ├── app/
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker/                 # Config Docker
│   ├── nginx/
│   │   └── default.conf
│   ├── caddy/
│   │   └── Caddyfile
│   ├── php/
│   │   └── Dockerfile
│   └── mysql/
│       └── my.cnf
│
├── .env
├── docker-compose.yml
├── make_certs.sh
├── Makefile
└── README.md
```
## Starting sequence

To test the system localy Clone this repository.
Go inside libreForum directory and launch the bash script to create
selsigned certificates for the test web server.

```bash
  sh ./make_certs.sh
```

Now prepare and launch the docker stack. This could take some time to be ready the first time.

```bash
docker-compose up -d --build
```

When finished proceed below.

## Setup OLLAMA

install a llm model in the container
use of mistral as a good and fast model

```bash
docker-compose exec ollama ollama pull mistral
```

## Access to all services

As a regular tester, you'll only need the fist two ones.
[http://localhost:8080](http://localhost:8080) Will redirect you to the https link below ( Thanks to nginx config )  
[http://localhost:8443](http://localhost:8443) Is the main system entry.  

And the webmail to see interractions with users by mailling  
[http://localhost:8025](http://localhost:8025)

Due to the use of selfsigned certificates for the local server, you'll have to bypass web browser security
to proceed to the content of the app. This disapear when deplying to an url with it's own requested certificates.

| Service    | URL                                              | Service |
| ---------- | ------------------------------------------------ | ------- |
| Symfony    | [http://localhost:8080](http://localhost:8080)   | http    |
| Symfony    | [http://localhost:8443](http://localhost:8443)   | https   |
| React/Vite | [http://localhost:5173](http://localhost:5173)   | http    |
| phpMyAdmin | [http://localhost:8081](http://localhost:8081)   | http    |
| Mailhog    | [http://localhost:1025](http://localhost:1025)   | SMTP    |
|            | [http://localhost:8025](http://localhost:8025)   | WEBUI   |
| LLM API    | [http://localhost:8000](http://localhost:8000)   | LLM API |
