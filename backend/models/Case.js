const mongoose = require('mongoose');

const caseSchema = mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Safety', 'Policy', 'Facilities', 'HR', 'Other'] 
  },
  department: { type: String, required: true },
  location: { type: String, required: true },
  severity: { 
    type: String, 
    required: true,
    enum: ['Low', 'Medium', 'High']
  },
  description: { type: String, required: true },
  anonymous: { type: Boolean, default: false },
  status: { 
    type: String, 
    required: true, 
    enum: ['New', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Escalated'],
    default: 'New'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  attachments: [{ type: String }],
  lastResponse: { type: Date, default: null },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // populated if not anonymous
  notes: [{
    text: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Case = mongoose.model('Case', caseSchema);
module.exports = Case;
