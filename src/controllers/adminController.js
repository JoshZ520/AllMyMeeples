import { User } from '../models/user.js';
import { Review } from '../models/review.js';

const VALID_ROLES = ['admin', 'moderator', 'user'];

export const adminDashboard = async (req, res) => {
  const users = await User.listAll();
  const pendingReviews = await Review.listPending();
  res.render('admin/index', {
    title: 'Admin Dashboard',
    users,
    pendingReviews
  });
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).render('admin/index', {
      title: 'Admin Dashboard',
      users: await User.listAll(),
      error: 'Invalid role selected.'
    });
  }

  await User.updateRole(id, role);
  res.redirect('/admin');
};
