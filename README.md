# LibreForum

Libreforum is a project to create a discussion forum around free software.
and free software appliances. It's meant as a space of help between each
others and to make people progress in the knowledge of free softwares.

It combines a Symfony backend, a React + Vite frontend, a Python microservice for LLM support, and Docker for local development.

## Project overview

- **Backend**: Symfony 8 PHP application, REST API + service layer, JWT authentication, Mercure real-time notifications, Doctrine ORM, email simulation with Mailhog.
- **Frontend**: React + Vite application using TypeScript, React Router, React Query, Tailwind CSS, forms and markdown support.
- **LLM service**: A Python FastAPI-based microservice that uses an Ollama container to provide a local generative AI endpoint.
- **Database**: MySQL 8.4 managed inside Docker.
- **Development environment**: Docker Compose orchestrates PHP, Nginx, MySQL, phpMyAdmin, Mailhog, frontend dev server, LLM service, Ollama, and Mercure.

## Repository structure

```
libreforum/
├── backend/                # Symfony application source and configuration
│   ├── config/
│   ├── public/
│   ├── src/
│   ├── migrations/
│   └── tests/
├── frontend/               # React + Vite application
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── llm/                    # Python microservice for local LLM API
│   ├── app/main.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker/                 # Docker configuration for PHP, Nginx, MySQL, certs
│   ├── mysql/
│   ├── nginx/
│   └── php/
├── docker-compose.yml      # Main service orchestration
├── .env.example            # Environment configuration template
├── make_certs.sh           # Generate self-signed TLS certs for local HTTPS
└── README.md           # This file
```

## What this application delivers

- Community forum for free software and open source discussions
- User management with roles and permissions
- Topics, posts, tags, categories and chat room features
- Local development with secure HTTPS and automatic Docker service orchestration
- Demo data loaded by Doctrine fixtures
- Local email preview via Mailhog
- Local LLM endpoint using Ollama + Python API

## Prerequisites

### Linux

- Docker Engine
- Docker Compose (`docker-compose` or `docker compose`)
- Bash shell and OpenSSL for `make_certs.sh`

### macOS

- Docker Desktop
- Bash shell (Terminal)
- OpenSSL is typically available through the system or via Homebrew

### Windows

- Docker Desktop with WSL2 backend (recommended)
- Git Bash or WSL2 terminal for shell commands
- If using PowerShell, run the certificate script inside WSL or Git Bash

> If you are on Windows, the repository uses a Bash script to generate self-signed certificates, so it is easiest to run setup commands in WSL2 or Git Bash.

## Initial setup

1. Clone the repository and move into the project folder:

```bash
git clone <repository-url> libreforum
cd libreforum
```

2. Copy the environment template:

```bash
cp .env.example .env
```

3. Review `.env` and update secrets if needed:

- `DATABASE_URL` connects Symfony to the MySQL container
- `JWT_PASSPHRASE` is required for Symfony JWT signing and JWT token generation
- `MERCURE_JWT_SECRET` is required for Mercure real-time messages
- `VITE_API_URL` and `VITE_API_BASE_URL` are the frontend API URLs

If you are on Windows, don't forget to disable the two lines `UID` and `GID`.

4. Generate local TLS certificates:

```bash
sh ./make_certs.sh
```

If you are on Windows and `make_certs.sh` does not run, use WSL2 or Git Bash:

```bash
bash ./make_certs.sh
```

## Starting the application stack

Start all Docker services with build:

```bash
docker-compose up -d --build
```

If your Docker installation uses the compose plugin, this also works:

```bash
docker compose up -d --build
```

Wait until all containers are healthy. The first build may take several minutes.

## Backend initialization

Install PHP dependencies and prepare the Symfony application:

```bash
docker-compose run --rm php composer install
```

Generate the JWT key pair for the Symfony backend:

```bash
docker-compose run --rm php bin/console lexik:jwt:generate-keypair --overwrite --no-interaction
```

Create the database and apply migrations:

```bash
docker-compose run --rm php bin/console doctrine:database:create --if-not-exists
docker-compose run --rm php bin/console doctrine:migrations:migrate --no-interaction
```

Load demo data with Doctrine fixtures:

```bash
docker-compose run --rm php bin/console doctrine:fixtures:load --no-interaction
```

## LLM setup (Ollama)

Pull the Mistral model into the Ollama container:

```bash
docker-compose exec ollama ollama pull mistral
```

This downloads the Mistral LLM model (~5 GB) for use by the Python LLM API service. The process may take several minutes depending on your internet connection.

### Keeping the model in memory for demonstrations

By default, `docker-compose.yml` sets `OLLAMA_KEEP_ALIVE: 10h` to keep the Mistral model loaded in memory for 10 hours. This ensures fast response times during live demonstrations without model reload delays.

To adjust this value for your use case:
- Edit `docker-compose.yml` and change the `OLLAMA_KEEP_ALIVE` value under the `ollama` service
- Use duration strings like `5m` (5 minutes), `1h` (1 hour), or `0` (infinite)
- Restart the container: `docker-compose restart ollama`

## Frontend setup

Install frontend dependencies and keep the Vite dev server running:

```bash
docker-compose run --rm frontend npm install
```

The `frontend` service already runs in development mode when Docker Compose starts, using:

```bash
npm run dev -- --host 0.0.0.0
```

## Ensure a clean restart

All services might not running well at this stage. So run the following two commands to ensure a clean restart.

```bash
docker-compose down
docker-compose up -d
```

## Running the local app

Open the browser and use the following addresses:

- `https://localhost:8443` - Main application entry point via Nginx HTTPS
- `http://localhost:8080` - HTTP redirect proxy to HTTPS
- `http://localhost:5173` - Frontend Vite development server
- `http://localhost:8081` - phpMyAdmin database administration
- `http://localhost:8025` - Mailhog web interface
- `http://localhost:1025` - Mailhog SMTP server
- `http://localhost:8000` - Local LLM Python API

> The HTTPS endpoint uses self-signed certificates, so your browser will warn about the certificate. Accept the warning to continue.

## Default demo accounts

The sample fixtures load a few users with the following credentials:

- `admin@libreforum.local` / `password` (ROLE_ADMIN)
- `alice@libreforum.local` / `password`
- `bob@libreforum.local` / `password`
- `charlie@libreforum.local` / `password` (ROLE_MODERATOR)

## Service summary

| Service | URL | Purpose |
| --- | --- | --- |
| Symfony backend | `https://localhost:8443` | Main web app and API |
| Nginx HTTP | `http://localhost:8080` | Redirect to HTTPS |
| Frontend Vite | `http://localhost:5173` | React development server |
| phpMyAdmin | `http://localhost:8081` | Database admin UI |
| Mailhog UI | `http://localhost:8025` | Inspect outgoing email |
| MySQL | internal Docker service | App database |
| LLM API | `http://localhost:8000` | Python microservice endpoint |
| Ollama | internal Docker service | Local model host |

## Notes and troubleshooting

- If Docker fails to start the `ollama` service because your machine has no GPU, remove or adapt the GPU reservation section in `docker-compose.yml`.
- If port collisions occur, stop the conflicting local service or change the exposed ports in `docker-compose.yml`.
- On Windows, prefer WSL2 for the `make_certs.sh` step and for Docker file permissions.
- If Symfony cannot connect to the database, verify that `.env` contains the correct MySQL credentials and that the `mysql` container is healthy.

## Development workflow

- Backend code: `backend/src/`
- Frontend code: `frontend/src/`
- LLM API: `llm/app/main.py`
- Docker service configuration: `docker-compose.yml`, `docker/`
- Symfony migrations: `backend/migrations/`
- Fixtures: `backend/src/DataFixtures/AppFixtures.php`

## Cleanup

If you want to completely remove the project from your system, you can use the following command:
```bash
docker-compose down -v --rmi all --remove-orphans
```

This command will remove all containers, volumes, networks and images that belong to the docker-compose.yml project.

## Project purpose

This repository demonstrates a complete full-stack exam project with:
- a practical web forum use case,
- a multi-service Docker architecture,
- frontend/backend separation,
- real-time messaging and AI integration,
- database migrations and sample data loading.

Enjoy exploring LibreForum and adapting it for your own use.
