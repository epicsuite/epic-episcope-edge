import { workflowList } from 'src/util'

export const fdgenome = {
  label: '4D Genome',
  category: 'epic workflow',
  title: '4D Genome',
  name: 'fdgenome',
  inputLink: 'https://github.com/epicsuite/workflow/tree/main',
  link: 'https://github.com/lanl/SLUR-M-py',
  info: 'This workflow transforms fastq files and other related datasets into time-based 4D datasets. The results can be viewed in a visualization tool we are developing, but are also available for other types of analysis and processing.',
}

export const workflowOptions = [{ value: 'fdgenome', label: workflowList['fdgenome'].label }]

export const components = {
  reference: {
    text: 'Reference',
    validForm: false,
    errMessage: 'Reference input error.<br/>',
    inputs: {
      sequence: {
        text: 'Sequence',
        value: null,
        display: null,
        fileInput: {
          tooltip: "Path to input reference fasta, source of the project's list of chromosomes.",
          enableInput: false,
          placeholder: 'Select a file',
          dataSources: ['upload', 'public'],
          fileTypes: ['fna', 'fa', 'fasta'],
          viewFile: false,
          isOptional: false,
          cleanupInput: false,
        },
      },
      annotation: {
        text: 'Annotation',
        value: null,
        display: null,
        fileInput: {
          tooltip: 'Path to .gff file.',
          enableInput: false,
          placeholder: '(optional) Select a file',
          dataSources: ['upload', 'public'],
          fileTypes: ['gff'],
          viewFile: false,
          isOptional: true,
          cleanupInput: true,
        },
      },
      mitochondria: {
        text: 'Mitochondria',
        value: '',
        textInput: {
          placeholder: '(optional) Accession for mitochondrial contig, if present',
          tooltip: 'Some accession number',
          showError: false,
          isOptional: true,
          showErrorTooltip: true,
          errMessage: '',
          defaultValue: '',
        },
      },
      resolution: {
        text: 'Resolution',
        value: 100000,
        integerInput: {
          tooltip: 'The bin resolution in the .hic files to choose. Default: 100000',
          min: 0,
          max: 100000000000,
          defaultValue: 100000,
        },
      },
      genomelist: {
        text: 'Contigs',
        value: null,
        display: null,
        fileInput: {
          tooltip:
            'Path to list of chromosomes (by name) to include in final analysis. Default behavior expects a tab seperated tsv or bed, comma seperated csv, or space seperated txt file with no header.',
          enableInput: false,
          placeholder: 'Select a file',
          dataSources: ['upload', 'public'],
          fileTypes: ['tsv', 'csv', 'txt', 'bed'],
          viewFile: false,
          isOptional: false,
          cleanupInput: false,
        },
      },
    },
    // only for input with validation method
    validInputs: {
      sequence: { isValid: false, error: 'Reference File error.' },
      mitochondria: { isValid: false, error: 'Mitochondria error.' },
      resolution: { isValid: true, error: 'Resolution error.' },
      genomelist: { isValid: false, error: 'Genome List File error.' },
    },
  },
  experiments: {
    text: 'Experiments',
    validForm: false,
    errMessage: 'Experiment input error.<br/>',
    inputs: {
      value: [],
      display: [],
    },
  },
}
