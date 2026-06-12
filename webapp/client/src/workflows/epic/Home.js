import React from 'react'
import { Col, Row } from 'reactstrap'
import projectImg from 'src/assets/images/epic-edge-project.png'

const Home = () => {
  return (
    <div className="animated fadeIn">
      <Row className="justify-content-center">
        <Col xs="12" sm="12" md="12">
          <img alt="Project overview" style={{ width: '100%', height: '100%' }} src={projectImg} />
        </Col>
      </Row>
    </div>
  )
}

export default Home
