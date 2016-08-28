module.exports = {
  APP_PORT: process.env.PORT || 3002,
  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DB_PORT: process.env.DB_PORT || 27017,
  DB_NAME: process.env.DB_NAME || 'mean-starter-kit-db',
  SIMPLIFY_PUBLIC_KEY: process.env.SIMPLIFY_PUBLIC_KEY,
  SIMPLIFY_PRIVATE_KEY: process.env.SIMPLIFY_PRIVATE_KEY
};
