const express = require('express');
const router = express.Router();
const { createCase, getCases, getAssignedCases, getCaseById, assignCase, updateCaseStatus } = require('../controllers/caseController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .post(protect, upload.single('attachment'), createCase)
  .get(protect, authorize('Secretariat', 'Admin'), getCases);

router.get('/assigned', protect, authorize('Case Manager'), getAssignedCases);

router.route('/:id')
  .get(protect, getCaseById);

router.put('/:id/assign', protect, authorize('Secretariat', 'Admin'), assignCase);
router.put('/:id/status', protect, authorize('Case Manager', 'Secretariat', 'Admin'), updateCaseStatus);

module.exports = router;
