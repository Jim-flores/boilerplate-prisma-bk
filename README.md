## 🚀 REST API Boilerplate – Users & Authentication

This project is a REST API boilerplate designed to speed up the development of applications that require user management and authentication.

It is built with a modern and reliable stack:

- Node.js

- Express

- Prisma ORM

- PostgreSQL

- JWT Authentication

The goal of this project is to provide a clean, scalable, and production-ready foundation that you can easily adapt to your own needs.

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js
- npm or yarn
- PostgreSQL

> ⚠️ **Important:** Comment -> prisma/migrations/* from .gitignore

## Getting Started

1.  Click **"Use this template"** on GitHub to create a new repository from this boilerplate.

2. Install the dependencies:

   ```bash
   cd your-project
   npm install

   ```

3. Set up the environment variables:
   Create a .env file in the root directory and add the following variables:
  
   `DATABASE_URL=<your-postgres-database-url>`

   `JWT_SECRET=<your-jwt-secret>`

4. Create the database

   ```bash
   npx prisma migrate dev --name init

   ```
5. Run seeds > ⚠️ **Important:** Email: `admin@gmail.com` password:`admin123`
   ```bash
   npx prisma db seed
   ``` 
6. Run development
   ```bash
   npm run dev
   ```

📝 View docs at: `http://localhost:3000/api/docs`

Please note that this is just a suggested template, and you should customize it to fit your project's specific needs.
