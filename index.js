const app = require('./app');
const logger = require('./utils/logger');
const PORT = process.env.PORT || 3000;

// Start the app and listen on PORT
app.listen(PORT, () => {
  logger.info(`Express erver listening on port ${PORT} in mode ${app.settings.env}`);
});