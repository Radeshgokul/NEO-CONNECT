const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile, getUsers, deleteUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', registerUser); // Can add `protect, authorize('Admin')` later
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.get('/', protect, authorize('Admin'), getUsers);
router.delete('/:id', protect, authorize('Admin'), deleteUser);

module.exports = router;
