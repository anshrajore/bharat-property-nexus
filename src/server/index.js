
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dorisRouter = require('./routes/doris');
const dlrRouter = require('./routes/dlr');
const cersaiRouter = require('./routes/cersai');
const mcaRouter = require('./routes/mca');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/search/doris', dorisRouter);
app.use('/api/search/dlr', dlrRouter);
app.use('/api/search/cersai', cersaiRouter);
app.use('/api/search/mca', mcaRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
