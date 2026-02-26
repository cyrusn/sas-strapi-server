const {
  transformPaginationResponse
} = require('@strapi/strapi/lib/core-api/service/pagination');
const {
  convertSortQueryParams,
} = require('@strapi/utils/lib/convert-query-params');


const { parseQuery, transformCamelCaseKey, ATTENDANCE_TYPES, formattedSummaryEntity } = require('../../../helpers')
const { applyWhere } = require('@strapi/database/lib/query/helpers')

const { createCoreController } = require('@strapi/strapi').factories;
const _ = require('lodash')

module.exports = createCoreController('api::conduct.conduct', ({ strapi }) => ({
  async findMany(ctx) {
    const knex = await strapi.db.connection
    const query = ctx.query

    const { whereBuilder, pagination, orderBy } = parseQuery(
      [
        'api::student.student',
        'api::cohort-student-map.cohort-student-map',
      ],
      query
    )
    const { where: conductWhere, whereBuilder: conductWhereBuilder } = parseQuery(
      ['api::conduct.conduct'],
      query,
      false
    )

    const { where: attendanceWhere, whereBuilder: attendanceWhereBuilder } = parseQuery(
      ['api::attendance.attendance'],
      query,
      false
    )

    const { start, limit } = pagination

    const ITEM_CODES = [101, 103, 105, 107, 110, 117, 125, 130, 150, 170, 190, 210, 230, 240, 250, 270, 290, 293, 296, 340, 350, 360, 370, 380]
    const MERIT_DEMERIT_CODES = [610, 620, 630, 900, 930, 950]

    const ALL_CODES_AND_TYPES = [...ITEM_CODES, ...MERIT_DEMERIT_CODES, ...ATTENDANCE_TYPES]

    const { sort = [] } = query
    convertSortQueryParams(sort)
      .filter(obj => {
        const key = Object.keys(obj)[0]
        return ALL_CODES_AND_TYPES.map(_.camelCase).includes(key)
      })
      .map(obj => {
        const result = {}
        for (const key in obj) {
          result['column'] = _.snakeCase(key).toUpperCase()
          result['order'] = obj[key]
        }
        return result
      })
      .forEach(order => orderBy.push(order))

    strapi.log.debug(conductWhere, attendanceWhere)

    const attendanceTable = knex('attendances')
      .select(
        ATTENDANCE_TYPES.map(typ => {
          return knex.raw(`count(type) FILTER (WHERE type='${typ}') as "${typ}"`)
        })
      )
      .select('regno')
      .where(attendanceWhereBuilder)
      .groupBy('regno', 'school_year', 'term')
      .as('attendanceTable')

    const conductTable = knex('conducts')
      .where(conductWhereBuilder)
      .groupBy('regno', 'school_year', 'term')
      .select([
        'regno',
        ...ITEM_CODES.map(code => {
          return knex.raw(`sum(mark) FILTER (WHERE item_code =${code}) as "${code}"`)
        }),
        ...MERIT_DEMERIT_CODES.map(code => {
          return knex.raw(`count(*) FILTER (WHERE item_code=${code}) as "${code}"`)
        })
      ])
      .as('conductTable')


    const queryBuilder = knex('cohort_student_maps')

    const joinedQueryBuilder = queryBuilder
      .leftJoin(attendanceTable, {
        "attendanceTable.regno": "cohort_student_maps.regno"
      })
      .leftJoin(conductTable, {
        "conductTable.regno": "cohort_student_maps.regno"
      })
      .leftJoin('students', {
        "cohort_student_maps.regno": "students.regno"
      })
      .where(whereBuilder)

    const total = await joinedQueryBuilder.clone()
      .countDistinct('students.regno')
      .where(whereBuilder)
      .first()

    const entity = await joinedQueryBuilder
      .offset(start)
      .limit(limit)
      .orderBy(orderBy)

    const skippedKeys = [
      'created_at', 'updated_at', 'created_by_id', 'updated_by_id'
    ]
    const formattedEntity = formattedSummaryEntity(entity, skippedKeys, ALL_CODES_AND_TYPES)


    const { count } = total
    let result = transformCamelCaseKey(formattedEntity)
    const sanitizedResult = await this.sanitizeOutput(result, ctx);
    return this.transformResponse(sanitizedResult, {
      pagination: transformPaginationResponse(pagination, count)
    });
  }
}))
