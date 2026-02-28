import { User } from '../models/user.js';

// Show login page
export const loginPage = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

// Show register page
export const registerPage = (req, res) => {
  res.render('auth/register', { title: 'Create Account' });
};

// Show profile page (only if logged in)
export const profilePage = (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  
  res.render('auth/profile', { 
    title: 'My Profile',
    user: req.session.user
  });
};

// Handle user registration
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user (password gets hashed in User model)
    const user = await User.create({ email, password, name });

    // Store user in session (log them in automatically)
    req.session.userId = user.id;
    req.session.user = { id: user.id, email: user.email, name: user.name };

    // Redirect to home page
    res.redirect('/');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
};

// Handle user login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.getByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Store user in session
    req.session.userId = user.id;
    req.session.user = { id: user.id, email: user.email, name: user.name };

    // Redirect to home page
    res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
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
