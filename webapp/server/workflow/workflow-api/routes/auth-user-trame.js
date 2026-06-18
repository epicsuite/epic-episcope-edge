const router = require('express').Router()
const { trame } = require('../controllers/trame-controller')
/**
 * /api/workflow/auth-user/trame
 *   post
 * */
router.post('/trame', async (req, res) => {
  await trame(req, res, 'user')
})

module.exports = router
