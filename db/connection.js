const { Pool } = require('pg');
const ENV = process.env.ENV || 'development';

// require('dotenv').config({
//   path: `${__dirname}/../.env.${ENV}`,
// });

// if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
//   throw new Error('PGDATABASE or DATABASE_URL not set');
// }

const config =
  ENV === 'production'
    ? {
        connectionString: process.env.EXTERNAL_DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};

console.log('CONFIG: ', config);
module.exports = new Pool(config);

