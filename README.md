A full stack, secure note-taking application that allows users to create, edt, and delete notes with authentication and access control.

        Live Demo

https://secured-note-app-three.vercel.app

         Tech Stack

- Next.js
- MongoDB
- Mongoose
- JWT Authentication
- Tailwind CSS

          Features

  - User registration and login (JWT authentication)
  - Create, read, update, and delete notes (CRUD)
  - Role-based access control (RBAC)
  - Ownership protection (users can only manage their own notes)
  - Secured API routes

           Project Structure

    - `/app` - Frontend pages (Next.js App Router)
    - `/api` - Backend API routes
    -  `/models` - Database models
    -  `/lib` - Utility functions (DB connection, auth)
   
            Installation

       ```bash

       git clone https://github.com/Iphyboi/secured-note-app.git

       cd secured-note-app

       npm install

       npm run dev
