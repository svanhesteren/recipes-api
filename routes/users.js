const router = require('express').Router()
const { User } = require('../models')
const passport = require('../config/auth')


router.post('/users', (req, res, next) => {
  User.register(new User({name: req.body.name, email: req.body.email}), req.body.password, (err, user) => {
    if(err) {
      err.status = 422
      return next(err)
    }

    const {name, email, createdAt, updatedAt} = user

    res.status(201).send(user)   // is response back to browser

    // next()   // when we want another middleware thing to follow after this
  })
})


router.get('/users', (req, res, next) => {
  User.find()
    // Newest recipes first
    .sort({ createdAt: -1 })
    // Send the data in JSON format
    .then((users) => res.json(users))
    // Throw a 500 error if something goes wrong
    .catch((error) => next(error))
  })

  router.get('/users/me', passport.authorize('jwt', { session: false }), (req, res, next) => {
    // Once authorized, the user data should be in `req.account`!
    if (!req.account) {
      const error = new Error('Unauthorized')
      error.status = 401
      next(error)
    }

    res.json(req.account)
  })
// .delete('/users/:id', (req, res, next) => {
//   const user =
// })
// .get('/users/me', (req, res, next) => {
//   const id = req.params.id
//   Recipe.findById(id)
//     .then((recipe) => {
//       if (!recipe) { return next() }
//       res.json(recipe)
//     })
//     .catch((error) => next(error))
// })
module.exports = router
