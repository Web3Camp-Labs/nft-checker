import React, {useEffect, useState} from "react";
import { Container, Row, Col } from 'react-bootstrap';
import ChainJson from "../api/chain.json";
import {ethers} from "ethers";
import styled from "styled-components";

const AddressBox = styled.span`
    border: 1px solid #000;
    font-size: 16px;
    height: 40px;
  line-height: 40px;
  border-radius: 5px;
  display: inline-block;
  white-space: nowrap;
  padding: 0 20px;
  color: #000000;
`


export default function HeaderTop() {
    const [chainName ,setChainName] = useState('');

    useEffect(()=>{
        const { ethereum} = window as any;
        if(typeof ethereum == 'undefined'){
            return;
        }
        ethereum.on('chainChanged', () => {
            window.location.reload();

        });
        const getChain =  async() =>{
            const { ethereum } = window as any;
            if(typeof ethereum == 'undefined'){
                return;
            }
            const web3Provider = new ethers.providers.Web3Provider(ethereum);
            const { chainId } = await web3Provider.getNetwork();
            const ChainArr = ChainJson.filter(item=>item.chainId === chainId);
            setChainName(ChainArr[0]?.name);
        }
        getChain();
    },[])


    return <div className="header">
        <Container>
            <Row>
                <Col className="headerTxt" md={8} xs={12}>NFT Checker</Col>
                <Col className="headetRht" md={4} xs={12}>
                    {
                        chainName && <AddressBox>{chainName}</AddressBox>
                    }
                    {
                       ! chainName && <div>Please install MetaMask</div>
                    }
                </Col>
            </Row>
        </Container>
    </div>
}
