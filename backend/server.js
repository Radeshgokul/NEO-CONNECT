require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Expose uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple check route
app.get('/api', (req, res) => {
  res.send('API is running');
});

const userRoutes = require('./routes/userRoutes');
const caseRoutes = require('./routes/caseRoutes');
const pollRoutes = require('./routes/pollRoutes');
const contentRoutes = require('./routes/contentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

app.use('/api/users', userRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
