module.exports = {
  async alterTable({ strapi }) {
    const knex = await strapi.db.connection

    await knex
      .schema.alterTable('students', table => {
        table.unique('regno')
      })
      .catch(console.error)

    await knex.schema.alterTable('cohort_student_maps', table => {
      table.index(['classcode'])
      table.unique(['classcode', 'classno'])
      table.unique(['regno', 'school_year'])
    })
      .catch(console.error)

    await knex.schema.alterTable('conducts', table => {
      table.index(['item_code'])

    })
      .catch(console.error)

    const tableNames = [
      'attendances',
      'conducts',
      // 'merit_demerits'
    ]

    for (const tableName of tableNames) {
      await knex.schema.alterTable(tableName, table => {
        table.index(['regno', 'school_year', 'term'])
      })
        .catch(console.error)
    }
  }
}