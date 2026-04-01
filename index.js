// /home/nemo/Work/tomoca-backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tomocadb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Tomoca Backend API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});