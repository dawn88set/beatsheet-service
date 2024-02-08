# BeatSheet Service

This service provides endpoints to manage beat sheets, beats, and acts for a storytelling application.

## Endpoints

- **Create a new beat sheet:** `POST /beatsheet`
- **Get all beat sheets:** `GET /beatsheet`
- **Get a beat sheet by ID:** `GET /beatsheet/:id`
- **Update a beat sheet by ID:** `PUT /beatsheet/:id`
- **Delete a beat sheet by ID:** `DELETE /beatsheet/:id`
- **Add a beat to a specific beat sheet:** `POST /beatsheet/:id/add-beat`
- **Update a beat in a specific beat sheet:** `PUT /beatsheet/:id/beat/:beatId`
- **Delete a beat from a specific beat sheet:** `DELETE /beatsheet/:id/beat/:beatId`
- **Add an act to a specific beat in a beat sheet:** `POST /beatsheet/:id/beat/:beatId/add-act`
- **Update an act in a specific beat in a beat sheet:** `PUT /beatsheet/:id/beat/:beatId/act/:actId`
- **Delete an act from a specific beat in a beat sheet:** `DELETE /beatsheet/:id/beat/:beatId/act/:actId`

## Running the Service

To run this service locally, ensure you have Docker Compose installed. Then, follow these steps:

1. Clone this repository:
```bash
git clone git@github.com:dawn88set/beatsheet-service.git
```
2. Navigate to the project directory:
```bash
cd beatsheet-service
```
3. Build and start the Docker containers using Docker Compose:
```bash
docker-compose up --build
```

This command will build the Docker images and start the service, exposing it on port 3000 by default. You can access the service at `http://localhost:3000`.

Swagger is available in http://localhost:3000/api

## Dependencies

- Node.js
- NestJS
- Docker
- Docker Compose

