const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'in progress', 'completed'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attachedDocuments: [{
    filename: String,
    originalname: String,
    mimetype: String,
    size: Number,
    path: String
  }],
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema); 