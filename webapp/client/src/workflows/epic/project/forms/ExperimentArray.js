import React, { useState, useEffect } from 'react'
import { Col, Row, Button } from 'reactstrap'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { defaults } from 'src/edge/common/util'
import { components } from './defaults'
import { Experiment } from './Experiment'

export const ExperimentArray = (props) => {
  const componentName = 'experimentArray'
  const [form, setState] = useState({ ...components[componentName] })
  const [doValidation, setDoValidation] = useState(0)
  const { control } = useForm({
    mode: defaults['form_mode'],
  })

  const {
    fields: experimentFields,
    append: experimentAppend,
    remove: experimentRemove,
  } = useFieldArray({
    control,
    name: 'experiment',
  })

  const setExperimentArray = (params, index) => {
    //console.log('experiment array set:', params, index)
    form.experiments[index] = {}
    form.experiments_display[index] = {}
    form.experiments[index].validForm = params.validForm
    form.experiments[index].errMessage = params.errMessage
    form.experiments[index].inputs = {}
    form.experiments_display[index].inputs = {}
    Object.keys(params.inputs).forEach((key) => {
      //console.log('experiment array set key:', key)
      if (key === 'timeSteps') {
        form.experiments[index].inputs.timesteps = params.inputs['timeSteps']
      } else if (key === 'timeSteps_display') {
        form.experiments_display[index].inputs.TimeSteps = params.inputs['timeSteps_display']
      } else {
        form.experiments[index].inputs[key] = params.inputs[key].value
        if (params.inputs[key].display) {
          form.experiments_display[index].inputs[params.inputs[key].text] =
            params.inputs[key].display
        } else {
          form.experiments_display[index].inputs[params.inputs[key].text] = params.inputs[key].value
        }
      }
    })
    setDoValidation(doValidation + 1)
  }

  //default 1 dataset
  useEffect(() => {
    experimentAppend({ name: 'experiment' })
    setState({ ...form, ['experiments']: [] })
    setDoValidation(doValidation + 1)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  //trigger validation method when input changes
  useEffect(() => {
    //console.log('experiment array validation', form)
    if (form.experiments.length === 0) {
      form.validForm = false
      form.errMessage = 'Please add at least one experiment'
      props.setParams(form, props.name)
      return
    }
    form.validForm = true
    form.errMessage = ''
    form.experiments.forEach((item) => {
      if (!item.validForm) {
        form.validForm = false
        form.errMessage = 'Experiment input error'
      }
    })

    //force updating parent's inputParams
    props.setParams(form, props.name)
  }, [doValidation]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Row>
        <Col md="3">Experiments</Col>
        <Col xs="12" md="9">
          {experimentFields.length === 0 && (
            <Button
              size="sm"
              className="btn-pill"
              color="success"
              onClick={() => {
                experimentAppend({ name: 'experiment' })
                setDoValidation(doValidation + 1)
              }}
            >
              Add Experiment
            </Button>
          )}
        </Col>
      </Row>
      <br></br>
      {experimentFields.map((item, index) => (
        <div key={item.id}>
          <Row>
            <Col md="3" className="edge-sub-field">
              experiment {index + 1}
              <br></br>
              <Button
                size="sm"
                className="btn-pill"
                color="outline-success"
                onClick={() => {
                  form.experiments.splice(index, 1)
                  experimentRemove(index)
                  setDoValidation(doValidation + 1)
                }}
              >
                Remove
              </Button>
            </Col>
            <Col xs="12" md="9">
              <Controller
                render={({ field: { ref, ...rest }, fieldState }) => (
                  <Experiment
                    {...rest}
                    {...fieldState}
                    setParams={setExperimentArray}
                    index={index}
                  />
                )}
                name={`experiment[${index}]`}
                control={control}
              />
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col md="3"></Col>
            <Col xs="12" md="9">
              {experimentFields.length === index + 1 && (
                <Button
                  size="sm"
                  className="btn-pill"
                  color="success"
                  onClick={() => {
                    experimentAppend({ name: 'experiment' })
                    setDoValidation(doValidation + 1)
                  }}
                >
                  Add more Experiment
                </Button>
              )}
            </Col>
          </Row>
          <br></br>
        </div>
      ))}
    </>
  )
}
