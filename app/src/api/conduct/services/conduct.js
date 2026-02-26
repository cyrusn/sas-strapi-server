'use strict';

/**
 * conduct service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::conduct.conduct');
