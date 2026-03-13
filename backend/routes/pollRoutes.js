const express = require('express');
const router = express.Router();
const { createPoll, getPolls, votePoll } = require('../controllers/pollController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('Secretariat', 'Admin'), createPoll)
  .get(protect, getPolls);

router.post('/:id/vote', protect, votePoll);

module.exports = router;
