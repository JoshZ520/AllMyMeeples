# AllMyMeeples

## Description
AllMyMeeples is a web application built with Node.js and Express, designed using the Model-View-Controller (MVC) architectural pattern. This project provides a foundation for building scalable web applications with server-side rendering using EJS templates.

## Features
- Express.js server with MVC architecture
- EJS templating engine for dynamic views
- Modular routing system
- Organized controller and model structure
- Static file serving for CSS, JavaScript, and images
- Reusable view partials (header/footer)

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
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
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

3. (Optional) Create a `.env` file for environment variables:
   ```bash
   PORT=3000
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

### Environment Variables
- `PORT` - Server port (default: 3000)

You can set the PORT via command line:
```bash
# Windows (PowerShell)
$env:PORT=8080; pnpm dev

# Linux/Mac
PORT=8080 pnpm dev
```

## Project Structure
```
AllMyMeeples/
├── server.js              # Main server entry point
├── src/
│   ├── app.js            # Express application configuration
│   ├── controllers/      # Route handlers and business logic
│   ├── models/          # Data models
│   ├── routes/          # Route definitions
│   └── views/           # EJS templates
│       ├── partials/    # Reusable view components
│       ├── index.ejs
│       └── layout.ejs
└── public/              # Static assets
    ├── css/
    ├── js/
    └── images/
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

**Dependencies not installing**
```bash
# Clear pnpm cache and reinstall
pnpm store prune
rm -r node_modules
pnpm install
```

## Technologies Used
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **EJS** - Templating engine
- **express-ejs-layouts** - Layout support for EJS
- **pnpm** - Package manager

## License
[Add your license here]

## Contributing
[Add contribution guidelines here]