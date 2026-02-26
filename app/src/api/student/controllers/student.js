'use strict'

/**
 *  student controller
 */

const { createCoreController } = require('@strapi/strapi').factories
const {
  transformPaginationResponse
} = require('@strapi/strapi/lib/core-api/service/pagination')
const { parseQuery, transformCamelCaseKey } = require('../../../helpers')

module.exports = createCoreController('api::student.student', ({ strapi }) => ({
  async findBy(ctx) {
    const params = ctx.query
    const query = parseQuery(
      ['api::cohort-student-map.cohort-student-map', 'api::student.student'],
      params
    )
    const { where, orderBy, pagination, select } = query
    const { start, limit } = pagination

    const knex = await strapi.db.connection
    const queryBuilder = knex('cohort_student_maps')
      .leftJoin('students', {
        'students.regno': 'cohort_student_maps.regno'
      })
      .where(where)

    const total = await queryBuilder
      .clone()
      .count('cohort_student_maps.id')
      .first()

    const entity = await queryBuilder
      .select(select)
      .orderBy(orderBy)
      .offset(start)
      .limit(limit)

    const { count } = total
    let result = transformCamelCaseKey(entity)
    const sanitizedResult = await this.sanitizeOutput(result, ctx)
    return this.transformResponse(sanitizedResult, {
      pagination: transformPaginationResponse(pagination, count)
    })
  },
  async updateF6Transition(ctx) {
    const { schoolYear } = ctx.request.body

    if (!schoolYear) return

    const knex = await strapi.db.connection

    const results = await Promise.all([
      knex.raw(`
UPDATE conducts as c
SET
  term = 2
FROM
  cohort_student_maps as m
WHERE
  m.regno = c.regno AND
  m.classcode ~ '^6'AND
  c.school_year = ${schoolYear} AND
  c.term = 1;
`),
      knex.raw(`
UPDATE attendances as c
SET
  term = 2
FROM
  cohort_student_maps as m
WHERE
  m.regno = c.regno AND
  m.classcode ~ '^6'AND
  c.school_year = ${schoolYear} AND
  c.term = 1;
`)
    ]).catch(console.error)

    return results
  },
  async updateStudents(ctx) {
    const { students } = ctx.request.body

    if (!students) return

    const studentData = students.map(({ regno, name, sex, house, cname }) => ({
      regno,
      sex,
      house,
      name,
      cname
    }))

    const knex = await strapi.db.connection

    const results = await Promise.all(
      studentData.map((student) => {
        const { regno, sex, house, cname, name } = student
        return knex('students').where({ regno }).update({
          sex,
          house,
          cname,
          name
        })
      })
    )

    return results
  },
  async updateStatus(ctx) {
    const { where, status } = ctx.request.body
    const response = await strapi.db
      .query('api::cohort-student-map.cohort-student-map')
      .updateMany({
        where,
        data: {
          status
        }
      })
    return response
  },
  async createStudent(ctx) {
    const { students } = ctx.request.body
    const studentData = students.map(({ regno, sex, house, name, cname }) => ({
      regno,
      sex,
      house,
      name,
      cname
    }))

    const cohortStudentMapData = students.map(
      ({ regno, classcode, classno, schoolYear }) => ({
        regno,
        classcode,
        classno,
        school_year: schoolYear,
        status: 'ACTIVE'
      })
    )

    const knex = await strapi.db.connection

    const result = await Promise.all([
      knex('students')
        .insert(studentData)
        .onConflict(['regno'])
        .merge(['cname', 'name']),
      knex('cohort_student_maps')
        .insert(cohortStudentMapData)
        .onConflict(['regno', 'school_year'])
        .merge(['classcode', 'classno'])
    ]).catch(console.error)

    return result
  }
}))
