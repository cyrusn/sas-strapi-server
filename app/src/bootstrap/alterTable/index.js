const ignoreAlreadyExistsError = (error) => {
  // Postgres codes: 42P07 (duplicate_table), 42710 (duplicate_object)
  if (
    error.code === '42P07' ||
    error.code === '42710' ||
    error.message.includes('already exists')
  ) {
    return
  }
  console.error(error)
}

module.exports = {
  async up({ strapi }) {
    const knex = await strapi.db.connection

    await knex.schema
      .alterTable('students', (table) => {
        table.unique('regno')
      })
      .catch(ignoreAlreadyExistsError)

    await knex.schema
      .alterTable('cohort_student_maps', (table) => {
        table.unique(['regno', 'school_year'])
      })
      .catch(ignoreAlreadyExistsError)

    await knex.schema
      .alterTable('cohort_student_maps', (table) => {
        table.index(['classcode'])
      })
      .catch(ignoreAlreadyExistsError)

    await knex.schema
      .alterTable('conducts', (table) => {
        table.index(['item_code'])
      })
      .catch(ignoreAlreadyExistsError)

    const tableNames = ['attendances', 'conducts']

    for (const tableName of tableNames) {
      await knex.schema
        .alterTable(tableName, (table) => {
          table.index(['regno', 'school_year', 'term'])
        })
        .catch(ignoreAlreadyExistsError)
    }
  },
  async down({ strapi }) {
    const knex = await strapi.db.connection

    await knex.schema
      .alterTable('cohort_student_maps', (table) => {
        table.dropUnique(['regno', 'school_year'])
        table.dropIndex(['classcode'])
      })
      .catch(ignoreAlreadyExistsError)

    await knex.schema
      .alterTable('conducts', (table) => {
        table.dropIndex(['item_code'])
      })
      .catch(ignoreAlreadyExistsError)

    const tableNames = ['attendances', 'conducts']

    for (const tableName of tableNames) {
      await knex.schema
        .alterTable(tableName, (table) => {
          table.dropIndex(['regno', 'school_year', 'term'])
        })
        .catch(ignoreAlreadyExistsError)
    }
  }
}
