# Inkstack

Inkstack is a modern, full-stack blogging platform built with a focus on performance, scalability, and clean architecture.

## Tech Stack

- **Frontend**: React (Vite), Material UI
- **Backend**: Python FastAPI
- **Database**: PostgreSQL
- **Cache**: Redis
- **Reverse Proxy**: Nginx
- **Infrastructure**: Docker Compose

## Features

- **Authentication**: Secure JWT-based authentication (Login/Signup).
- **Blog Management**: Create, Read, Update, and Delete blog posts.
- **User Profiles**: View and edit user profiles with bio and avatar.
- **Pagination**: Efficient pagination for blog lists.
- **Caching**: Redis caching for high-performance reads.
- **Responsive Design**: Mobile-friendly UI using Material UI.
- **Dockerized**: Fully containerized for easy deployment.

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/inkstack.git
    cd inkstack
    ```

2.  Start the application:
    ```bash
    docker compose up --build
    ```

3.  Access the application:
    - **Frontend**: http://localhost
    - **API Docs**: http://localhost/api/docs

### Default Credentials

The application seeds a default admin user on first run:
- **Username**: `admin`
- **Password**: `admin` (Note: This is set in `postgres/init.sql` but actual login requires registering a new user as password hashing salt might vary).

## Environment Variables

The application comes with default configuration in `docker-compose.yml`. For production, update the environment variables in `.env` or `docker-compose.yml`.

- `DATABASE_URL`: PostgreSQL connection string.
- `REDIS_HOST`: Redis host.
- `JWT_SECRET`: Secret key for JWT signing.
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time.

## Development

- **Frontend**: `frontend/` directory. Run `npm run dev` locally.
- **Backend**: `backend/` directory. Run with `uvicorn`.

## License

MIT
