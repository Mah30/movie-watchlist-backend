
# 🎬 Movie Watchlist - Backend

This is a REST API for the **Movie Watchlist** application, which allows users to add movies to their personal watchlist and mark them as watched or unwatched.

## 🚀 Technologies Used

- **Node.js** + **Express.js** - REST API server
- **PostgreSQL** - Relational database
- **Prisma ORM** - Database modeling and management
- **TypeScript** - Static typing and better code organization
- **JWT (JSON Web Token)** - Authentication and session management

---

## 📂 **Project Structure**

movie-watchlist-backend/
│-- dist/                  
│-- node_modules/          
│-- src/                  
│   │-- config/            
│   │   └── index.ts
│   │-- db/                
│   │   └── index.ts
│   │-- error-handling/    
│   │   └── index.ts
│   │-- middlewares/       
│   │   ├── requireUser.ts
│   │   ├── route-guard.middleware.ts
│   │-- prisma/            
│   │   ├── migrations/    
│   │   ├── schema.prisma  
│   │   ├── seed.ts        
│   │-- routes/            
│   │   ├── auth.routes.ts
│   │   ├── index.routes.ts
│   │   ├── movies.routes.ts
│   │   ├── user.routes.ts
│   │   ├── userMovies.routes.ts
│   │-- types/             
│   │   ├── express.d.ts
│   ├── server.ts 
│   ├── user.ts          
│-- package.json           
│-- tsconfig.json          
│-- .env                   
│-- .gitignore
│-- package-lock.json
│-- package.json
│-- README.md
│-- tsconfig.json



## 🔌 **Key Features**

### ** 🛠 Authentication**
- User registration and login with password encryption.
- JWT-based authentication.

### ** 🎬 Global Movies**
- Admins can add movies to the global catalog.
- All users can view the list of available movies.

### ** 📌 User Watchlist**
- Each user can add/remove movies from their personal list.
- Ability to mark movies as "To Watch" or "Watched."
- Users can only modify their own watchlist.

---

## 🌍 **Deployment**
The project is available online at:  
🔗 **Backend API:** `[]`

---

## 📜 **License**
This project was developed for educational and learning purposes. 🚀🎬
