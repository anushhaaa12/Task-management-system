import React, { useState, useRef, useEffect } from 'react';
import { Typography, Box, Dialog, Grid, Card, CardContent } from '@mui/material';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TaskDetails from '../components/TaskDetails';

function Dashboard() {
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const taskListRef = useRef();

  const handleCreate = () => {
    setSelectedTask(null);
    setOpenForm(true);
  };
  const handleEdit = (task) => {
    setSelectedTask(task);
    setOpenForm(true);
  };
  const handleView = (task) => {
    setSelectedTask(task);
    setOpenDetails(true);
  };
  const handleSuccess = async () => {
    setOpenForm(false);
    if (taskListRef.current) {
      const updatedTasks = await taskListRef.current.fetchTasks();
      setTasks(updatedTasks || []);
    }
  };

  // Fetch tasks for summary cards
  useEffect(() => {
    if (taskListRef.current) {
      taskListRef.current.fetchTasks().then(fetched => setTasks(fetched || []));
    }
  }, []);

  // Calculate summary
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;

  return (
    <Box mt={8}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#1976d2', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Tasks</Typography>
              <Typography variant="h4">{totalTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#43a047', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Completed</Typography>
              <Typography variant="h4">{completedTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#fbc02d', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Pending</Typography>
              <Typography variant="h4">{pendingTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <TaskList ref={taskListRef} onEdit={handleEdit} onView={handleView} onCreate={handleCreate} setTasks={setTasks} />
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <TaskForm task={selectedTask} onClose={() => setOpenForm(false)} onSuccess={handleSuccess} />
      </Dialog>
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="sm" fullWidth>
        <TaskDetails task={selectedTask} onClose={() => setOpenDetails(false)} />
      </Dialog>
    </Box>
  );
}

export default Dashboard; 