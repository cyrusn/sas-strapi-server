'use strict';

/**
 * conduct router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::conduct.conduct');
