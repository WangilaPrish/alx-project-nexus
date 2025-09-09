const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5004;

app.use(cors());
app.use(express.json());

// Static user data
const users = [
  {
    id: 1,
    name: 'Alice Smith',
    email: 'alice@example.com',
    provider: 'google',
    is_verified: true,
    created_at: '2025-09-01'
  },
  {
    id: 2,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    provider: 'email',
    is_verified: false,
    created_at: '2025-09-05'
  }
];

app.get('/api/auth/users', (req, res) => {
  res.json({ success: true, data: users });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
