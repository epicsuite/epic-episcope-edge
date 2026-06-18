const router = require('express').Router()
const passport = require('passport')
const dataRoutes = require('./workflow-api/routes/data')
const trameRoutes = require('./workflow-api/routes/trame')
const authUserTrameRoutes = require('./workflow-api/routes/auth-user-trame')

router.use('/data', dataRoutes)
// Add more workflow-specific routes here
router.use('/public', trameRoutes)
router.use(
  '/auth-user',
  passport.authenticate('user', { session: false }),
  authUserTrameRoutes,
)

module.exports = router
