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
