'use strict';

/**
 * cohort-student-map controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::cohort-student-map.cohort-student-map', ({strapi}) => ({
  async createMany(ctx) {
    const { data } = ctx.request.body
    const response = await strapi.db.query('api::cohort-student-map.cohort-student-map').createMany({
      data
    })

    return response
  }
}));
