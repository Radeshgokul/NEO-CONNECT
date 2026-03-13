const mongoose = require('mongoose');

const announcementSchema = mongoose.Schema({
  title: { type: String, required: true },
  issueRaised: { type: String },
  actionTaken: { type: String },
  result: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;
