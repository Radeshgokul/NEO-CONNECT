const mongoose = require('mongoose');

const minuteSchema = mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Minute = mongoose.model('Minute', minuteSchema);
module.exports = Minute;
