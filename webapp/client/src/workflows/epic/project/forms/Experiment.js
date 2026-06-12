import React, { useState, useEffect } from 'react'
import { TextInput } from 'src/edge/project/forms/TextInput'
import { TimeStepArray } from './TimeStepArray'
import { components } from './defaults'

export const Experiment = (props) => {
  const componentName = 'experiment'
  const [form, setState] = useState({ ...components[componentName] })
  const [validInputs] = useState({ ...components[componentName].validInputs })
  const [doValidation, setDoValidation] = useState(0)

  const setTextInput = (inForm, name) => {
    form.inputs[name].value = inForm.textInput
    if (validInputs[name]) {
      validInputs[name].isValid = inForm.validForm
    }
    setDoValidation(doValidation + 1)
  }
  const setTimeStepArrayInput = (inForm, name) => {
    //console.log('in experiment###timestep array input:', inForm, name)
    form.validForm = inForm.validForm
    form.inputs.timeSteps = inForm.timeSteps
    form.inputs.timeSteps_display = inForm.timeSteps_display
    if (validInputs[name]) {
      validInputs[name].isValid = inForm.validForm
    }
    setDoValidation(doValidation + 1)
  }

  //trigger validation method when input changes
  useEffect(() => {
    // check input errors
    let errors = ''
    Object.keys(validInputs).forEach((key) => {
      if (!validInputs[key].isValid) {
        errors += validInputs[key].error + '<br/>'
      }
    })
    if (errors === '') {
      form.errMessage = null
      form.validForm = true
    } else {
      form.errMessage = errors
      form.validForm = false
    }
    //force updating parent's inputParams
    props.setParams(form, props.index)
  }, [doValidation]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <TextInput
        name={'name'}
        setParams={setTextInput}
        text={components[componentName].inputs['name'].text}
        tooltip={components[componentName].inputs['name']['textInput'].tooltip}
        defaultValue={components[componentName].inputs['name']['textInput'].defaultValue}
        isOptional={components[componentName].inputs['name']['textInput'].isOptional}
        placeholder={components[componentName].inputs['name']['textInput'].placeholder}
        errMessage={components[componentName].inputs['name']['textInput'].errMessage}
      />
      <br></br>
      <TextInput
        name={'sample'}
        setParams={setTextInput}
        text={components[componentName].inputs['sample'].text}
        tooltip={components[componentName].inputs['sample']['textInput'].tooltip}
        defaultValue={components[componentName].inputs['sample']['textInput'].defaultValue}
        isOptional={components[componentName].inputs['sample']['textInput'].isOptional}
        placeholder={components[componentName].inputs['sample']['textInput'].placeholder}
        errMessage={components[componentName].inputs['sample']['textInput'].errMessage}
      />
      <br></br>
      <TextInput
        name={'replicate'}
        setParams={setTextInput}
        text={components[componentName].inputs['replicate'].text}
        tooltip={components[componentName].inputs['replicate']['textInput'].tooltip}
        defaultValue={components[componentName].inputs['replicate']['textInput'].defaultValue}
        isOptional={components[componentName].inputs['replicate']['textInput'].isOptional}
        placeholder={components[componentName].inputs['replicate']['textInput'].placeholder}
        errMessage={components[componentName].inputs['replicate']['textInput'].errMessage}
      />
      <br></br>
      <TextInput
        name={'desc'}
        setParams={setTextInput}
        text={components[componentName].inputs['desc'].text}
        tooltip={components[componentName].inputs['desc']['textInput'].tooltip}
        defaultValue={components[componentName].inputs['desc']['textInput'].defaultValue}
        isOptional={components[componentName].inputs['desc']['textInput'].isOptional}
        placeholder={components[componentName].inputs['desc']['textInput'].placeholder}
        errMessage={components[componentName].inputs['desc']['textInput'].errMessage}
      />
      <br></br>
      <TimeStepArray setParams={setTimeStepArrayInput} name={'timeSteps'} />
      <br></br>
    </>
  )
}
