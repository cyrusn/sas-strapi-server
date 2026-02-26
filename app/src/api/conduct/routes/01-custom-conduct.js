module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/conducts',
      handler: 'conduct.findBy'
    }, {
      method: 'POST',
      path: '/conducts',
      handler: 'conduct.createMany'
    }, {
      method: "GET",
      path: '/conducts/summary',
      handler: 'summary.findMany',
      // config: {
      //   auth: false
      // }
    }, {
      method: 'PUT',
      path: '/conducts',
      handler: 'conduct.updateMany'
    }, {
      method: 'DELETE',
      path: '/conducts',
      handler: 'conduct.deleteMany'
    }
  ]
}
