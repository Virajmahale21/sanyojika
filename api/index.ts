import app from '../server/src/index';

// Health check endpoint for testing deployment
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'AnumatiSetu',
    timestamp: new Date().toISOString(),
    platform: process.platform,
    isVercel: !!process.env.VERCEL,
  });
});

export default app;
