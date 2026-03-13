const express = require('express');
const router = express.Router();
const { createAnnouncement, getAnnouncements, uploadMinute, getMinutes } = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/announcements')
  .post(protect, authorize('Secretariat', 'Admin'), createAnnouncement)
  .get(protect, getAnnouncements);

router.route('/minutes')
  .post(protect, authorize('Secretariat', 'Admin'), upload.single('file'), uploadMinute)
  .get(protect, getMinutes);

module.exports = router;
