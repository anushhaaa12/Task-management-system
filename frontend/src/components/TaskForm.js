import React, { useState, useEffect } from 'react';
import { DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box, Alert, Typography } from '@mui/material';
import axios from 'axios';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];
const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

function TaskForm({ task, onClose, onSuccess }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'pending');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.slice(0, 10) : '');
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo?._id || '');
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
    setStatus(task?.status || 'pending');
    setPriority(task?.priority || 'medium');
    setDueDate(task?.dueDate ? task.dueDate.slice(0, 10) : '');
    setAssignedTo(task?.assignedTo?._id || '');
    setFiles([]);
    setError('');
  }, [task]);

  useEffect(() => {
    // Check if user is admin and fetch users if so
    const token = localStorage.getItem('token');
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role === 'admin') {
      setIsAdmin(true);
      axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => setUsers(res.data))
        .catch(() => setUsers([]));
    } else {
      setIsAdmin(false);
    }
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files).slice(0, 3));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('status', status);
      formData.append('priority', priority);
      if (dueDate) formData.append('dueDate', dueDate);
      if (isAdmin && assignedTo) formData.append('assignedTo', assignedTo);
      files.forEach(f => formData.append('documents', f));
      let res;
      if (task && task._id) {
        res = await axios.put(`http://localhost:5000/api/tasks/${task._id}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await axios.post('http://localhost:5000/api/tasks', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
      }
      onSuccess && onSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>{task ? 'Edit Task' : 'Add Task'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />
        <TextField
          select
          label="Status"
          value={status}
          onChange={e => setStatus(e.target.value)}
          fullWidth
          margin="normal"
        >
          {statusOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
        </TextField>
        <TextField
          select
          label="Priority"
          value={priority}
          onChange={e => setPriority(e.target.value)}
          fullWidth
          margin="normal"
        >
          {priorityOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
        </TextField>
        <TextField
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        {isAdmin && (
          <TextField
            select
            label="Assign To"
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="">Unassigned</MenuItem>
            {users.map(user => (
              <MenuItem key={user._id} value={user._id}>{user.email} ({user.role})</MenuItem>
            ))}
          </TextField>
        )}
        <Box mt={2}>
          <Typography variant="subtitle1">Attach up to 3 PDF documents</Typography>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            style={{ marginTop: 8 }}
          />
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {task ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  );
}

export default TaskForm; 