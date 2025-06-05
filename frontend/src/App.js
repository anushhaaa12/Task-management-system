import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link as RouterLink } from 'react-router-dom';
import { CssBaseline, Container, AppBar, Toolbar, Typography, Button, Box, Link, ThemeProvider, createTheme } from '@mui/material';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';

function isAdmin() {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

function isAuthenticated() {
  return !!localStorage.getItem('token');
}

function getUserInfo() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
  },
  typography: {
    fontFamily: 'Roboto, Arial',
    h4: { fontWeight: 700 },
  },
});

function AppBarWithLogout() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  const user = getUserInfo();
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          <Link component={RouterLink} to="/dashboard" color="inherit" underline="none">
            Task Manager
          </Link>
        </Typography>
        {isAuthenticated() && (
          <>
            <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
            {isAdmin() && <Button color="inherit" component={RouterLink} to="/users">Users</Button>}
            <Typography sx={{ mx: 2 }}>{user.email} ({user.role})</Typography>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Box>
          <AppBarWithLogout />
          <Box mt={4}>
            <Container maxWidth="md">
              <Routes>
                <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
                <Route path="/register" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Register />} />
                <Route path="/dashboard/*" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
                {isAdmin() && <Route path="/users" element={isAuthenticated() ? <Users /> : <Navigate to="/login" />} />}
                <Route path="/" element={<Navigate to="/login" />} />
              </Routes>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
