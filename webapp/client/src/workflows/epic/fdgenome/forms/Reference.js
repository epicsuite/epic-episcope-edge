import React, { useState, useEffect } from 'react'
import { Card, CardBody, Collapse } from 'reactstrap'
import { Header } from 'src/edge/project/forms/SectionHeader'
import { IntegerInput } from 'src/edge/project/forms/IntegerInput'
import { TextInput } from 'src/edge/project/forms/TextInput'
import { FileInput } from 'src/edge/project/forms/FileInput'
import { isValidFileInput } from 'src/edge/common/util'
import { isValidChromosomes, isValidTextInput } from '../../../util'
import { components } from '../defaults'

export const Reference = (props) => {
  const componentName = 'reference'
  const [collapseParms, setCollapseParms] = useState(true)
  const [form] = useState({ ...components[componentName] })
  const [validInputs] = useState({ ...components[componentName].validInputs })
  const [doValidation, setDoValidation] = useState(0)

  const toggleParms = () => {
    setCollapseParms(!collapseParms)
  }

  const setTextInput = (inForm, name) => {
    form.inputs[name].value = inForm.textInput
    if (validInputs[name]) {
      validInputs[name].isValid = inForm.validForm
    }
    setDoValidation(doValidation + 1)
  }

  const setFileInput = (inForm, name) => {
    form.inputs[name].value = inForm.fileInput
    form.inputs[name].display = inForm.fileInput_display
    if (validInputs[name]) {
      validInputs[name].isValid = inForm.validForm
    }
    setDoValidation(doValidation + 1)
  }

  const setIntegerInput = (inForm, name) => {
    form.inputs[name].value = inForm.integerInput
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
            <FileInput
              name={'sequence'}
              setParams={setFileInput}
              isValidFileInput={isValidFileInput}
              text={components[componentName].inputs['sequence'].text}
              tooltip={components[componentName].inputs['sequence']['fileInput'].tooltip}
              enableInput={components[componentName].inputs['sequence']['fileInput'].enableInput}
              placeholder={components[componentName].inputs['sequence']['fileInput'].placeholder}
              dataSources={components[componentName].inputs['sequence']['fileInput'].dataSources}
              fileTypes={components[componentName].inputs['sequence']['fileInput'].fileTypes}
              viewFile={components[componentName].inputs['sequence']['fileInput'].viewFile}
              isOptional={components[componentName].inputs['sequence']['fileInput'].isOptional}
              cleanupInput={components[componentName].inputs['sequence']['fileInput'].cleanupInput}
            />
            <br></br>
            <FileInput
              name={'annotation'}
              setParams={setFileInput}
              isValidFileInput={isValidFileInput}
              text={components[componentName].inputs['annotation'].text}
              tooltip={components[componentName].inputs['annotation']['fileInput'].tooltip}
              enableInput={components[componentName].inputs['annotation']['fileInput'].enableInput}
              placeholder={components[componentName].inputs['annotation']['fileInput'].placeholder}
              dataSources={components[componentName].inputs['annotation']['fileInput'].dataSources}
              fileTypes={components[componentName].inputs['annotation']['fileInput'].fileTypes}
              viewFile={components[componentName].inputs['annotation']['fileInput'].viewFile}
              isOptional={components[componentName].inputs['annotation']['fileInput'].isOptional}
              cleanupInput={
                components[componentName].inputs['annotation']['fileInput'].cleanupInput
              }
            />
            <br></br>
            <TextInput
              name={'mitochondria'}
              setParams={setTextInput}
              text={components[componentName].inputs['mitochondria'].text}
              tooltip={components[componentName].inputs['mitochondria']['textInput'].tooltip}
              defaultValue={
                components[componentName].inputs['mitochondria']['textInput'].defaultValue
              }
              isOptional={components[componentName].inputs['mitochondria']['textInput'].isOptional}
              placeholder={
                components[componentName].inputs['mitochondria']['textInput'].placeholder
              }
              errMessage={components[componentName].inputs['mitochondria']['textInput'].errMessage}
              toUpperCase={true}
            />
            <br></br>
            <IntegerInput
              name={'resolution'}
              id={'resolution'}
              setParams={setIntegerInput}
              text={components[componentName].inputs['resolution'].text}
              tooltip={components[componentName].inputs['resolution']['integerInput'].tooltip}
              defaultValue={
                components[componentName].inputs['resolution']['integerInput'].defaultValue
              }
              min={components[componentName].inputs['resolution']['integerInput'].min}
              max={components[componentName].inputs['resolution']['integerInput'].max}
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
          </CardBody>
        </Collapse>
      </Card>
    </>
  )
}
