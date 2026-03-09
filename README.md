# AllMyMeeples

## Description
AllMyMeeples is a web application for managing your board game collection. Built with Node.js, Express, and EJS using the Model-View-Controller (MVC) architecture. Users can browse games, add them to their personal shelf, and manage their collections with user authentication.

## Features
- **User Authentication** - Register, login/logout with bcrypt password hashing
- **Session Management** - 24-hour persistent login with express-session
- **Game Database** - Browse and search board games with detailed information
- **Personal Shelf** - Add/remove games to your collection with duplicate prevention
- **User Profiles** - View your account info and join date
- **Protected Routes** - Authentication required for shelf management
- **Responsive Design** - Clean, accessible interface
- **ESM Modules** - Modern JavaScript imports/exports
- **Database Abstraction** - Knex.js for PostgreSQL

## Quick Start

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev

# Open your browser
# Navigate to http://localhost:3000
```

## Installation

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **pnpm** package manager - [Installation guide](https://pnpm.io/installation)
  ```bash
  # Install pnpm globally if you don't have it
  npm install -g pnpm
  ```

### Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd AllMyMeeples
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Initialize the database:
   - Run the SQL scripts using the provided setup script:
     ```bash
     pnpm run db:init
     ```

4. (Optional) Create a `.env` file for environment variables:
   ```bash
   PORT=3000
   NODE_ENV=development
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
   ```

## Usage

### Development Mode
Start the development server:
```bash
pnpm dev
```

### Production Mode
Start the server in production:
```bash
pnpm start
```

The application will be available at `http://localhost:3000` (or your configured PORT).

### Database Setup (SQL Scripts)
This project uses raw SQL scripts for schema and seed data:
```bash
pnpm run db:init
```

## Authentication

### User Registration
1. Click **Register** in the navigation
2. Enter name, email, and password
3. Click **Register** - you'll be logged in automatically
4. Passwords are securely hashed with bcrypt

### User Login
1. Click **Login** in the navigation
2. Enter your email and password
3. Click **Login** - session starts (24-hour cookie)
4. Session persists across page refreshes

### Logout
1. Click **Logout** button in header
2. Session is destroyed
3. You'll be redirected to homepage

### Protected Routes
These routes require authentication:
- `POST /api/games/:id/shelf` - Add game to shelf
- `DELETE /api/games/:id/shelf` - Remove game from shelf
- `GET /api/shelf` - View your shelf
- `/collection` - Your game collection page
- `/auth/profile` - Your profile page

Attempting to access without login redirects to `/auth/login`.

## Project Structure
```
AllMyMeeples/
├── server.js              # Main server entry point
├── schema.sql             # Database schema
├── knexfile.js            # Knex database configuration
├── src/
│   ├── app.js            # Express app & middleware setup
│   ├── controllers/
│   │   ├── gameController.js    # Game & shelf endpoints
│   │   ├── authController.js    # Login/register/logout logic
│   │   └── homeController.js    # Homepage render
│   ├── models/
│   │   ├── game.js       # Game & Shelf database operations
│   │   └── user.js       # User model with password hashing
│   ├── routes/
│   │   ├── index.js      # Game API routes
│   │   └── auth.js       # Authentication routes
│   ├── db/
│   │   ├── db.js         # Knex database connection
│   └── views/
│       ├── index.ejs     # Homepage with game browser
│       ├── collection.ejs # User's game shelf
│       ├── auth/
│       │   ├── login.ejs
│       │   ├── register.ejs
│       │   └── profile.ejs
│       ├── layout.ejs
│       └── partials/
│           ├── header.ejs
│           └── footer.ejs
└── public/
   ├── css/
   │   ├── base.css
   │   ├── layout.css
   │   └── components.css
    ├── js/
    └── images/
```

## API Endpoints

### Games
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get single game

### Shelf (Requires Authentication)
- `POST /api/games/:id/shelf` - Add game to shelf
- `GET /api/shelf` - Get your shelf games
- `DELETE /api/games/:id/shelf` - Remove game from shelf

### Authentication
- `GET /auth/login` - Login page
- `POST /auth/login` - Submit login
- `GET /auth/register` - Registration page
- `POST /auth/register` - Submit registration
- `POST /auth/logout` - Logout (destroy session)
- `GET /auth/profile` - Your profile (requires auth)

## Technologies Used
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **EJS** - Server-side templating engine
- **express-ejs-layouts** - Layout support for EJS
- **Knex.js** - SQL query builder
- **PostgreSQL** - Production database
- **bcryptjs** - Password hashing & verification
- **express-session** - Session management
- **ESM Modules** - Modern JavaScript imports

## Environment Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

You can set the PORT via command line:
```bash
# Windows (PowerShell)
$env:PORT=8080; pnpm dev

# Linux/Mac
PORT=8080 pnpm dev
```

## Troubleshooting

### Common Issues

**pnpm not found**
```bash
npm install -g pnpm
```

**Port already in use**
```bash
# Use a different port
$env:PORT=8080; pnpm dev  # Windows PowerShell
PORT=8080 pnpm dev        # Linux/Mac
```

**Database errors**
- Re-run `pnpm run db:init`

**Dependencies not installing**
```bash
# Clear pnpm cache and reinstall
pnpm store prune
rm -r node_modules
pnpm install
```

**Login/Register not working**
- Make sure the database is initialized (run `pnpm run db:init`)
- Check that port 3000 is not in use
- Clear browser cookies for localhost:3000

## Deployment

### Render.com
This project is configured for Render deployment:

1. Connect your GitHub repository to Render
2. Set environment variable: `NODE_ENV=production`
3. Build command: `pnpm install`
4. Start command: `pnpm start`
5. Render automatically provides PostgreSQL database

The `knexfile.js` automatically uses PostgreSQL in production.

## License
MIT

## Contributing
Contributions welcome! Feel free to submit issues and pull requests.