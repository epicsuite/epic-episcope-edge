import React, { useState, useEffect } from 'react'
import { Button, Form, Row, Col } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { postData, getData, notify, apis } from 'src/edge/common/util'
import { LoaderDialog, MessageDialog } from 'src/edge/common/Dialogs'
import { Project } from 'src/edge/project/forms/Project'
import { HtmlText } from 'src/edge/common/HtmlText'
import { workflowList } from 'src/util'
import { Reference } from './forms/Reference'
import { fdgenome, workflowOptions, components } from './defaults'
import { Experiments } from './forms/Experiments'

const Main = (props) => {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [requestSubmit, setRequestSubmit] = useState(false)
  const [projectParams, setProjectParams] = useState()
  const [inputComponents, setInputComponents] = useState(components)
  const [doValidation, setDoValidation] = useState(0)
  const [workflow, setWorkflow] = useState(workflowOptions[0].value)
  const [openDialog, setOpenDialog] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [sysMsg, setSysMsg] = useState()

  //callback function for child component
  const setProject = (params) => {
    //console.log('main project:', params)
    setProjectParams(params)
    setDoValidation(doValidation + 1)
  }
  const setComponentParams = (params, name) => {
    //console.log('main component:', params, name)
    setInputComponents({ ...inputComponents, [name]: params })
    setDoValidation(doValidation + 1)
  }

  //submit button clicked
  const onSubmit = () => {
    setSubmitting(true)
    let formData = {}
    formData.category = workflowList[workflow].category
    // set project info
    formData.project = {
      name: projectParams.projectName,
      desc: projectParams.projectDesc,
      type: workflow,
    }

    // set workflow inputs
    let myWorkflow = { name: workflow, input: {} }
    // set workflow input display
    let inputDisplay = { workflow: workflowList[workflow].label, input: {} }
    // set workflow input reference parameters
    myWorkflow.input.reference = {}
    inputDisplay.input.reference = {}
    //console.log('input components:', inputComponents)
    Object.keys(inputComponents.reference.inputs).forEach((key) => {
      myWorkflow.input.reference[key] = inputComponents.reference.inputs[key].value
      if (inputComponents.reference.inputs[key].display) {
        inputDisplay.input.reference[inputComponents.reference.inputs[key].text] =
          inputComponents.reference.inputs[key].display
      } else {
        inputDisplay.input.reference[inputComponents.reference.inputs[key].text] =
          inputComponents.reference.inputs[key].value
      }
    })
    // set workflow input experiment parameters
    myWorkflow.input.experiments = []
    inputComponents.experiments.inputs.value.forEach((exp) => {
      //console.log('experiment:', exp)
      let myExp = {}
      Object.keys(exp.inputs).forEach((key) => {
        if (key === 'timesteps') {
          myExp.timesteps = []
          exp.inputs['timesteps'].forEach((ts, index) => {
            myExp.timesteps[index] = {}
            Object.keys(ts.inputs).forEach((tsk) => {
              myExp.timesteps[index][tsk] = ts.inputs[tsk]
            })
          })
        } else {
          myExp[key] = exp.inputs[key]
        }
      })
      myWorkflow.input.experiments.push(myExp)
    })
    // set workflow input experiment display parameters
    inputDisplay.input.experiments = []
    inputComponents.experiments.inputs.display.forEach((exp) => {
      //console.log('experiment:', exp)
      let expDisplay = {}
      Object.keys(exp.inputs).forEach((key) => {
        if (key === 'TimeSteps') {
          expDisplay.TimeSteps = []
          exp.inputs['TimeSteps'].forEach((ts, index) => {
            expDisplay.TimeSteps[index] = {}
            Object.keys(ts.inputs).forEach((tsk) => {
              expDisplay.TimeSteps[index][tsk] = ts.inputs[tsk]
            })
          })
        } else {
          expDisplay[key] = exp.inputs[key]
        }
      })
      inputDisplay.input.experiments.push(expDisplay)
    })
    // set form data
    formData.workflow = myWorkflow
    formData.inputDisplay = inputDisplay

    // submit to server via api
    postData(apis.userProjects, formData)
      .then((data) => {
        setSubmitting(false)
        notify('success', 'Your workflow request was submitted successfully!', 2000)
        setTimeout(() => navigate('/user/projects'), 2000)
      })
      .catch((error) => {
        setSubmitting(false)
        alert(error)
      })
  }

  const closeMsgModal = () => {
    setOpenDialog(false)
  }

  useEffect(() => {
    setRequestSubmit(true)

    if (projectParams && !projectParams.validForm) {
      setRequestSubmit(false)
    }
    Object.keys(inputComponents).forEach((component) => {
      if (!inputComponents[component].validForm) {
        setRequestSubmit(false)
      }
    })
  }, [doValidation]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let url = apis.userInfo
    getData(url)
      .then((data) => {
        if (data.info.allowNewRuns) {
          setDisabled(false)
        } else {
          setSysMsg(data.info.message)
          setDisabled(true)
          setOpenDialog(true)
        }
      })
      .catch((err) => {
        alert(err)
      })
  }, [])

  return (
    <div
      className="animated fadeIn"
      style={disabled ? { pointerEvents: 'none', opacity: '0.4' } : {}}
    >
      <MessageDialog
        className="modal-lg modal-danger"
        title="System Message"
        isOpen={openDialog}
        html={true}
        message={'<div><b>' + sysMsg + '</b></div>'}
        handleClickClose={closeMsgModal}
      />
      <ToastContainer />
      <LoaderDialog loading={submitting === true} text="Submitting..." />
      <Form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <div className="clearfix">
          <h4 className="pt-3">Run 4D Genome Workflow</h4>
          <span className="pt-3 text-muted edge-text-size-small">
            <HtmlText
              text={
                fdgenome.info +
                ' <a target="_blank" href=' +
                fdgenome.link +
                ' rel="noopener noreferrer">Learn more</a>'
              }
            />
          </span>
          <br></br>
          <hr />
          <Project setParams={setProject} />
          <br></br>
          {/* <b>Workflow</b>
                  <MySelect
                    //defaultValue={workflowOptions[0]}
                    options={workflowOptions}
                    onChange={(e) => {
                      if (e) {
                        setWorkflow(e.value)
                      } else {
                        setWorkflow()
                      }
                    }}
                    placeholder="Select a Workflow..."
                    isClearable={true}
                  /> */}
          {workflow === 'fdgenome' && (
            <>
              <Reference
                title={'Reference'}
                setParams={setComponentParams}
                isValid={
                  inputComponents['reference'] ? inputComponents['reference'].validForm : false
                }
                errMessage={
                  inputComponents['reference'] ? inputComponents['reference'].errMessage : null
                }
              />
              <Experiments
                title={'Experiments'}
                id={'experiments'}
                name={'experimentArray'}
                setParams={setComponentParams}
                isValid={
                  inputComponents['experiments'] ? inputComponents['experiments'].validForm : false
                }
                errMessage={
                  inputComponents['experiments'] ? inputComponents['experiments'].errMessage : null
                }
              />
              <br></br>
            </>
          )}
          <br></br>
        </div>

        <div className="edge-center">
          <Button
            color="primary"
            onClick={(e) => onSubmit()}
            disabled={!workflow || !requestSubmit}
          >
            Submit
          </Button>{' '}
        </div>
        <br></br>
        <br></br>
      </Form>
    </div>
  )
}

export default Main
