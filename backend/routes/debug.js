import express from 'express';

const debugRouter = express.Router();

// Debug endpoint to check products directly
debugRouter.get('/products-count', async (req, res) => {
  try {
    // This will be added when the route is mounted
    res.json({ message: 'This endpoint will be updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default debugRouter;
