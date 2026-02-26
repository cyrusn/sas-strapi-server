'use strict';

/**
 *  attendance controller
 */

const {
  transformPaginationResponse
} = require('@strapi/strapi/lib/core-api/service/pagination');

const { parseQuery, transformCamelCaseKey, formattedSummaryEntity, ATTENDANCE_TYPES } = require('../../../helpers')
const { createCoreController } = require('@strapi/strapi').factories;
const { pick } = require('lodash')

module.exports = createCoreController('api::attendance.attendance', ({ strapi }) => ({
  async updateMany(ctx) {
    const { where, data } = ctx.request.body
    const response = await strapi.db.query('api::attendance.attendance').updateMany({
      where, data
    })
    return response
  },
  async createMany(ctx) {
    const { data } = ctx.request.body
    const response = await strapi.db.query('api::attendance.attendance').createMany({
      data
    })

    return response
  },
  async deleteMany(ctx) {
    const params = ctx.query
    const query = parseQuery([
      'api::attendance.attendance',
    ], pick(params, ['filters.id']))
    const { where } = query
    if ("attendances.id" in where) {
      const response = await strapi.db.query('api::attendance.attendance').deleteMany({
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
      'api::attendance.attendance',
      'api::student.student',
      'api::cohort-student-map.cohort-student-map',
    ], params)
    const { whereBuilder, orderBy, pagination, select, where } = query
    console.log(orderBy, pagination, select, where)
    const { start, limit } = pagination

    const queryBuilder = knex('attendances')
      .leftJoin('students', {
        "students.regno": "attendances.regno"
      })
      .leftJoin('cohort_student_maps', {
        "cohort_student_maps.regno": "attendances.regno", 
        "cohort_student_maps.school_year": "attendances.school_year"
      })
      .where(whereBuilder)

    const total = await queryBuilder
      .clone()
      .count('attendances.id')
      .first()


    const entity = await queryBuilder
      .select(select)
      .offset(start)
      .limit(limit)
      .orderBy(orderBy)

    const { count } = total

    let result = transformCamelCaseKey(entity)
    const sanitizedResult = await this.sanitizeOutput(result, ctx);
    return this.transformResponse(sanitizedResult, {
      pagination: transformPaginationResponse(pagination, count)
    });
  },
  async getSummary(ctx) {
    const knex = await strapi.db.connection
    const query = ctx.query

    const { whereBuilder: attendanceWhereBuilder, where, pagination } = parseQuery(
      ['api::attendance.attendance'],
      query,
      false
    )
    const { start, limit } = pagination
    const { sort = [] } = query

    // console.log(where, query)

    const attendanceTable = knex('attendance_summary')
      .where(attendanceWhereBuilder)

    const total = await attendanceTable.clone()
      .countDistinct('regno')
      .first()

    const entity = await attendanceTable
      .offset(start)
      .limit(limit)


    const skippedKeys = [
      'created_at', 'updated_at', 'created_by_id', 'updated_by_id'
    ]
    const formattedEntity = formattedSummaryEntity(entity, skippedKeys, ATTENDANCE_TYPES)

    const { count } = total
    let result = transformCamelCaseKey(formattedEntity)
    const sanitizedResult = await this.sanitizeOutput(result, ctx)
    const { meta, data } = this.transformResponse(sanitizedResult, {
      pagination: transformPaginationResponse(pagination, count)
    });
    return {
      meta, data: data.map(({ id, attributes }) => {
        return {
          id, ...attributes
        }
      })
    }
  }

}))