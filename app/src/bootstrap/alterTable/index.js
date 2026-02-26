module.exports = {
  async up({ strapi }) {
    const knex = await strapi.db.connection

    await knex
      .schema.alterTable('students', table => {
        table.unique('regno')
      })
      .catch(console.error)

    await knex.schema.alterTable('cohort_student_maps', table => {
      table.unique(['regno', 'school_year'])
      table.index(['classcode'])
    })
      .catch(console.error)

    await knex.schema.alterTable('conducts', table => {
      table.index(['item_code'])
    })
      .catch(console.error)

    const tableNames = [
      'attendances',
      'conducts',
    ]

    for (const tableName of tableNames) {
      await knex.schema.alterTable(tableName, table => {
        table.index(['regno', 'school_year', 'term'])
      })
        .catch(console.error)
    }
  },
  async down({ strapi }) {
    const knex = await strapi.db.connection

    await knex
      .schema.alterTable('students', table => {
        table.dropUnique('regno')
      })
      .catch(console.error)

    await knex.schema.alterTable('cohort_student_maps', table => {
      table.dropUnique(['regno', 'school_year'])
      table.dropIndex(['classcode'])
    })
      .catch(console.error)

    await knex.schema.alterTable('conducts', table => {
      table.dropIndex(['item_code'])

    })
      .catch(console.error)

    const tableNames = [
      'attendances',
      'conducts',
    ]

    for (const tableName of tableNames) {
      await knex.schema.alterTable(tableName, table => {
        table.dropIndex(['regno', 'school_year', 'term'])
      })
        .catch(console.error)
    }
  },
}