"use strict";
const { up, down } = require("./bootstrap/alterTable");
const {
  createAttendanceSummaryView,
  createConductSummaryView,
} = require("./bootstrap/views");
const { updateStudent } = require("./bootstrap/updates");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  async register({ strapi }) {
    // console.log('registering ... ')
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  // bootstrap(/*{ strapi }*/) {},
  async bootstrap({ strapi }) {
    console.log("bootstraping ...");

    // const { clearDatabase, importData } = require('./bootstrap/seed')
    // await clearDatabase({ strapi })
    // await createViews({ strapi })
    // await importData({ strapi })
    await up({ strapi });
    await createAttendanceSummaryView({ strapi });
    await createConductSummaryView({ strapi });
    const result = await updateStudent({ strapi });
    console.log(result);
  },
  async destroy({ strapi }) {
    console.log("destroying ...");

    await down({ strapi });
  },
};
