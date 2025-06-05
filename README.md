# Task Manager App

A full-stack web application for task management, built with React (frontend), Node.js + Express (backend), and MongoDB (database). Includes JWT authentication, file uploads, and Docker support.

## Features
- User authentication with JWT (admin and regular user roles)
- Dashboard with task statistics and summary cards
- CRUD operations for tasks with the following properties:
  - Title and description
  - Status (pending, in progress, completed)
  - Priority (low, medium, high)
  - Due date
  - Assignment to users
- Task filtering and sorting capabilities:
  - Filter by status, priority, and due date
  - Sort by due date, priority, and status
  - Ascending/descending order options
- File attachment support:
  - Up to 3 PDF documents per task
  - File metadata stored in MongoDB
  - Files stored locally (ready for S3 integration)
- Role-based access control:
  - Admins can manage all tasks and users
  - Regular users can only manage their assigned tasks
- Modern Material UI interface with responsive design

## Stack
- **Frontend:**
  - React with Material UI components
  - React Router for navigation
  - Axios for API calls
  - JWT for authentication
- **Backend:**
  - Node.js with Express
  - MongoDB with Mongoose ODM
  - JWT for authentication
  - Multer for file uploads
- **DevOps:**
  - Docker and Docker Compose for containerization
  - MongoDB 6.0 for database

## Getting Started

### Prerequisites
- Docker and Docker Compose installed
- Node.js (for local development)

### Running with Docker
1. Clone the repository
2. Navigate to the project directory
3. Run `docker-compose up --build`
4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Local Development
1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd frontend
   npm install
   ```
3. Set up environment variables:
   - Create `.env` file in backend directory with:
     ```
     MONGO_URI=mongodb://localhost:27017/taskmanager
     JWT_SECRET=your_jwt_secret
     ```
4. Start the development servers:
   ```bash
   # Backend (from backend directory)
   npm run dev
   
   # Frontend (from frontend directory)
   npm start
   ```

### Default Admin Account
After first run, you can create an admin account through the registration page. The first registered user will automatically be assigned admin privileges.

## API Documentation
The API documentation is available at http://localhost:5000/api-docs when running the backend server.

## File Structure
```
task-management-system/
├── frontend/           # React frontend application
├── backend/           # Node.js + Express backend
│   ├── src/
│   │   ├── models/    # Mongoose models
│   │   ├── routes/    # API routes
│   │   └── middleware/# Custom middleware
│   └── uploads/       # File upload directory
└── docker-compose.yml # Docker configuration
``` 
