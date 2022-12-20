import React, {ChangeEvent, useEffect, useState} from 'react';
import styled from "styled-components";
import HeaderTop from "./components/headTop";
import FooterBox from "./components/footerBox";
import { Container, Row, Col, Card,Form, FloatingLabel,Button,Alert} from 'react-bootstrap';
import GlobalStyle from "./utils/GloablStyle";
import ERC721_ABI from "./abi/ERC721.json";
import ERC1155_ABI from "./abi/ERC1155.json";
import {ethers} from 'ethers';
import api from "./api/apiHttp";

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
  padding: 0 20px 40px;
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
const TopBox = styled.div`
    position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 9999;
`

const TypeTop = styled.div`
    padding: 40px 0 20px;
    border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
`

const NameBox = styled.div`
    color: #000000;
    padding-bottom: 20px;
  font-size: 20px;
`
const PBox = styled.div`
    display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  .tabBox{
     background: #fff;
    border-radius: 6px;
    box-shadow: 0 0 5px #ccc;
    margin-left: 10px;
    dt{
      opacity: 0.6;
      font-size: 11px;
      width: 100%;
      padding: 10px 20px;
      border-bottom: 1px solid #ccc;
    }
    dd{
      padding: 10px 20px;
    }
  }
`

interface propertyObj{
    name:string;
    value:string;
}

function App() {
    const [address,setAddress] = useState('');
    const [token,setToken] = useState('');
    const [web3Provider,setWeb3Provider] = useState<any>(null);
    const [image,setImage] = useState('');
    const [type, setType] = useState('');
    const [metadata,setMetadata] = useState('');
    const [name,setName] = useState('');
    const [errorTips,setErrorTips] = useState(false);
    const [properties,setProperties] = useState<any>({});
    const [pArr,setPArr] = useState<propertyObj[]>([]);

    useEffect(()=>{
        const { ethereum } = window as any;
        if(typeof ethereum == 'undefined'){
            return;
        }
        const web3Instance = new ethers.providers.Web3Provider(ethereum);
        setWeb3Provider(web3Instance);

    },[]);

    useEffect(()=>{
        let arr = [];
        for(let key in properties){
            arr.push({
                name:key,
                value: properties[key]
            })
        }
        setPArr(arr)

    },[properties])


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
        try{
            const isERC1155 = await contract1155.supportsInterface('0xd9b67a26');
            if(isERC1155){
                setType('ERC1155')
                Get1155();
            }else{
                setType('ERC721')
                Get721();
            }
        }catch (e:any){
            console.log(e)
            setErrorTips(true)
            setTimeout(()=>{
                setErrorTips(false)
            },2000)
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
        setName('');

        if(!web3Provider) return;
        const nftContract = new ethers.Contract(address, ERC721_ABI, web3Provider);
        const tokenURI = await nftContract.tokenURI(token);
        setMetadata(tokenURI);
        console.log(tokenURI)

        if(tokenURI.indexOf('metadata')>-1){
            let data = await api.getData(tokenURI);
            const image = data.data.image;
            setProperties(data.data?.properties)
            setImage(image);
            setName(data.data?.name);
        }else{
            let tokenAddr;
            let url;
            if(tokenURI.indexOf("ipfs://")>-1){
                tokenAddr = tokenURI.split("ipfs://")[1];
                url = `https://ipfs.io/ipfs/${tokenAddr}`
            }else{
                url =tokenURI;
            }

            const result = await api.getHash(`${url}`);
            setName(result.data?.name);
            setProperties(result.data?.properties)
            let image;
            let imageUrl;
            if(result.data?.image.indexOf("ipfs://")>-1){
              image = result.data?.image.split("ipfs://")[1];
              imageUrl = `https://ipfs.io/ipfs/${image}`;
            }else{
                image = result.data?.image;
                imageUrl = image;
            }


            setImage(imageUrl);
        }

    }
    const Get1155 = async ()=>{
        setImage('');
        setMetadata('');
        setName('');

        if(!web3Provider) return;
        const nftContract = new ethers.Contract(address, ERC1155_ABI, web3Provider);
        let tokenURI = await nftContract.uri(token);

        if(tokenURI.indexOf('0x{id}')>-1){
            let url = tokenURI.split('0x{id}')[0];
            let data = await api.getData(`${url}${token}`);
            setMetadata(`${url}${token}`);
            const image = data.data.image;
            setProperties(data.data?.properties)
            setImage(image);
            setName(data.data.name);
        }else{

            if(tokenURI.indexOf("://") === -1){
                tokenURI = `https://ipfs.io/ipfs/${tokenURI}`;
            }else{
                if(tokenURI.indexOf("ipfs://") > -1){
                    tokenURI = `https://ipfs.io/ipfs/${tokenURI.split("ipfs://")[1]}`;
                }
            }
            const result = await api.getHash(tokenURI);
            setProperties(result.data?.properties )
            setMetadata(tokenURI);
            let image;
            let imageUrl;
            console.log(result.data?.image)
            setName(result.data?.name);
            if(result.data?.image.indexOf('ipfs')>-1){
                image = result.data?.image.split("ipfs://")[1];
                 imageUrl = `https://ipfs.io/ipfs/${image}`;
            }else{
                image = result.data?.image;
                imageUrl = image;
            }

            setImage(imageUrl);
        }
    }

  return (
      <div>
        <MainContent>
          <HeaderTop />
            {
                errorTips && <TopBox>
                    <Alert variant='danger'>
                        Please confirm the right chain
                    </Alert>
                </TopBox>
            }

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
                                <TypeTop>{type}</TypeTop>
                                <NameBox>{name}</NameBox>
                                <div>
                                    Metadata: {metadata}
                                </div>
                                {
                                    !!pArr.length &&<PBox>
                                        <div>Properties: </div>
                                        {
                                            pArr.map((item)=>(<dl className="tabBox" key={item.name}>
                                                    <dt>{item.name}</dt>
                                                    <dd>{item.value}</dd>
                                                </dl>
                                            ))
                                        }

                                    </PBox>
                                }

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
