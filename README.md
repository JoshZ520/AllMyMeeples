# AllMyMeeples

A comprehensive board game collection manager built with Node.js, Express, PostgreSQL, and EJS using MVC architecture.

## AI Development Disclosure
This project was developed with significant assistance from **GitHub Copilot** (Claude Sonnet 4.5). AI-generated code has been reviewed, tested, and customized to meet project requirements. I being the sole developer actively directed implementation decisions, debugged issues, and gained understanding of all functionality.

## Features
- User authentication with bcrypt password hashing
- Role-based access control (User, Moderator, Admin)
- Browse 50+ board games with pagination and filters
- Personal collection management
- Review system with moderation workflow
- Admin panel for game/user/review management
- PostgreSQL database with parameterized queries
- Responsive design with professional styling

## Quick Start

```bash
npm install
npm run db:init
npm run dev
```
Visit `http://localhost:3000`

**Test Accounts:** Password is `P@$$w0rd!` for all
- Admin: `admin@allmymeeples.com`
- Moderator: `moderator@allmymeeples.com`
- User: `user@allmymeeples.com`

## Setup

**Prerequisites:** Node.js 18+, PostgreSQL 14+

1. Clone and install:
   ```bash
   git clone <repository-url>
   cd AllMyMeeples
   npm install
   ```

2. Create `.env`:
   ```env
   PORT=3000
   NODE_ENV=development
   SESSION_SECRET=your-random-secret
   DATABASE_URL=postgresql://user:pass@localhost:5432/allmymeeples
   ```

3. Initialize database:
   ```bash
   npm run db:init
   ```

## User Roles

- **User:** Browse games, manage collection, submit reviews
- **Moderator:** User permissions + approve/reject reviews
- **Admin:** Moderator permissions + manage games and user roles

## Database Schema

![Entity Relationship Diagram](docs/erd.png)

**Tables:**
- `users` - User accounts with role-based access
- `games` - Board game catalog with categories and mechanics
- `shelves` - User's personal game collections
- `reviews` - Game reviews with approval workflow

## Project Structure
```
AllMyMeeples/
├── server.js                 # Entry point
├── setup-db.js              # DB initialization
├── schema.sql, seed.sql     # Database files
├── src/
│   ├── app.js               # Express setup
│   ├── controllers/         # Route handlers
│   ├── models/              # Database operations
│   ├── middleware/          # Auth & error handling
│   ├── routes/              # Route definitions
│   ├── views/               # EJS templates
│   └── db/                  # PostgreSQL connection
└── public/                  # Static files (CSS, JS)
```

## Key Routes

**Public:** `/`, `/browse`, `/games/:id`  
**Auth:** `/auth/login`, `/auth/register`, `/auth/profile`  
**Protected:** `/collection`, `/admin`

## Technologies

- **Backend:** Node.js, Express, PostgreSQL, pg
- **Frontend:** EJS, CSS, Vanilla JavaScript
- **Security:** bcryptjs, express-session, parameterized queries
- **Architecture:** MVC pattern with ESM modules

## Troubleshooting

**Database connection errors:** Check PostgreSQL is running, verify DATABASE_URL in `.env`  
**Port in use:** Kill process on port 3000 or use `PORT=8080 npm run dev`  
**Login not working:** Run `npm run db:init`, clear browser cookies  
**Reviews not appearing:** Reviews require admin/moderator approval at `/admin`

## Deployment (Render.com)

1. Create PostgreSQL database on Render
2. Create Web Service connected to GitHub repo
3. Set environment variables: `NODE_ENV=production`, `SESSION_SECRET`, `DATABASE_URL`
4. Build: `npm install` | Start: `npm start`
5. Run `npm run db:init` in Render shell after first deploy

## License & Author

MIT License - Joshua Zobrist, 2026

**Acknowledgments:** GitHub Copilot (Claude Sonnet 4.5), Express.js community