export const components = {
  timeStep: {
    validForm: false,
    errMessage: 'TimeStep error.<br/>TimeStep inputs error.',
    inputs: {
      name: {
        text: 'Name',
        value: '',
        display: null,
        textInput: {
          placeholder: '(required)',
          tooltip: null,
          showError: false,
          isOptional: false,
          showErrorTooltip: true,
          errMessage: 'Required.',
          defaultValue: '',
        },
      },
      structure: {
        text: 'Structure',
        value: null,
        display: null,
        folderInput: {
          placeholder: '(required) Select a folder ...',
          dataSources: ['upload', 'public'],
          fileTypes: ['fastq.gz', 'fq.gz', 'hic'],
          viewFile: false,
          isOptional: false,
          cleanupInput: false,
        },
      },
      struct_stage: {
        text: 'Structure Stage',
        value: 1,
        display: 1,
      },
    },
    // only for input with validation method
    validInputs: {
      name: { isValid: false, error: 'TimeStep Name error.' },
      structure: {
        isValid: false,
        error: 'TimeStep Structure error.',
      },
    },
  },
  timeStepArray: {
    validForm: false,
    timeSteps: [],
    timeSteps_display: [],
  },
  experiment: {
    validForm: false,
    errMessage: 'Experiment error.',
    inputs: {
      name: {
        text: 'Name',
        value: '',
        display: null,
        textInput: {
          placeholder: '(required)',
          tooltip: null,
          showError: false,
          isOptional: false,
          showErrorTooltip: true,
          errMessage: 'Required.',
          defaultValue: '',
        },
      },
      sample: {
        text: 'Sample',
        value: '',
        display: null,
        textInput: {
          placeholder: '(required)',
          tooltip: null,
          showError: false,
          isOptional: false,
          showErrorTooltip: true,
          errMessage: 'Required.',
          defaultValue: '',
        },
      },
      replicate: {
        text: 'Replicate',
        value: '',
        display: null,
        textInput: {
          placeholder: '(required)',
          tooltip: null,
          showError: false,
          isOptional: false,
          showErrorTooltip: true,
          errMessage: 'Required.',
          defaultValue: '',
        },
      },
      desc: {
        text: 'Description',
        value: '',
        display: null,
        textInput: {
          placeholder: '(required)',
          tooltip: null,
          showError: false,
          isOptional: false,
          showErrorTooltip: true,
          errMessage: 'Required.',
          defaultValue: '',
        },
      },
      timeSteps: [],
    },
    // only for input with validation method
    validInputs: {
      name: { isValid: false, error: 'Name error.' },
      sample: { isValid: false, error: 'Sample error.' },
      replicate: { isValid: false, error: 'Repliicate error.' },
      desc: { isValid: false, error: 'Desc error.' },
      timeSteps: { isValid: false, error: 'TimeSteps error.' },
    },
  },
  experimentArray: {
    validForm: false,
    experiments: [],
    experiments_display: [],
    errMessage: 'Please add at least one experiment',
  },
}
