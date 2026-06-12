import React, { useState, useEffect } from 'react'
import { Card, CardBody, Collapse } from 'reactstrap'
import { Header } from 'src/edge/project/forms/SectionHeader'
import { HtmlText } from 'src/edge/common/HtmlText'
import { ExperimentArray } from '../../project/forms/ExperimentArray'
import { components } from '../defaults'

export const Experiments = (props) => {
  const componentName = 'experiments'
  const [collapseParms, setCollapseParms] = useState(true)
  const [form, setState] = useState({ ...components[componentName] })
  const [doValidation, setDoValidation] = useState(0)

  const toggleParms = () => {
    setCollapseParms(!collapseParms)
  }

  //callback function for child component
  const setExperimentArray = (inForm, name) => {
    //console.log('experiment array:', inForm, name)
    form.validForm = inForm.validForm
    form.errMessage = inForm.errMessage
    form.inputs.value = inForm.experiments
    form.inputs.display = inForm.experiments_display

    setDoValidation(doValidation + 1)
  }
  //trigger validation method when input changes
  useEffect(() => {
    //force updating parent's inputParams
    props.setParams(form, componentName)
  }, [doValidation]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
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
          <ExperimentArray
            id={'experiments'}
            name={'experimentArray'}
            setParams={setExperimentArray}
          />
          <br></br>
        </CardBody>
      </Collapse>
    </Card>
  )
}
