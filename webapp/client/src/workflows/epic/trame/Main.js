import React from 'react'
import { Col, Row } from 'reactstrap'
import TrameViz from './TrameViz'

const Main = (props) => {
  return (
    <Row className="justify-content-center">
      <Col xs="12" sm="12" md="11">
        <TrameViz />
      </Col>
    </Row>
  )
}

export default Main
