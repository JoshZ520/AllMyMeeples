export const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.session.userId || !req.session.user) {
    return res.redirect('/auth/login');
  }

  if (req.session.user.role !== role) {
    return res.status(403).render('index', {
      title: 'Access Denied',
      message: 'You do not have permission to view this page.'
    });
  }

  next();
};

/**
 * Wrapper for async route handlers to ensure errors are passed to error middleware
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
