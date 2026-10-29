// Ensure default environment variables in serverless context if not set in Vercel dashboard
process.env.JWT_SECRET = process.env.JWT_SECRET || 'anumatisetu_portal_secure_jwt_secret_governance';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
process.env.DEMO_MODE = process.env.DEMO_MODE || 'true';

let app;

module.exports = (req, res) => {
  try {
    if (!app) {
      const serverModule = require('../server/dist/index.js');
      app = serverModule.default || serverModule;
    }
    return app(req, res);
  } catch (err) {
    console.error('[AnumatiSetu Vercel Serverless Error]:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        error: 'Serverless Function Runtime Error',
        message: err ? err.message : String(err),
        stack: err ? err.stack : undefined,
      })
    );
  }
};
