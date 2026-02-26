module.exports = {
  routes: [{
    method: 'GET',
    path: '/attendances/summary',
    handler: 'attendance.getSummary',
    config: {
      auth: false
    }
  }, {
    method: 'GET',
    path: '/attendances',
    handler: 'attendance.findBy'
  }, {
    method: 'POST',
    path: '/attendances',
    handler: 'attendance.createMany'
  }, {
    method: 'PUT',
    path: '/attendances',
    handler: 'attendance.updateMany'
  }, {
    method: 'DELETE',
    path: '/attendances',
    handler: 'attendance.deleteMany'
  }
  ]
}
