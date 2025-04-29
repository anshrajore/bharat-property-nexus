
const express = require('express');
const { getDlrData } = require('../mockData/dlrMock');
const { validateSearchRequest } = require('../middleware/validation');

const router = express.Router();

// POST endpoint to search DLR records
router.post('/', validateSearchRequest, (req, res) => {
  try {
    // Add artificial delay to simulate network latency (500-1500ms)
    setTimeout(() => {
      try {
        const result = getDlrData(req.body);
        res.json(result);
      } catch (error) {
        res.status(503).json({
          source: 'DLR',
          status: 'unavailable',
          message: error.message,
          data: null
        });
      }
    }, 500 + Math.floor(Math.random() * 1000));
  } catch (error) {
    res.status(500).json({
      source: 'DLR',
      status: 'error',
      message: 'Internal server error',
      data: null
    });
  }
});

module.exports = router;
