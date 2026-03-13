const Announcement = require('../models/Announcement');
const Minute = require('../models/Minute');

// --- Announcements / Digest ---
// @route   POST /api/content/announcements
const createAnnouncement = async (req, res) => {
  const { title, issueRaised, actionTaken, result } = req.body;

  const newAnnouncement = await Announcement.create({
    title,
    issueRaised,
    actionTaken,
    result,
    createdBy: req.user._id
  });

  res.status(201).json(newAnnouncement);
};

// @route   GET /api/content/announcements
const getAnnouncements = async (req, res) => {
  const announcements = await Announcement.find({}).sort({ createdAt: -1 });
  res.json(announcements);
};


// --- Minutes ---
// @route   POST /api/content/minutes
const uploadMinute = async (req, res) => {
  const { title } = req.body;
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !fileUrl) {
    return res.status(400).json({ message: 'File and title are required' });
  }

  const newMinute = await Minute.create({
    title,
    fileUrl,
    uploadedBy: req.user._id
  });

  res.status(201).json(newMinute);
};

// @route   GET /api/content/minutes
const getMinutes = async (req, res) => {
  const minutes = await Minute.find({}).sort({ createdAt: -1 });
  res.json(minutes);
};

module.exports = { createAnnouncement, getAnnouncements, uploadMinute, getMinutes };
