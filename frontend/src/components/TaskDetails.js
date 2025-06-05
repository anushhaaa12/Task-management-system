import React from 'react';
import { DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Chip, List, ListItem, ListItemText, Link } from '@mui/material';

function TaskDetails({ task, onClose }) {
  if (!task) return null;
  return (
    <>
      <DialogTitle>Task Details</DialogTitle>
      <DialogContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body1" gutterBottom>{task.description}</Typography>
        <Box mb={2}>
          <Chip label={`Status: ${task.status}`} sx={{ mr: 1 }} />
          <Chip label={`Priority: ${task.priority}`} sx={{ mr: 1 }} />
          {task.dueDate && <Chip label={`Due: ${new Date(task.dueDate).toLocaleDateString()}`} />}
        </Box>
        {task.assignedTo && (
          <Typography variant="body2" gutterBottom>Assigned to: {task.assignedTo.email}</Typography>
        )}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>Attached Documents:</Typography>
        <List>
          {task.attachedDocuments && task.attachedDocuments.length > 0 ? (
            task.attachedDocuments.map((doc, idx) => (
              <ListItem key={idx}>
                <ListItemText primary={doc.originalname} />
                <Link href={`http://localhost:5000/uploads/${doc.filename}`} target="_blank" rel="noopener">
                  Download
                </Link>
              </ListItem>
            ))
          ) : (
            <ListItem><ListItemText primary="No documents attached." /></ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </>
  );
}

export default TaskDetails; 