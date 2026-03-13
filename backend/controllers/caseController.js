const Case = require('../models/Case');

// Utility to generate Tracking ID
const generateTrackingId = async () => {
  const year = new Date().getFullYear();
  const count = await Case.countDocuments({
    createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) }
  });
  const increment = (count + 1).toString().padStart(3, '0');
  return `NEO-${year}-${increment}`;
};

// @desc    Create a case
// @route   POST /api/cases
// @access  Private (Staff)
const createCase = async (req, res) => {
  const { category, department, location, severity, description, anonymous } = req.body;
  
  if (!category || !department || !location || !severity || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const trackingId = await generateTrackingId();
  
  const attachments = req.file ? [`/uploads/${req.file.filename}`] : [];

  const newCase = await Case.create({
    trackingId,
    category,
    department,
    location,
    severity,
    description,
    anonymous: anonymous === 'true' || anonymous === true,
    attachments,
    submittedBy: (anonymous === 'true' || anonymous === true) ? null : req.user._id,
  });

  res.status(201).json(newCase);
};

// @desc    Get all cases
// @route   GET /api/cases
// @access  Secretariat, Admin
const getCases = async (req, res) => {
  const { department, status, search } = req.query;
  let query = {};

  if (department) query.department = department;
  if (status) query.status = status;
  if (search) query.trackingId = { $regex: search, $options: 'i' };

  const cases = await Case.find(query).populate('assignedTo', 'name email').sort({ createdAt: -1 });
  res.json(cases);
};

// @desc    Get cases assigned to me
// @route   GET /api/cases/assigned
// @access  Case Manager
const getAssignedCases = async (req, res) => {
  const cases = await Case.find({ assignedTo: req.user._id }).sort({ createdAt: -1 });
  res.json(cases);
};

// @desc    Get case by ID
// @route   GET /api/cases/:id
// @access  Private
const getCaseById = async (req, res) => {
  const singleCase = await Case.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('notes.addedBy', 'name');

  if (singleCase) {
    res.json(singleCase);
  } else {
    res.status(404).json({ message: 'Case not found' });
  }
};

// @desc    Assign Case
// @route   PUT /api/cases/:id/assign
// @access  Secretariat
const assignCase = async (req, res) => {
  const singleCase = await Case.findById(req.params.id);

  if (singleCase) {
    singleCase.assignedTo = req.body.assignedTo;
    singleCase.status = 'Assigned';
    const updatedCase = await singleCase.save();
    res.json(updatedCase);
  } else {
    res.status(404).json({ message: 'Case not found' });
  }
};

// @desc    Update Case Status & add note
// @route   PUT /api/cases/:id/status
// @access  Case Manager
const updateCaseStatus = async (req, res) => {
  const { status, note } = req.body;
  const singleCase = await Case.findById(req.params.id);

  if (singleCase) {
    // Basic authorization check - only assigned manager or secretariat/admin can update
    if (req.user.role === 'Case Manager' && singleCase.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this case' });
    }

    singleCase.status = status || singleCase.status;
    singleCase.lastResponse = Date.now();
    
    if (note) {
      singleCase.notes.push({
        text: note,
        addedBy: req.user._id
      });
    }

    const updatedCase = await singleCase.save();
    res.json(updatedCase);
  } else {
    res.status(404).json({ message: 'Case not found' });
  }
};

module.exports = { createCase, getCases, getAssignedCases, getCaseById, assignCase, updateCaseStatus };
