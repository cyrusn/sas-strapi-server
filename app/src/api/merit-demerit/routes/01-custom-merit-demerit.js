module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/meritDemerits',
      handler: 'merit-demerit.createMany'
    }, {
      method: 'DELETE',
      path: '/meritDemerits',
      handler: 'merit-demerit.deleteMany'
    }
  ]
}
