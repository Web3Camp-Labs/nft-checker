import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import LogoImg from "../assets/web3camp.png";

export default function HeaderTop() {
    return <div className="header">
        <Container>
            <Row>
                <Col className="headerTxt" md={12}>
                    <a href="https://web3camp.us" target="_blank" rel="noreferrer">
                        <img src={LogoImg} alt=""/>
                    </a>
                </Col>
            </Row>
        </Container>
    </div>
}
