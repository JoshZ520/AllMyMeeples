export const loginPage = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

export const registerPage = (req, res) => {
  res.render('auth/register', { title: 'Create Account' });
};

export const profilePage = (req, res) => {
  // In Week 7, this will check authentication
  // For now, show demo profile
  res.render('auth/profile', { 
    title: 'My Profile',
    user: { id: 'demo-user', email: 'demo@example.com', name: 'Demo User' }
  });
};

// Week 7: These will be implemented with real authentication
export const login = async (req, res) => {
  res.json({ message: 'Login endpoint - implement in Week 7' });
};

export const register = async (req, res) => {
  res.json({ message: 'Register endpoint - implement in Week 7' });
};

export const logout = (req, res) => {
  res.json({ message: 'Logout endpoint - implement in Week 7' });
};
