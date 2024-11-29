import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

export const Footer = () => {
    const year = new Date().getFullYear()
  return (
    <footer>
        <Container>
            <Row>
                <Col className="text-center py-3">
                    Copyright &copy; ProShop {year}
                </Col>
            </Row>
        </Container>
    </footer>
    
  )
}

export default Footer