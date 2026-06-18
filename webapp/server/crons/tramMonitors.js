const moment = require('moment')
const { exec } = require('child_process')
const Trame = require('../workflow/workflow-api/models/trame')
const logger = require('../utils/logger')
const config = require('../workflow/config')

const trameMonitor = async () => {
  logger.debug('Trame monitor')
  // kill the trame instance process and delete trame from DB after deleteGracePeriod
  const deleteGracePeriod = moment().subtract(
    config.EPIC.TRAME_DELETE_GRACE_PERIOD_HOURS,
    'hours',
  )
  Trame.find({ updated: { $lte: deleteGracePeriod } }).then(trames => {
    trames.forEach(trame => {
      logger.debug(`Delete trame ${trame}`)
      // kill the trame process
      exec(`kill -9 ${trame.pid}`, (error, stdout, stderr) => {
        if (error) {
          logger.error(error.message)
        }
        if (stderr) {
          logger.error(stderr)
        }
      })
      // delete from database
      Trame.deleteOne({ user: trame.user }, err => {
        if (err) {
          logger.info('Failed to delete trame')
        }
      })
    })
  })
}

// moniter public trame every 3 mins
const publicTrameMonitor = async () => {
  logger.debug('Public Trame monitor')
  // kill the trame instance process and delete trame from DB after deleteGracePeriod
  const deleteGracePeriod = moment().subtract(
    config.EPIC.TRAME_PUBLIC_DELETE_GRACE_PERIOD_HOURS,
    'hours',
  )
  Trame.find({ user: 'public', updated: { $lte: deleteGracePeriod } }).then(
    trames => {
      trames.forEach(trame => {
        logger.debug(`Delete trame ${trame}`)
        // kill the trame process
        exec(`kill -9 ${trame.pid}`, (error, stdout, stderr) => {
          if (error) {
            logger.error(error.message)
          }
          if (stderr) {
            logger.error(stderr)
          }
        })
        // delete from database
        Trame.deleteOne({ user: trame.user }, err => {
          if (err) {
            logger.info('Failed to delete trame')
          }
        })
      })
    },
  )
}

module.exports = {
  trameMonitor,
  publicTrameMonitor,
}
