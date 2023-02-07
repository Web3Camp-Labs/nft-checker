import React, {useEffect, useState} from "react";
import { Container, Row, Col } from 'react-bootstrap';
import ChainJson from "../api/chain.json";
import {ethers} from "ethers";
import styled from "styled-components";
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

                {/*<Col className="headerTxt" md={8} xs={12}>NFT Checker</Col>*/}
                {/*<Col className="headetRht" md={4} xs={12}>*/}
                {/*    {*/}
                {/*        chainName && <AddressBox>{chainName}</AddressBox>*/}
                {/*    }*/}
                {/*    {*/}
                {/*       ! chainName && <div>Please install MetaMask</div>*/}
                {/*    }*/}
                {/*</Col>*/}
            </Row>
        </Container>
    </div>
}
