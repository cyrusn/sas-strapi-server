const { ATTENDANCE_TYPES } = require('../../helpers')

module.exports = {

  async createAttendanceSummaryView({ strapi }) {
    const knex = await strapi.db.connection

    const attendanceSummaryTable = knex('attendances')
      .select(['regno', 'school_year', 'term'])
      .select(
        ATTENDANCE_TYPES.map(typ => {
          return knex.raw(`count(type) FILTER (WHERE type='${typ}') as "${typ}"`)
        })
      )
      .groupBy(['regno', 'school_year', 'term'])

    await knex.schema.createViewOrReplace('attendance_summary', function (view) {
      view.columns(['regno', 'school_year', 'term']);
      view.as(
        attendanceSummaryTable
      );
    })
  },
  async createConductSummaryView({ strapi }) {
    const knex = await strapi.db.connection

    const ITEM_CODES = [101, 103, 105, 107, 110, 117, 125, 130, 150, 170, 190, 210, 230, 240, 250, 270, 290, 293, 296, 340, 350, 360, 370, 380]
    const MERIT_DEMERIT_CODES = [610, 620, 630, 900, 930, 950]

    const conductSummaryTable = knex('conducts')
      .select(['regno', 'school_year', 'term'])
      .select([
        ...ITEM_CODES.map(code => {
          return knex.raw(`sum(mark) FILTER (WHERE item_code =${code}) as "${code}"`)
        }),
        ...MERIT_DEMERIT_CODES.map(code => {
          return knex.raw(`count(*) FILTER (WHERE item_code=${code}) as "${code}"`)
        })
      ])
      .groupBy(['regno', 'school_year', 'term'])


    await knex.schema.createViewOrReplace('conduct_summary', function (view) {
      view.columns(['regno', 'school_year']);
      view.as(
        conductSummaryTable
      );
    })
  }
}