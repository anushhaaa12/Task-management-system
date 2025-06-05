import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Button, Box, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, TextField, Tooltip, Snackbar, Grid } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import axios from 'axios';

function getUserInfo() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];
const priorityOptions = [
  { value: '', label: 'All' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];
const sortOptions = [
  { value: '', label: 'None' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
];

const TaskList = forwardRef(({ onEdit, onView, onCreate, setTasks: setTasksParent }, ref) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const user = getUserInfo();
  const isAdmin = user && user.role === 'admin';

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const params = {};
      if (status) params.status = status;
      if (priority) params.priority = priority;
      if (dueDate) params.dueDate = dueDate;
      if (sortBy) params.sortBy = sortBy;
      if (sortBy) params.order = order;
      if (!isAdmin) params.assignedTo = user.userId;
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setTasks(res.data);
      if (setTasksParent) setTasksParent(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError('Failed to fetch tasks');
      setLoading(false);
      return [];
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteId(null);
      fetchTasks();
      setSnackbar({ open: true, message: 'Task deleted successfully', severity: 'success' });
    } catch (err) {
      setError('Failed to delete task');
      setSnackbar({ open: true, message: 'Failed to delete task', severity: 'error' });
    }
    setDeleteLoading(false);
  };

  useImperativeHandle(ref, () => ({ fetchTasks }));

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [status, priority, dueDate, sortBy, order]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Tasks</Typography>
        <Button variant="contained" color="primary" onClick={onCreate}>Add Task</Button>
      </Box>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={2}>
          <TextField
            select
            label="Status"
            value={status}
            onChange={e => setStatus(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
            fullWidth
          >
            {statusOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            select
            label="Priority"
            value={priority}
            onChange={e => setPriority(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
            fullWidth
          >
            {priorityOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Due Before"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            select
            label="Sort By"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
            fullWidth
          >
            {sortOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={1}>
          {sortBy && (
            <Button onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')} variant="outlined" size="small" fullWidth>
              {order === 'asc' ? 'Asc' : 'Desc'}
            </Button>
          )}
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button onClick={() => { setStatus(''); setPriority(''); setDueDate(''); setSortBy(''); setOrder('asc'); }} size="small" fullWidth>Clear</Button>
        </Grid>
      </Grid>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Due Date</TableCell>
                {isAdmin && <TableCell>Assigned To</TableCell>}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task, idx) => {
                const canEditDelete = isAdmin || (task.assignedTo && task.assignedTo._id === user.userId);
                return (
                  <TableRow key={task._id} sx={{ bgcolor: idx % 2 === 0 ? '#f5f5f5' : 'white', '&:hover': { bgcolor: '#e3f2fd' } }}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</TableCell>
                    {isAdmin && <TableCell>{task.assignedTo?.email || ''}</TableCell>}
                    <TableCell>
                      <Tooltip title="View Details"><IconButton onClick={() => onView(task)}><Visibility /></IconButton></Tooltip>
                      {canEditDelete && <Tooltip title="Edit"><IconButton onClick={() => onEdit(task)}><Edit /></IconButton></Tooltip>}
                      {canEditDelete && <Tooltip title="Delete"><IconButton color="error" onClick={() => setDeleteId(task._id)}><Delete /></IconButton></Tooltip>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>Are you sure you want to delete this task?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} disabled={deleteLoading}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleteLoading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
});

export default TaskList; 