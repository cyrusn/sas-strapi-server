'use strict';

/**
 *  merit-demerit controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const {
  transformPaginationResponse,
} = require('@strapi/strapi/lib/core-api/service/pagination');

const { parseQuery, transformCamelCaseKey } = require('../../../helpers')


module.exports = createCoreController('api::merit-demerit.merit-demerit', ({ strapi }) => ({
  async createMany(ctx) {
    const { data } = ctx.request.body
    const response = await strapi.db.query('api::merit-demerit.merit-demerit').createMany({
      data
    })

    return response
  },
  async deleteMany(ctx) {
    const params = ctx.query
    const query = parseQuery([
      'api::merit-demerit.merit-demerit',
    ], pick(params, ['filters.id']))
    const { where } = query
    if ("merit-demerits.id" in where) {
      const response = await strapi.db.query('api::merit-demerit.merit-demerit').deleteMany({
        where
      })
      return response
    } else {
      return { count: 0 }
    }
  },
}));
