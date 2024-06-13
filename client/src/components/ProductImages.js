import React, { useState } from 'react'
import { Col, Row, Container, Image, Card } from "react-bootstrap";

function ProductImages(props) {
    const pics = ['cellphone', 'shirt', 'shoes', 'drone', 'scooter', 'pants', 'travel', 'calm', 'javascript']
    const [currentPic, setCurrentPic] = useState(Math.floor(Math.random() * (pics.length + 1)))
    const randNum = Math.floor(Math.random() * (pics.length - 2))
    return (
        <Container>
            <Row>
                {[12].map((e, i) => {
                    return (<Col key={`imc-${i}`} lg={e}>
                        <Card key={`imca-${i}`} style={{ height: '100%' }}>
                            <Image key={`im-${i}`} src={`https://source.unsplash.com/1600x900/?${pics[currentPic]}`} alt={`https://source.unsplash.com/1600x900/?${pics[currentPic]}`} />
                            <Card.Body>
                                <Card.Title>{`${pics[currentPic]}`}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>)
                })}
            </Row>
            <Row>
                {[3, 3, 3, 3].map((e, i) => {
                    return (<Col key={`imc2-${i}`} lg={e}>

                        <Card key={`imca2-${i}`} style={{ height: '100%' }}>
                            <Image onClick={() => setCurrentPic(randNum + i)} key={`im2-${i}`} src={`https://source.unsplash.com/1600x900/?${pics[randNum + i]}`} alt={`https://source.unsplash.com/1600x900/?${pics[randNum + i]}`} />
                            {/* <Card.Body>
            <Card.Title></Card.Title>
          </Card.Body> */}
                        </Card>
                    </Col>)
                })}

            </Row>
        </Container>
    )
}

export default ProductImages