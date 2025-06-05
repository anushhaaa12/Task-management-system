const express = require('express');
const multer = require('multer');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'backend/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({
  storage,
  limits: { files: 3 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'));
  },
});

// Create task
router.post('/', auth, upload.array('documents', 3), async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    const attachedDocuments = req.files?.map(f => ({
      filename: f.filename,
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      path: f.path
    })) || [];
    // If not admin, force assignedTo to current user
    let assignedUser = assignedTo;
    if (req.user.role !== 'admin') {
      assignedUser = req.user.userId;
    }
    const task = new Task({
      title, description, status, priority, dueDate, assignedTo: assignedUser, attachedDocuments
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all tasks (with filtering/sorting)
router.get('/', auth, async (req, res) => {
  const { status, priority, dueDate, assignedTo, sortBy, order } = req.query;
  let filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };
  if (assignedTo) filter.assignedTo = assignedTo;
  let sort = {};
  if (sortBy) sort[sortBy] = order === 'desc' ? -1 : 1;
  const tasks = await Task.find(filter).sort(sort).populate('assignedTo', 'email role');
  res.json(tasks);
});

// Get single task
router.get('/:id', auth, async (req, res) => {
  const task = await Task.findById(req.params.id).populate('assignedTo', 'email role');
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

// Update task
router.put('/:id', auth, upload.array('documents', 3), async (req, res) => {
  try {
    const updates = req.body;
    if (req.files && req.files.length > 0) {
      updates.attachedDocuments = req.files.map(f => ({
        filename: f.filename,
        originalname: f.originalname,
        mimetype: f.mimetype,
        size: f.size,
        path: f.path
      }));
    }
    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

module.exports = router; 