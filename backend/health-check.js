const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    info: {
      api: {
        status: 'up',
        message: 'Health check endpoint',
      },
    },
  });
});

// Catch-all route
app.get('*', (req, res) => {
  res.json({
    message: 'API is running. Use specific endpoints for functionality.',
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`);
});
