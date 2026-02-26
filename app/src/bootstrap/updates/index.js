const _ = require('lodash')
const students = require('../seed/data/student.json')

module.exports = {
  async updateStudent({ strapi }) {
    const studentData = students.map(({ regno, sex, house, name, cname }) => ({ regno, sex, house, name, cname }))
    const cohortStudentMapData = students.map(({ regno, classcode, classno, school_year }) => ({
      regno, classcode, classno, school_year, status: 'ACTIVE'
    }))

    strapi.log.debug(cohortStudentMapData)

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
}