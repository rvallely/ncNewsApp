const { Pool } = require('pg');
const ENV = process.env.ENV || 'development';

const config =
  ENV === 'production'
    ? {
        connectionString: process.env.EXTERNAL_DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};

module.exports = new Pool(config);

