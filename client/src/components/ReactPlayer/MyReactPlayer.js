import React from 'react'
import { Col, Row, Container } from 'react-bootstrap'
import ReactPlayer from 'react-player'
function MyReactPlayer(props) {
  return (
    <Col style={{'textAlign':'center'}} md="4">
      <ReactPlayer url={props.url} controls={true} />
    </Col>
  )
}

export default MyReactPlayer
