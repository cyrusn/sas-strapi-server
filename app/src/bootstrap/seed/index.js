const _ = require('lodash')
const students = require('./data/student.json')
const { ITEM_CODES, TEACHERS, ABSENT_TYPES, OFFICE_ADMINS, MERIT_DEMERIT_CODES } = require('./data/constant')
const schoolYear = 2021
const term = 2


function randomEventDate() {
  return `2022-0${_.sample([3, 4, 5, 6, 7])}-${_.random(1, 30).toString().padStart(2, "0")}`
}

function randomText() {
  return Buffer.from(Math.random().toString()).toString("base64")
}

module.exports = {
  async clearDatabase({ strapi }) {
    strapi.log.debug('clearing database ...')
    await Promise.all([
      strapi.db.query('api::student.student').deleteMany(),
      strapi.db.query('api::conduct.conduct').deleteMany(),
      strapi.db.query('api::cohort-student-map.cohort-student-map').deleteMany(),
      strapi.db.query('api::attendance.attendance').deleteMany(),
    ]).catch(console.error)
  },
  async importData({ strapi }) {
    const studentData = students.map(({ regno, sex, house, name, cname }) => ({ regno, sex, house, name, cname }))
    const cohortStudentMapData = students.map(({ regno, classcode, classno }) => ({
      regno, classcode, classno, schoolYear: 2021, status: 'ACTIVE'
    }))


    function generateConductData(n) {
      const data = []
      for (let i = 0; i < n; i++) {
        const { regno, classcode, classno } = _.sample(students)
        const itemCode = _.sample(ITEM_CODES)
        const mark = Math.floor(itemCode / 100) === 3 ? _.random(1, 3) : - _.random(1, 3)
        const datum = {
          regno, classcode, classno,
          itemCode,
          schoolYear,
          term,
          eventDate: randomEventDate(),
          mark,
          teacher: _.sample(TEACHERS),
          description: randomText(),
          informedAt: _.sample([true, false, false, false, false, false]) ? randomEventDate() : null,
          isImportFromJournal: _.sample([true, false, false, false, false, false]),
        }
        data.push(datum)
      }
      return data
    }

    function generateAttendanceData(n) {
      const data = []

      for (let i = 0; i < n; i++) {
        const { regno } = _.sample(students)
        const type = _.sample(ABSENT_TYPES)
        let noOfAbsentedLesson
        let isLeaveOfAbsence
        switch (type) {
          case "ABSENT_NORMAL_AM":
            noOfAbsentedLesson = 4
            isLeaveOfAbsence = _.sample([true, true, true, false])
            break
          case "ABSENT_HALF_DAY":
            noOfAbsentedLesson = 5
            isLeaveOfAbsence = _.sample([true, true, true, false])
            break
          case "ABSENT_ONLINE_LESSON":
            noOfAbsentedLesson = _.random(1, 6)
            isLeaveOfAbsence = _.sample([true, true, true, false])
            break;
          case "ABSENT_NORMAL_PM":
            noOfAbsentedLesson = 2
            isLeaveOfAbsence = _.sample([true, true, true, false])
            break;
          case "LATE":
            noOfAbsentedLesson = _.random(0, 2)
            break;
          case "EARLY_LEAVE":
            noOfAbsentedLesson = _.random(1, 2)
            break;
        }

        const datum = {
          regno, schoolYear, term, type, noOfAbsentedLesson, isLeaveOfAbsence, recordedBy: _.sample(OFFICE_ADMINS),
          eventDate: randomEventDate()
        }
        data.push(datum)
      }
      return data
    }


    function generateMeritDemeritData(n) {
      const data = []

      for (let i = 0; i < n; i++) {
        data.push(generateMeritDemeritData())
        const { regno } = _.sample(students)
        const datum = {
          regno, schoolYear, term, eventDate: randomEventDate(), description: randomText(), itemCode: _.sample(MERIT_DEMERIT_CODES), teacher: _.sample(TEACHERS), mark: 0, informedAt: _.sample([true, false, false, false, false, false]) ? randomEventDate() : null,
        }
        data.push(datum)
      }
      return data
    }

    Promise.all([
      await strapi.db.query('api::student.student').createMany({ data: studentData }),
      await strapi.db.query('api::cohort-student-map.cohort-student-map').createMany({ data: cohortStudentMapData }),
      await strapi.db.query('api::conduct.conduct').createMany({ data: generateConductData(5000) }),
      await strapi.db.query('api::conduct.conduct').createMany({ data: generateConductData(5000) }),
      await strapi.db.query('api::conduct.conduct').createMany({ data: generateConductData(5000) }),
      await strapi.db.query('api::conduct.conduct').createMany({ data: generateConductData(5000) }),
      await strapi.db.query('api::attendance.attendance').createMany({ data: generateAttendanceData(4000) }),
      await strapi.db.query('api::attendance.attendance').createMany({ data: generateAttendanceData(4000) }),
      await strapi.db.query('api::conduct.conduct').createMany({ data: generateMeritDemeritData(500) }),
    ]).catch(console.error)
  }

}