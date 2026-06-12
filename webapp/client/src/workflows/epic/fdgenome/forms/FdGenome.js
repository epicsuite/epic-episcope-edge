import React, { useState, useEffect } from 'react'
import { Card, CardBody, Collapse } from 'reactstrap'
import { Header } from 'src/edge/project/forms/SectionHeader'
import { FastqInput } from 'src/edge/project/forms/FastqInput'
import { TextInput } from 'src/edge/project/forms/TextInput'
import { FileInput } from 'src/edge/project/forms/FileInput'
import { isValidFileInput } from 'src/edge/common/util'
import { isValidChromosomes, isValidTextInput } from '../../../util'
import { components } from '../defaults'

export const FdGenome = (props) => {
  const componentName = 'fdgenome'
  const [collapseParms, setCollapseParms] = useState(false)
  const [form] = useState({ ...components[componentName] })
  const [validInputs] = useState({ ...components[componentName].validInputs })
  const [doValidation, setDoValidation] = useState(0)

  const toggleParms = () => {
    setCollapseParms(!collapseParms)
  }

  const setFastqInput = (inForm, name) => {
    form.validForm = inForm.validForm
    form.inputs[name].value = inForm.fileInput
    form.inputs[name].display = inForm.fileInput_display
    if (validInputs[name]) {
      validInputs[name].isValid = inForm.validForm
    }
    setDoValidation(doValidation + 1)
  }

  const setTextInput = (inForm, name) => {
    if (inForm.validForm) {
      form.inputs[name].value = inForm.textInput
      if (validInputs[name]) {
        validInputs[name].isValid = true
      }
    } else {
      form.inputs[name].value = ''
      if (validInputs[name]) {
        validInputs[name].isValid = false
      }
    }
    setDoValidation(doValidation + 1)
  }

  const setFileInput = (inForm, name) => {
    if (inForm.validForm) {
      form.inputs[name].value = inForm.fileInput
      form.inputs[name].display = inForm.fileInput_display
      if (validInputs[name]) {
        validInputs[name].isValid = true
      }
    } else {
      form.inputs[name].value = null
      form.inputs[name].display = null
      if (validInputs[name]) {
        validInputs[name].isValid = false
      }
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
      //files for server to caculate total input size
      //form.files = [...form.inputs['inputFastq'].value, form.inputs['artifactFile'].value]
      form.errMessage = null
      form.validForm = true
    } else {
      form.errMessage = errors
      form.validForm = false
    }
    //force updating parent's inputParams
    props.setParams(form, componentName)
  }, [doValidation]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Card className="workflow-card">
        <Header
          toggle={true}
          toggleParms={toggleParms}
          title={props.title}
          collapseParms={collapseParms}
          id={componentName + 'input'}
          isValid={props.isValid}
          errMessage={props.errMessage ? props.errMessage : form.errMessage}
        />
        <Collapse isOpen={!collapseParms} id={'collapseParameters-' + props.name}>
          <CardBody>
            <FastqInput
              name={'inputFastq'}
              setParams={setFastqInput}
              isValidFileInput={isValidFileInput}
              text={components[componentName].inputs['inputFastq'].text}
              tooltip={components[componentName].inputs['inputFastq']['fastqInput'].tooltip}
              enableInput={components[componentName].inputs['inputFastq']['fastqInput'].enableInput}
              placeholder={components[componentName].inputs['inputFastq']['fastqInput'].placeholder}
              dataSources={components[componentName].inputs['inputFastq']['fastqInput'].dataSources}
              fileTypes={components[componentName].inputs['inputFastq']['fastqInput'].fileTypes}
              viewFile={components[componentName].inputs['inputFastq']['fastqInput'].viewFile}
              isOptional={components[componentName].inputs['inputFastq']['fastqInput'].isOptional}
              cleanupInput={
                components[componentName].inputs['inputFastq']['fastqInput'].cleanupInput
              }
              maxInput={components[componentName].inputs['inputFastq']['fastqInput'].maxInput}
              paired={components[componentName].inputs['inputFastq']['fastqInput'].paired}
              disableSwitcher={
                components[componentName].inputs['inputFastq']['fastqInput'].disableSwitcher
              }
            />
            <FileInput
              name={'refix'}
              setParams={setFileInput}
              isValidFileInput={isValidFileInput}
              text={components[componentName].inputs['refix'].text}
              tooltip={components[componentName].inputs['refix']['fileInput'].tooltip}
              enableInput={components[componentName].inputs['refix']['fileInput'].enableInput}
              placeholder={components[componentName].inputs['refix']['fileInput'].placeholder}
              dataSources={components[componentName].inputs['refix']['fileInput'].dataSources}
              fileTypes={components[componentName].inputs['refix']['fileInput'].fileTypes}
              viewFile={components[componentName].inputs['refix']['fileInput'].viewFile}
              isOptional={components[componentName].inputs['refix']['fileInput'].isOptional}
              cleanupInput={components[componentName].inputs['refix']['fileInput'].cleanupInput}
            />
            <br></br>
            <TextInput
              name={'mtDNA'}
              setParams={setTextInput}
              text={components[componentName].inputs['mtDNA'].text}
              tooltip={components[componentName].inputs['mtDNA']['textInput'].tooltip}
              defaultValue={components[componentName].inputs['mtDNA']['textInput'].defaultValue}
              isOptional={components[componentName].inputs['mtDNA']['textInput'].isOptional}
              placeholder={components[componentName].inputs['mtDNA']['textInput'].placeholder}
              errMessage={components[componentName].inputs['mtDNA']['textInput'].errMessage}
              isValidTextInput={isValidTextInput}
            />
            <br></br>
            <FileInput
              name={'genomelist'}
              setParams={setFileInput}
              isValidFileInput={isValidFileInput}
              text={components[componentName].inputs['genomelist'].text}
              tooltip={components[componentName].inputs['genomelist']['fileInput'].tooltip}
              enableInput={components[componentName].inputs['genomelist']['fileInput'].enableInput}
              placeholder={components[componentName].inputs['genomelist']['fileInput'].placeholder}
              dataSources={components[componentName].inputs['genomelist']['fileInput'].dataSources}
              fileTypes={components[componentName].inputs['genomelist']['fileInput'].fileTypes}
              viewFile={components[componentName].inputs['genomelist']['fileInput'].viewFile}
              isOptional={components[componentName].inputs['genomelist']['fileInput'].isOptional}
              cleanupInput={
                components[componentName].inputs['genomelist']['fileInput'].cleanupInput
              }
            />
            <br></br>
            <TextInput
              name={'chromosomes'}
              setParams={setTextInput}
              text={components[componentName].inputs['chromosomes'].text}
              tooltip={components[componentName].inputs['chromosomes']['textInput'].tooltip}
              defaultValue={
                components[componentName].inputs['chromosomes']['textInput'].defaultValue
              }
              isOptional={components[componentName].inputs['chromosomes']['textInput'].isOptional}
              placeholder={components[componentName].inputs['chromosomes']['textInput'].placeholder}
              errMessage={components[componentName].inputs['chromosomes']['textInput'].errMessage}
              isValidTextInput={isValidChromosomes}
              toUpperCase={true}
            />
            <br></br>
          </CardBody>
        </Collapse>
      </Card>
    </>
  )
}
