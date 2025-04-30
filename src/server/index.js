
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import route modules
const dorisRoutes = require('./routes/doris');
const dlrRoutes = require('./routes/dlr');
const cersaiRoutes = require('./routes/cersai');
const mcaRoutes = require('./routes/mca');
const unifiedRoutes = require('./routes/unified');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Apply middleware
app.use(cors());
app.use(bodyParser.json());

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/search/doris', dorisRoutes);
app.use('/api/search/dlr', dlrRoutes);
app.use('/api/search/cersai', cersaiRoutes);
app.use('/api/search/mca', mcaRoutes);
app.use('/api/search/unified', unifiedRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Mock API server running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`- POST /api/search/doris`);
  console.log(`- POST /api/search/dlr`);
  console.log(`- POST /api/search/cersai`);
  console.log(`- POST /api/search/mca`);
  console.log(`- POST /api/search/unified (NEW)`);
  console.log(`- GET /health`);
});
