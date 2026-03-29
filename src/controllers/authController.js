import { User } from '../models/user.js';

// Show login page
export const loginPage = (req, res) => {
  res.render('auth/login', { title: 'Login', email: '' });
};

// Show register page
export const registerPage = (req, res) => {
  res.render('auth/register', { title: 'Create Account' });
};

// Show profile page (only if logged in)
export const profilePage = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }

  const user = await User.getById(req.session.userId);
  if (!user) {
    req.session.destroy(() => {
      res.redirect('/auth/login');
    });
    return;
  }

  res.render('auth/profile', {
    title: 'My Profile',
    user
  });
};

// Handle user registration
export const register = async (req, res) => {
  const { email, password, name } = req.body;

  // Validation
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if user already exists
  const existingUser = await User.getByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  // Create new user (password gets hashed in User model)
  // Any unexpected errors (DB connection, etc.) will propagate to global error handler
  const user = await User.create({ email, password, name });

  // Store user in session (log them in automatically)
  req.session.userId = user.id;
  req.session.user = { id: user.id, email: user.email, name: user.name, role: user.role };

  // Redirect to home page
  res.redirect('/');
};

// Handle user login
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).render('auth/login', {
      title: 'Login',
      error: 'Email and password are required',
      email
    });
  }

  // Find user by email
  const user = await User.getByEmail(email);
  if (!user) {
    return res.status(401).render('auth/login', {
      title: 'Login',
      error: 'Invalid email or password',
      email
    });
  }

  // Check if password matches
  const isMatch = await User.comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).render('auth/login', {
      title: 'Login',
      error: 'Invalid email or password',
      email
    });
  }

  // Store user in session
  req.session.userId = user.id;
  req.session.user = { id: user.id, email: user.email, name: user.name, role: user.role };

  // Redirect to home page
  res.redirect('/');
};

// Handle logout
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.redirect('/');
  });
};
