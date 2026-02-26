module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/students',
      handler: 'student.findBy'
    },
    {
      method: 'PUT',
      path: '/students/status',
      handler: 'student.updateStatus'
    },
    {
      method: 'POST',
      path: '/students',
      handler: 'student.createStudent'
    },
    {
      method: 'PUT',
      path: '/students',
      handler: 'student.updateStudents'
    },
    {
      method: 'PUT',
      path: '/students/transition',
      handler: 'student.updateF6Transition'
    }
  ]
}
