const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = 'your_secret_key'; // Use env for production!

// Fake user database for roles
const USERS = [
  { username: 'admin1', password: 'adminpass', role: 'admin' },
  { username: 'mod1', password: 'modpass', role: 'moderator' },
  { username: 'user1', password: 'userpass', role: 'user' }
];

// Login route issues JWT (with role)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Middleware: verifies JWT and extracts role
function authenticateToken(req, res, next) {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // { username, role, iat, exp }
    next();
  });
}

// Middleware: restrict by role(s)
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: unauthorized role" });
    }
    next();
  };
}

// Protected routes for each role
app.get('/admin/dashboard', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.username}!` });
});

app.get('/moderator/manage', authenticateToken, authorizeRoles('moderator', 'admin'), (req, res) => {
  res.json({ message: `Moderator ${req.user.username} can manage content!` });
});

app.get('/user/profile', authenticateToken, authorizeRoles('user', 'admin', 'moderator'), (req, res) => {
  res.json({ message: `User profile for ${req.user.username}` });
});

// For testing
app.get('/', (req, res) => {
  res.send("RBAC backend running!");
});

app.listen(5000, () => {
  console.log("Server started on http://localhost:5000/");
});
