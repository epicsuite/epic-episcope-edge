const fs = require('fs')
const xlsx = require('node-xlsx').default
const YAML = require('json-to-pretty-yaml')
const { execCmd } = require('../utils/common')
const config = require('../config')
const workflowConfig = require('./config')

const cromwellWorkflows = []
const nextflowWorkflows = ['sra2fastq', 'fdgenome']
const nextflowConfigs = {
  profiles: `${config.NEXTFLOW.WORKFLOW_DIR}/common/profiles.nf`,
  nf_reports: `${config.NEXTFLOW.WORKFLOW_DIR}/common/nf_reports.tmpl`,
}

const workflowList = {
  sra2fastq: {
    outdir: 'output/sra2fastq',
    nextflow_main: process.env.NEXTFLOW_MAIN
      ? `${process.env.NEXTFLOW_MAIN} -profile local`
      : `${config.NEXTFLOW.WORKFLOW_DIR}/sra2fastq/nextflow/main.nf -profile local`,
    config_tmpl: `${config.NEXTFLOW.WORKFLOW_DIR}/sra2fastq/workflow_config.tmpl`,
  },
  fdgenome: {
    outdir: 'output/epic',
    indir: 'input',
    nextflow_main: process.env.NEXTFLOW_MAIN
      ? `${process.env.NEXTFLOW_MAIN} -profile ${process.env.NEXTFLOW_PROFILE ? process.env.NEXTFLOW_PROFILE : 'standard'}`
      : `${config.NEXTFLOW.WORKFLOW_DIR}/epicedge_main.nf -profile ${process.env.NEXTFLOW_PROFILE ? process.env.NEXTFLOW_PROFILE : 'standard'}`,
    config_tmpl: `${config.NEXTFLOW.WORKFLOW_DIR}/epic/fdgenome.tmpl`,
    conda_env: '/panfs/biopan04/4DGENOMESEQ/HIC2STRUCTURE/envs/epicedge',
    executor_config: `${config.NEXTFLOW.WORKFLOW_DIR}/epic/fdgenome_executor.conf`,
  },
}

// eslint-disable-next-line no-unused-vars
const generateNextflowWorkflowParams = async (projHome, projectConf, proj) => {
  const params = {}
  if (projectConf.workflow.name === 'sra2fastq') {
    // download sra data to shared directory
    params.sraOutdir = config.IO.SRA_BASE_DIR
  }
  if (projectConf.workflow.name === 'fdgenome') {
    // generate input.yaml
    const json = {
      ensemble: {
        verion: '1.0',
        meta: { title: proj.name, desc: proj.desc },
        license: 'somename.txt',
        reference: {
          sequence: fs.realpathSync(
            projectConf.workflow.input.reference.sequence,
          ),
          annotation: fs.existsSync(
            projectConf.workflow.input.reference.annotation,
          )
            ? fs.realpathSync(projectConf.workflow.input.reference.annotation)
            : null,
          mitochondria: projectConf.workflow.input.reference.mitochondria,
          resolution: projectConf.workflow.input.reference.resolution || 10000,
          contigs: fs.realpathSync(
            projectConf.workflow.input.reference.genomelist,
          ),
        },
        experiments: [],
      },
    }

    projectConf.workflow.input.experiments.forEach(exp => {
      const e = {
        name: exp.name,
        sample: exp.sample,
        replicate: exp.replicate,
        desc: exp.desc,
        timesteps: [],
      }
      exp.timesteps.forEach(ts => {
        e.timesteps.push({
          name: ts.name,
          structure: fs.realpathSync(ts.structure),
          struct_stage: ts.struct_stage,
        })
      })
      json.ensemble.experiments.push(e)
    })
    fs.writeFileSync(`${projHome}/workflow_input.yaml`, YAML.stringify(json))
    params.inputYaml = `${projHome}/workflow_input.yaml`
    // use the executor config file for the fdgenome workflow
    params.condaEnv = process.env.CONDA_ENV
      ? process.env.CONDA_ENV
      : `${config.NEXTFLOW.WORKFLOW_DIR}/../envs/epic`
    params.executorConfig = `${config.NEXTFLOW.WORKFLOW_DIR}/epic/fdgenome_executor.conf`
  }

  return params
}

const generateWorkflowResult = proj => {
  const projHome = `${config.IO.PROJECT_BASE_DIR}/${proj.code}`
  const resultJson = `${projHome}/result.json`

  if (!fs.existsSync(resultJson)) {
    const result = {}
    const projectConf = JSON.parse(fs.readFileSync(`${projHome}/conf.json`))
    const outdir = `${projHome}/${workflowList[projectConf.workflow.name].outdir}`

    if (projectConf.workflow.name === 'sra2fastq') {
      // use relative path
      const { accessions } = projectConf.workflow.input
      accessions.forEach(accession => {
        // link sra downloads to project output
        fs.symlinkSync(`../../../../sra/${accession}`, `${outdir}/${accession}`)
      })
    }
    fs.writeFileSync(resultJson, JSON.stringify(result))
  }
}

const checkFlagFile = (proj, jobQueue) => {
  const projHome = `${config.IO.PROJECT_BASE_DIR}/${proj.code}`
  const outDir = `${projHome}/${workflowList[proj.type].outdir}`
  if (jobQueue === 'local') {
    const flagFile = `${projHome}/.done`
    if (!fs.existsSync(flagFile)) {
      return false
    }
  }
  // check expected output files
  if (proj.type === 'assayDesign') {
    const outJson = `${outDir}/jbrowse/jbrowse_url.json`
    if (!fs.existsSync(outJson)) {
      return false
    }
  }
  return true
}

const getWorkflowCommand = proj => {
  const projHome = `${config.IO.PROJECT_BASE_DIR}/${proj.code}`
  const projectConf = JSON.parse(fs.readFileSync(`${projHome}/conf.json`))
  const outDir = `${projHome}/${workflowList[projectConf.workflow.name].outdir}`
  let command = ''
  if (proj.type === 'assayDesign') {
    // create bioaiConf.json
    const conf = `${projHome}/bioaiConf.json`
    fs.writeFileSync(
      conf,
      JSON.stringify({
        pipeline: 'bioai',
        params: { ...projectConf.workflow.input, ...projectConf.genomes },
      }),
    )
    command += ` && ${workflowConfig.WORKFLOW.BIOAI_EXEC} -i ${conf} -o ${outDir}`
  }
  return command
}

const validateBulkSubmissionInput = async (bulkExcel, type) => {
  // Parse a file
  const workSheetsFromFile = xlsx.parse(bulkExcel)
  const rows = workSheetsFromFile[0].data.filter(row =>
    // Check if all cells in the row are empty (null, undefined, or empty string after trim)
    row.some(
      cell => cell !== null && cell !== undefined && String(cell).trim() !== '',
    ),
  )
  // Remove header
  rows.shift()
  // validate inputs
  let validInput = true
  let errMsg = ''
  const submissions = []
  if (rows.length === 0) {
    validInput = false
    errMsg += 'ERROR: No submission found in the bulk excel file.\n'
  }

  if (type === 'wastewater') {
    // do some validation for wastewater submission\
  }
  // eslint-disable-next-line consistent-return
  return { validInput, errMsg, submissions }
}

// The output zip file is in the <project home>/output dir, and the zip file name is defined in workflowList[workflow].zip_output
const zipProjectOutputs = async proj => {
  const projHome = `${config.IO.PROJECT_BASE_DIR}/${proj.code}`
  const projectConf = JSON.parse(fs.readFileSync(`${projHome}/conf.json`))
  if (workflowList[projectConf.workflow.name].zip_output) {
    const zipOutputPath = `${projHome}/output/${workflowList[
      projectConf.workflow.name
    ].zip_output.replaceAll('<PROJECT>', proj.name.replace(/\s+/g, '_'))}`
    if (fs.existsSync(zipOutputPath)) {
      return zipOutputPath
    }
    const cmd = workflowList[projectConf.workflow.name].zip_output_cmd
      .replaceAll('<PROJECT_HOME>', projHome)
      .replaceAll('<ZIP_OUTPUT>', zipOutputPath)
    await execCmd(cmd)
    return zipOutputPath
  }
  return null
}

module.exports = {
  cromwellWorkflows,
  nextflowWorkflows,
  nextflowConfigs,
  workflowList,
  generateNextflowWorkflowParams,
  generateWorkflowResult,
  checkFlagFile,
  getWorkflowCommand,
  validateBulkSubmissionInput,
  zipProjectOutputs,
}
