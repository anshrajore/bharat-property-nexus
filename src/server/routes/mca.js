
const express = require('express');
const { getMcaData } = require('../mockData/mcaMock');
const { validateSearchRequest } = require('../middleware/validation');

const router = express.Router();

// POST endpoint to search MCA21 records
router.post('/', validateSearchRequest, (req, res) => {
  try {
    // Add artificial delay to simulate network latency (500-1500ms)
    setTimeout(() => {
      try {
        const result = getMcaData(req.body);
        res.json(result);
      } catch (error) {
        res.status(503).json({
          source: 'MCA21',
          status: 'unavailable',
          message: error.message,
          data: null
        });
      }
    }, 500 + Math.floor(Math.random() * 1000));
  } catch (error) {
    res.status(500).json({
      source: 'MCA21',
      status: 'error',
      message: 'Internal server error',
      data: null
    });
  }
});

module.exports = router;
