const { startTrame } = require('../trameUtil')

// eslint-disable-next-line consistent-return
const trame = async (req, res, type) => {
  await startTrame(req, res, type)
}

module.exports = {
  trame,
}
