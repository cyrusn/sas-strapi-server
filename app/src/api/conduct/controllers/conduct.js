'use strict';

/**
 *  conduct controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const {
  transformPaginationResponse,
} = require('@strapi/strapi/lib/core-api/service/pagination');
const { parseQuery, transformCamelCaseKey } = require('../../../helpers')
const { pick } = require('lodash')

module.exports = createCoreController('api::conduct.conduct', ({ strapi }) => ({
  async updateMany(ctx) {
    const { where, data } = ctx.request.body
    const response = await strapi.db.query('api::conduct.conduct').updateMany({
      where, data
    })
    return response
  },
  async createMany(ctx) {
    const { data } = ctx.request.body
    const response = await strapi.db.query('api::conduct.conduct').createMany({
      data
    })

    return response
  },
  async deleteMany(ctx) {
    const params = ctx.query
    const query = parseQuery([
      'api::conduct.conduct',
    ], pick(params, ['filters.id']))
    const { where } = query
    if ("conducts.id" in where) {
      const response = await strapi.db.query('api::conduct.conduct').deleteMany({
        where
      })
      return response
    } else {
      return { count: 0 }
    }
  },
  async findBy(ctx) {
    const params = ctx.query
    const knex = await strapi.db.connection
    const query = parseQuery([
      'api::conduct.conduct',
      'api::student.student',
      'api::cohort-student-map.cohort-student-map',
    ], params)
    const { whereBuilder, orderBy, pagination, select } = query
    const { start, limit } = pagination

    const queryBuilder = knex('conducts')
      .leftJoin('students', {
        "students.regno": "conducts.regno"
      })
      .leftJoin('cohort_student_maps', {
        "cohort_student_maps.regno": "conducts.regno",
        "cohort_student_maps.school_year": "conducts.school_year"
      })
      .where(whereBuilder)

    const total = await queryBuilder
      .clone()
      .count('conducts.id')
      .first()

    strapi.log.debug(select)

    const entity = await queryBuilder
      .select(select)
      .select('conducts.id as id')
      .offset(start)
      .limit(limit)
      .orderBy(orderBy)

    const { count } = total

    let result = transformCamelCaseKey(entity)
    const sanitizedResult = await this.sanitizeOutput(result, ctx);
    return this.transformResponse(sanitizedResult, {
      pagination: transformPaginationResponse(pagination, count)
    });
  }
}));
