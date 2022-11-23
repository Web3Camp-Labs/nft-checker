import React, {ChangeEvent, useEffect, useState} from 'react';
import styled from "styled-components";
import HeaderTop from "./components/headTop";
import FooterBox from "./components/footerBox";
import { Container, Row, Col, Card,Form, FloatingLabel,Button} from 'react-bootstrap';
import GlobalStyle from "./utils/GloablStyle";
import Api from "./api/apiHttp";
import ERC721_ABI from "./abi/ERC721.json";
import ERC1155_ABI from "./abi/erc1155-abi.json";
import {ethers} from 'ethers';
import api from "./api/apiHttp";
import ChainJson from "./api/chain.json";

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  .liBox,.li{
    margin-bottom: 40px;
  }
`

const ContentBox = styled(Container)`
    margin: 40px auto;
`
const CardBox = styled(Card)`
  border:0;
  box-shadow: 0 0 5px #ccc;
  border-radius: 6px;
  padding: 40px;
`

const CenterBox = styled.div`
    display: flex;
  justify-content: center;
  margin-bottom: 40px;
`

const GrayBox = styled.div`
    width: 100%;
    background: #f7f7f7;
  padding: 40px 20px;
  border-radius: 6px;
`

const ImageBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
    img{
      width: 80%;
    }
`


function App() {
    const [address,setAddress] = useState('');
    const [token,setToken] = useState('');
    const [web3Provider,setWeb3Provider] = useState<any>(null);
    const [image,setImage] = useState('');
    const [type, setType] = useState('');
    const [metadata,setMetadata] = useState('');
    const [name,setName] = useState('');


    useEffect(()=>{
        const { ethereum } = window as any;
        const web3Instance = new ethers.providers.Web3Provider(ethereum);
        setWeb3Provider(web3Instance);
    },[])


    const handleInput = (e:ChangeEvent) => {
        const { name,value } = e.target as HTMLInputElement;

        if(name === 'address'){
            setAddress(value);
        }else{
            setToken(value)
        }
    }

    const queryInfo = async() =>{
        const contract1155 = new ethers.Contract(address, ERC1155_ABI, web3Provider);
        console.log(contract1155)
        const isERC1155 = await contract1155.supportsInterface('0xd9b67a26');
        if(isERC1155){
            setType('ERC1155')
            Get1155();
        }else{
            setType('ERC721')
            Get721();
        }
        // console.log(owner)
        // const bal = await contract721.balanceOf(owner)
        // console.log(bal)

        // setType('');
        // let res = await Api.getInfo(address);
        // let ty = res?.data.schema_name;
        // if(ty!== 'UNKNOWN'){
        //     setType(ty);
        // }else{
        //     const contract721 = new ethers.Contract(address, ERC721_ABI, web3Provider);
        //     console.log(contract721)
        //     const owner = await contract721.ownerOf(token);
        //     console.log(owner)
        //     const bal = await contract721.balanceOf(owner)
        //
        // }

    }



    const Get721 = async() =>{
        setImage('');
        setMetadata('');

        if(!web3Provider) return;
        const nftContract = new ethers.Contract(address, ERC721_ABI, web3Provider);
        console.log(nftContract,token)
        const tokenURI = await nftContract.tokenURI(token);
        setMetadata(tokenURI)
        if(tokenURI.indexOf('metadata')>-1){
            console.log("=====",tokenURI)
            let data = await api.getData(tokenURI);
            const image = data.data.image;
            setImage(image);
        }else{
            let tokenAddr = tokenURI.split("ipfs://")[1];
            const result = await api.getHash(`https://ipfs.io/ipfs/${tokenAddr}`);
            const image = result.data?.image.split("ipfs://")[1];
            const imageUrl = `https://ipfs.io/ipfs/${image}`;
            setImage(imageUrl);
        }

    }
    const Get1155 = async ()=>{
        setImage('');
        setMetadata('');

        if(!web3Provider) return;
        const nftContract = new ethers.Contract(address, ERC1155_ABI, web3Provider);
        console.log(nftContract)
        const tokenURI = await nftContract.uri(token);


        if(tokenURI.indexOf('0x{id}')>-1){
            let url = tokenURI.split('0x{id}')[0]
            let data = await api.getData(`${url}${token}`);
            setMetadata(`${url}${token}`)
            const image = data.data.image;
            setImage(image);
            setName(data.data.name);
        }else{
            setMetadata(tokenURI)
            const result = await api.getHash(tokenURI);
            console.log(result)
            const image = result.data?.image.split("ipfs://")[1];
            const imageUrl = `https://ipfs.io/ipfs/${image}`;
            setImage(imageUrl);
        }
    }

  return (
      <div>
        <MainContent>
          <HeaderTop />
          <ContentBox>
            <Row>
                <CardBox body>
                    <CenterBox>
                        <Col  md={8} xs={12}>
                            <FloatingLabel
                                controlId="Address"
                                label="Contract address"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="text"
                                    name='address'
                                    placeholder="Contract address"
                                    value={address}
                                    onChange={(e)=>handleInput(e)}
                                />
                            </FloatingLabel>
                        </Col>
                    </CenterBox>
                    <CenterBox>
                        <Col  md={8} xs={12}>
                            <FloatingLabel
                                label="Token Id"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="text"
                                    name='token'
                                    placeholder="Token Id"
                                    value={token}
                                    onChange={(e)=>handleInput(e)}
                                />
                            </FloatingLabel>
                        </Col>
                    </CenterBox>
                    <CenterBox>
                        <Button variant="flat" onClick={()=>queryInfo()}>Resolve</Button>
                    </CenterBox>
                    <CenterBox>
                        <Col  md={8} xs={12}>
                            <GrayBox>
                                <div>{type}</div>
                                <div>
                                    Metadata: {metadata}
                                </div>
                                <div>
                                    {name}
                                </div>
                                <ImageBox>
                                    <img src={image} alt=""/>
                                </ImageBox>


                            </GrayBox>
                        </Col>
                    </CenterBox>
                </CardBox>
            </Row>


          </ContentBox>
          <FooterBox />
        </MainContent>
        <GlobalStyle />
      </div>
  );
}

export default App;
