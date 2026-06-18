const router = require('express').Router()
const { trame } = require('../controllers/trame-controller')
/**
 * /api/workflow/public/trame
 *   post
 * */
router.post('/trame', async (req, res) => {
  await trame(req, res, 'public')
})

module.exports = router
