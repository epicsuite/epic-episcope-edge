import React, { useState, useEffect } from 'react'
import { Col, Row, Button } from 'reactstrap'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { defaults } from 'src/edge/common/util'
import { ErrorTooltip } from 'src/edge/common/MyTooltip'
import { components } from './defaults'
import { TimeStep } from './TimeStep'

export const TimeStepArray = (props) => {
  const componentName = 'timeStepArray'
  const [form, setState] = useState({ ...components[componentName] })
  const [doValidation, setDoValidation] = useState(0)
  const { control } = useForm({
    mode: defaults['form_mode'],
  })

  const {
    fields: timeStepFields,
    append: timeStepAppend,
    remove: timeStepRemove,
  } = useFieldArray({
    control,
    name: 'timeStep',
  })

  const setTimeStepArray = (params, index) => {
    //console.log('timestep array set:', params, index)
    form.timeSteps[index] = {}
    form.timeSteps_display[index] = {}
    form.timeSteps[index].validForm = params.validForm
    form.timeSteps[index].errMessage = params.errMessage
    form.timeSteps[index].inputs = {}
    form.timeSteps_display[index].inputs = {}
    Object.keys(params.inputs).forEach((key) => {
      form.timeSteps[index].inputs[key] = params.inputs[key].value
      if (params.inputs[key].display) {
        form.timeSteps_display[index].inputs[params.inputs[key].text] = params.inputs[key].display
      } else {
        form.timeSteps_display[index].inputs[params.inputs[key].text] = params.inputs[key].value
      }
    })
    setDoValidation(doValidation + 1)
  }

  //default 1 dataset
  useEffect(() => {
    timeStepAppend({ name: 'timeStep' })
    setState({ ...form, ['timeSteps']: [] })
    setDoValidation(doValidation + 1)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  //trigger validation method when input changes
  useEffect(() => {
    if (form.timeSteps.length === 0) {
      form.validForm = false
      form.errMessage = 'Please add at least one timestep'
      props.setParams(form, props.name)
      return
    }
    form.validForm = true
    form.errMessage = ''
    form.timeSteps.forEach((item) => {
      if (!item.validForm) {
        form.validForm = false
        form.errMessage = 'TimeStep input error'
      }
    })

    //force updating parent's inputParams
    props.setParams(form, props.name)
  }, [doValidation]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Row>
        <Col md="3">
          TimeSteps
          {form.errMessage && (
            <ErrorTooltip id={`textInputErrTooltip-${props.name}`} tooltip={form.errMessage} />
          )}
        </Col>
        <Col xs="12" md="9">
          <Button
            size="sm"
            className="btn-pill"
            color="warning"
            onClick={() => {
              timeStepAppend({ name: 'timeStep' })
              setDoValidation(doValidation + 1)
            }}
          >
            Add more TimeStep
          </Button>
        </Col>
      </Row>
      <br></br>
      {timeStepFields.map((item, index) => (
        <div key={item.id}>
          <Row>
            <Col md="3" style={{ color: 'orange' }}>
              timestep {index + 1}
              <br></br>
              <Button
                size="sm"
                className="btn-pill"
                color="outline-warning"
                onClick={() => {
                  form.timeSteps.splice(index, 1)
                  timeStepRemove(index)
                  setDoValidation(doValidation + 1)
                }}
              >
                Remove
              </Button>
            </Col>
            <Col xs="12" md="9">
              <Controller
                render={({ field: { ref, ...rest }, fieldState }) => (
                  <TimeStep {...rest} {...fieldState} setParams={setTimeStepArray} index={index} />
                )}
                name={`timeStep[${index}]`}
                control={control}
              />
            </Col>
          </Row>
          <br></br>
        </div>
      ))}
    </>
  )
}
