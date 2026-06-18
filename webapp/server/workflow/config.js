/**
 * Configure the workflow based upon environment variables.
 */

const path = require('path')

const makeIntIfDefined = val =>
  typeof val === 'string' ? parseInt(val, 10) : undefined

// Determine several reusable directory paths based upon environment variables
// and/or the path to the directory containing this `config.js` file.
const appServerDir = process.env.APP_SERVER_DIR
  ? process.env.APP_SERVER_DIR
  : __dirname
const WORKFLOW_DATA_BASE_DIR = path.join(
  appServerDir,
  '../../../workflows/data',
)
const IO_BASE_DIR = path.join(appServerDir, '../../../io')

const workflowConfig = {
  DATA_DIR: WORKFLOW_DATA_BASE_DIR,
  data: {
    REF_LIST:
      process.env.WORKFLOW_REF_LIST ||
      path.join(WORKFLOW_DATA_BASE_DIR, 'Ref_list.json'),
  },
  assayDesign: {
    SPECIES_JSON:
      process.env.SPECIES_JSON ||
      path.join(WORKFLOW_DATA_BASE_DIR, 'species.json'),
    SPECIES_TREE_JSON:
      process.env.SPECIES_TREE_JSON ||
      path.join(WORKFLOW_DATA_BASE_DIR, 'speciesTree4UI.json'),
    BIOAI_EXEC: process.env.BIOAI_EXEC || '/opt/bioai/pipeline/bioai_runner.py',
  },
  // Add more workflow-specific configuration settings here
  EPIC: {
    // Directory to store trame view temp files
    TRAME_BASE_DIR:
      process.env.EPIC_STRUCTURE_BASE_DIR || path.join(IO_BASE_DIR, 'trame'),
    // Directory to store trame applications
    TRAME_APP_BASE_DIR:
      process.env.EPIC_TRAME_APP_BASE_DIR ||
      path.join(__dirname, '../../trame/apps'),
    TRAME_BASE_URL: process.env.EPIC_TRAME_BASE_URL || 'http://localhost:',
    TRAME_PUBLIC_PORT_START:
      makeIntIfDefined(process.env.EPIC_TRAME_PUBLIC_PORT_START) || 8001,
    TRAME_PUBLIC_PORT_END:
      makeIntIfDefined(process.env.EPIC_TRAME_PUBLIC_PORT_END) || 8010,
    TRAME_USER_PORT_START:
      makeIntIfDefined(process.env.EPIC_TRAME_USER_PORT_START) || 8011,
    TRAME_USER_PORT_END:
      makeIntIfDefined(process.env.EPIC_TRAME_USER_PORT_END) || 8020,
    // in hours, trame http instance will be deleted after the grace period
    TRAME_DELETE_GRACE_PERIOD_HOURS:
      makeIntIfDefined(process.env.EPIC_TRAME_DELETE_GRACE_PERIOD_HOURS) || 12,
    // in hours, trame http instance will be deleted after the grace period
    TRAME_PUBLIC_DELETE_GRACE_PERIOD_HOURS:
      makeIntIfDefined(
        process.env.EPIC_PUBLIC_TRAME_DELETE_GRACE_PERIOD_HOURS,
      ) || 1,
    // startup duration 30 seconds
    TRAME_STARTUP_DURATION:
      makeIntIfDefined(process.env.EPIC_TRAME_STARTUP_DURATION) || 30000,
    // paraview bin directory
    PV_BIN_DIR: process.env.EPIC_PV_BIN_DIR || 'PV_BIN_DIR-not-found-in-env',
    EPICSCOPE_ENV:
      process.env.EPIC_EPICSCOPE_ENV || 'EPICSCOPE_ENV-not-found-in-env',
  },
  CRON: {
    SCHEDULES: {
      TRAME_MONITOR: process.env.CRON_TRAME_MONITOR || '0 4 * * *',
      TRAME_PUBLIC_MONITOR:
        process.env.CRON_TRAME_PUBLIC_MONITOR || '*/3 * * * *',
    },
  },
}

module.exports = workflowConfig
