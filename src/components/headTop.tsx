import React from "react";
import { Container, Row, Col } from 'react-bootstrap';

export default function HeaderTop() {
    return <div className="header">
        <Container>
            <Row>
                <Col className="headerTxt" md={8} xs={12}>NFT Checker</Col>
                <Col className="headetRht" md={4} xs={12}>&copy; Web3 Camp</Col>
            </Row>
        </Container>
    </div>
}
