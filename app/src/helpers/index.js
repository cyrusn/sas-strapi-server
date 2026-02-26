const {
  transformParamsToQuery
} = require('@strapi/strapi/lib/services/entity-service/params');

const {
  getPaginationInfo, convertPagedToStartLimit,
} = require('@strapi/strapi/lib/core-api/service/pagination');

const { applyWhere } = require('@strapi/database/lib/query/helpers')

const _ = require('lodash')

module.exports = {
  ATTENDANCE_TYPES: [
    'LATE_NORMAL_AM',
    'LATE_NORMAL_PM',
    'LATE_HALF_DAY',
    "ABSENT_NORMAL_AM",
    "ABSENT_NORMAL_PM",
    "ABSENT_HALF_DAY",
    "ABSENT_ONLINE_LESSON",
    "EARLY_LEAVE"
  ],
  formattedSummaryEntity(entity, skippedKeys, parseIntKeys) {
    return entity.map(content => {

      for (const key in content) {
        if (skippedKeys.includes(key)) {
          delete content[key]
          continue
        }

        if (!content[key]) {
          content[key] = 0
          continue
        }

        if (parseIntKeys.map(String).includes(key)) {
          content[key] = parseInt(content[key])
          continue
        }
      }
      return content
    })
  },
  transformCamelCaseKey: function transformCamelCaseKey(entity) {
    if (_.isPlainObject(entity)) {
      return _.mapKeys(entity, (_val, key) => _.camelCase(key))
    }

    if (_.isArray(entity)) {
      return _.map(entity, transformCamelCaseKey)
    }

    throw new Error('entity must be an object or array')

  },
  parseQuery(uids, query, haveCollectionName = true) {
    const defaultQuery = {
      where: {}, orderBy: [], select: []
    }

    const handledWhereKey = []
    const handledSelects = []

    const { where, orderBy, select } = _.reduce(uids, (prev, uid, n) => {
      const contentType = strapi.contentType(uid)

      const { collectionName, attributes } = contentType
      const { where, orderBy, select } = transformParamsToQuery(uid, query)


      if (!_.isNil(select)) {
        for (const key of select) {
          if (handledSelects.includes(key)) continue
          if (!(key in attributes)) continue
          handledSelects.push(key)
          const columnName = _.snakeCase(key)
          // prev.select.push(haveCollectionName ? `${collectionName}.${columnName}` : columnName)
          prev.select.push(haveCollectionName ? `${collectionName}.${columnName}` : columnName)
        }
      }

      if (!_.isNil(orderBy)) {
        for (const obj of orderBy) {
          for (const key in obj) {
            if (!(key in attributes)) {
              continue
            }
            const columnName = _.snakeCase(key)
            prev.orderBy.push(
              {
                column: haveCollectionName ? `${collectionName}.${columnName}` : columnName,
                order: obj[key]
              }
            )
          }
        }
      }

      if (!_.isNil(where)) {
        for (let key in where) {
          const columnName = _.snakeCase(key)

          if (key === 'id' && n === 0) {
            const idKey = haveCollectionName ? `${collectionName}.id` : "id"
            prev.where[idKey] = where[key]
          }

          if (!(key in attributes)) continue

          if (handledWhereKey.includes(key)) continue
          const whereKey = haveCollectionName ? `${collectionName}.${columnName}` : columnName
          prev.where[whereKey] = where[key]
          handledWhereKey.push(key)
        }
      }

      return prev
    }, defaultQuery)

    const pagination = getPaginationInfo(query)
    // console.log({ where, orderBy, pagination, select })
    const contentType = strapi.contentType(uids[0])
    const { collectionName } = contentType
    // const { attributes: schemaAttribute } = __schema__
    const informationFields = ['id', 'createdAt', 'updatedAt']

    const formattedInformationFields = informationFields.map(key => {
      const snakeCasedKey = _.snakeCase(key).toLowerCase()
      return `${collectionName}.${snakeCasedKey} as ${snakeCasedKey} `
    })

    return {
      where,
      whereBuilder: qb => applyWhere(qb, where),
      orderBy,
      pagination: { ...convertPagedToStartLimit(pagination), ...pagination },
      select: select.length === 0 ? ['*', ...formattedInformationFields] : [...select, ...formattedInformationFields]
    }
  },
}