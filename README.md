# Sample_server

A REST API for managing university data with JWT authentication and MongoDB integration.

## Getting Started :rocket:

### Prerequisites

- Node.js
- npm
- MongoDB account

## Quick Start :rocket:

1. ### Clone Repository

```bash
git clone https://github.com/yourusername/sample_server.git
cd sample_server
```

2. ### Install Dependencies

```bash
npm install
```

3. ### Create a .env file in the root directory with the following variables

```bash
PORT=3000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Environment Configuration :rocket:

### Port

Choose any available port for your server (default: 3000), if facing CAN NOT GET error, can try to Change other PORT.

### JWT Secret

Generate a secure JWT secret using:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output to your .env file:

```bash
JWT_SECRET=generated_secret_key
```

### MongoDB Connection

```bash
MONGODB_URL=mongodb+srv://{UserAccount}:{Password}@cluster0.example.mongodb.net/database_name
```

### Running the Application

Start the server:

```bash
npm start
```

Run tests:

```bash
npm test
```

## API Documentation :rocket:

### Authentication Endpoints

### Register User:

```bash
POST /api/auth/register
```

Request body (JSON):

```bash
{
  "username": "user123",
  "password": "password123"
}
```

### Login user:

```bash
POST /api/auth/login
```

Request body (JSON):

```bash
{
  "username": "user123",
  "password": "password123"
}
```

Returns JWT token for authentication.

### Resource Endpoints

### Get All Universities

```bash
GET /api/resources/university
```

| Parameter  | Type    | Default | Description                    |
| ---------- | ------- | ------- | ------------------------------ |
| active     | boolean | true    | Filter by active status        |
| bookmarked | boolean | true    | Filter bookmarked universities |
| country    | string  | null    | Filter by country name         |
| deleted    | boolean | true    | Include deleted universities   |
| page       | number  | 1       | Page number for pagination     |
| limit      | number  | 10      | Number of results per page     |

### Create University

```bash
POST /api/resources/university
```

Headers:

```bash
Authorization: Bearer your_jwt_token
```

Request body (JSON):

```bash
{
  "name": "Example University",
  "country": "Singapore",
  "webpages": ["https://example.com"]
}
```

### Get a university by id

```bash
GET /api/resources/university/:id
```

### Update a university by id

```bash
PUT /api/resources/university/:id
```

Headers:

```bash
Authorization: Bearer your_jwt_token
```

Request body (JSON):

```bash
{
  "name": "Updated University Name"
}
```

### Delete university by id

```bash
DELETE /api/resources/university/:id
```

Headers:

```bash
Authorization: Bearer your_jwt_token
```

### Bookmark a university by id

```bash
DELETE /api/resources/university/:id
```

Headers:

```bash
Authorization: Bearer your_jwt_token
```
