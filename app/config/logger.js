'use strict';

module.exports = ({ env }) => ({
  level: env('STRAPI_LOG_LEVEL', env('NODE_ENV') === 'production' ? 'http' : 'debug'),
});
