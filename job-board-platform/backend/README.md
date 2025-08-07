# Opportuna Backend API

Backend API for the Opportuna job board platform with MySQL database integration.

## Features

- **Contact Form API**: Handle contact form submissions with validation
- **MySQL Database**: Persistent storage for contact submissions
- **Rate Limiting**: Prevent spam and abuse
- **Input Validation**: Comprehensive validation using Joi
- **Security**: Helmet.js for security headers
- **CORS**: Configured for frontend integration
- **Error Handling**: Centralized error handling
- **Logging**: Request logging with Morgan

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=opportuna_db
   DB_USER=your_username
   DB_PASSWORD=your_password
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:5173
   ```

### Database Setup

1. Create a MySQL database:
   ```sql
   CREATE DATABASE opportuna_db;
   ```

2. The application will automatically create the required tables on startup.

### Running the Server

1. Development mode:
   ```bash
   npm run dev
   ```

2. Production mode:
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### Contact Form

#### Submit Contact Form
- **POST** `/api/contacts`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Job Inquiry",
    "message": "I'm interested in the developer position..."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Message sent successfully! We'll get back to you soon.",
    "data": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Job Inquiry",
      "created_at": "2025-08-07T12:00:00Z"
    }
  }
  ```

### Admin Endpoints (for future admin panel)

#### Get All Contacts
- **GET** `/api/contacts?page=1&limit=10&status=unread`

#### Get Contact by ID
- **GET** `/api/contacts/:id`

#### Update Contact Status
- **PATCH** `/api/contacts/:id/status`
- **Body**: `{ "status": "read" }`

#### Delete Contact
- **DELETE** `/api/contacts/:id`

#### Get Contact Statistics
- **GET** `/api/contacts/stats`

## Database Schema

### Contacts Table

```sql
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);
```

## Security Features

- **Rate Limiting**: 3 contact submissions per 15 minutes per IP
- **Input Validation**: Joi schema validation
- **Input Sanitization**: Trim and normalize input data
- **CORS Protection**: Configured for specific frontend origin
- **Security Headers**: Helmet.js protection
- **SQL Injection Prevention**: Parameterized queries

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Rate Limiting

- General API: 100 requests per 15 minutes
- Contact Form: 3 submissions per 15 minutes

## Development

### Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon

### Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── contactController.js # Contact form logic
├── middleware/
│   ├── validation.js        # Input validation
│   └── helpers.js          # Utility middleware
├── models/
│   └── Contact.js          # Contact model
├── routes/
│   └── contacts.js         # Contact routes
├── .env.example            # Environment template
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies
├── README.md              # This file
└── server.js              # Main server file
```
