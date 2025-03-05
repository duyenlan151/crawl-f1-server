require('dotenv').config();

module.exports = {
  BASE_URL: process.env.BASE_URL || 'https://www.formula1.com/en/results',
  WEBSOCKET_PORT: process.env.WEBSOCKET_PORT || 8080,
};
