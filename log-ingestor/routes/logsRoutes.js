// routes/logsRoutes.js
const express = require('express');
const { logValidationRules } = require('../middlewares/validationMiddleware');
const { createLog, getLogs } = require('../controllers/logsController'); // Update the import statement

const router = express.Router();

// Log ingestion route
router.post('/logs', logValidationRules(), createLog);

// Log retrieval route with filters
router.get('/logs', getLogs);

module.exports = router;
