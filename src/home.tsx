import React, {ChangeEvent, useEffect, useState} from 'react';
import styled from "styled-components";
import HeaderTop from "./components/headTop";
import FooterBox from "./components/footerBox";
import { Container, Row, Col, Card,Form, FloatingLabel,Button,Alert,} from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';
import GlobalStyle from "./utils/GloablStyle";
import ERC721_ABI from "./abi/ERC721.json";
import ERC1155_ABI from "./abi/ERC1155.json";
import {ethers} from 'ethers';
import api from "./api/apiHttp";
import ChainJson from "./api/chain.json";
import NftLogo from "./assets/nft-checker.png";
import {useNavigate, useParams} from "react-router-dom";

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  .liBox,.li{
    margin-bottom: 40px;
  }
  .btn{
    background-color: purple;
    color: white;
    font-family: "Helvetica";
    border: 0;
  }
`

const ContentBox = styled(Container)`
    margin: 40px auto;
`
const CardBox = styled(Card)`
  border:0;
  box-shadow: 0 0 5px #ccc;
  border-radius: 6px;
  padding: 40px ;
`

const CenterBox = styled.div`
    display: flex;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;

  .inner-btn {
    position: absolute;
    font-size: 30px;
    border: none;
    background-color: transparent;
    line-height: 35px;
    top:10px;
    left: calc(100% - 40px);
    z-index: 99999;
  }

  .inner-btn:hover {
    color: purple;
  }
`

const GrayBox = styled.div`
    width: 100%;
    background: #f7f7f7;
  padding: 0 20px 40px;
  border-radius: 6px;
  word-break: break-all;
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


const TopLine = styled.div`
    margin:-20px -12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Lft = styled.div`
    display: flex;
  align-items: center;
  .imgBox{
    width: 96px;
    height: 96px;
    background: #fff;
    border-radius: 20px;
    border: 1px solid #EDEFF0;
    padding: 13px;
    margin-right: 16px;
    box-sizing: border-box;
    img{
      max-width: 100%;
      max-height: 100%;
    }
  }
`
const TitleBox = styled.div`
  font-family: Helvetica;
  font-size: 16px;
  .tit{
    font-size: 18px;
    line-height: 22px;
    font-weight: bold;
  }
`

const HistoryBox = styled.div`
  padding-left: 20px;
    .titleRht{
      font-weight: bold;
      color: #000;
      font-size: 1.2rem;
      margin-bottom: 20px;
    }
  .close{
    padding-top: 10px;
    text-align: right;
    padding-bottom: 10px;
    
  }
  ul{
    li{
      background: #f8f8f8;
      padding:0 20px 20px;
      box-shadow: 0 0 5px #ccc;
      border-radius: 5px;
      margin-bottom: 20px;
    }
  }
`

interface propertyObj{
    name:string;
    value:string;
}

function Home() {
    const params = useParams();
    const navigate = useNavigate();

    const {id,nftadd,chainIdstr} = params;

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
    const [chainName ,setChainName] = useState('');
    const [svgShow ,setSvgShow] = useState(false);
    const [chainId ,setChainId] = useState('');
    const [show ,setShow] = useState(false);
    const [list,setList] = useState<any[]>([])

    useEffect(()=>{
        if(!web3Provider) return;
        const { ethereum} = window as any;
        if(typeof ethereum == 'undefined'){
            return;
        }
        ethereum.on('chainChanged', () => {
            window.location.reload();

        });
        getChain();
    },[web3Provider,chainIdstr])

    const getName = (chainId:number) =>{
        const ChainArr = ChainJson.filter(item=>item.chainId === Number(chainId));
        return(ChainArr[0]?.name);

    }
    const getChain =  async() =>{
        const { ethereum } = window as any;
        if(typeof ethereum == 'undefined'){
            return;
        }
        const { chainId } = await web3Provider.getNetwork();
        if(chainIdstr!=='all' && Number(chainIdstr)!==chainId){
            setShow(true);
        }else{
            setShow(false);
        }
        setChainId(chainId);


        const ChainArr =   getName(chainId);
        setChainName(ChainArr);
    }


    const switchChain = async () =>{
        const { ethereum} = window as any;


        const ChainArr:any = ChainJson.filter(item=>item.chainId === Number(chainIdstr));
        // const { chain,nativeCurrency:{name,symbol,decimals},rpc,explorers,chainId } = ChainArr[0];
        const { chainId } = ChainArr[0];

        // ethereum.request({
        //     method: 'wallet_addEthereumChain',
        //     params: [{
        //         chainId:`0x${chainId.toString(16)}`,
        //         chainName:chain,
        //         nativeCurrency: {
        //             name,
        //             symbol,
        //             decimals
        //         },
        //         rpcUrls:rpc,
        //         blockExplorerUrls:[explorers[0]?.url]
        //     }]
        // })
        ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{
                chainId: `0x${chainId.toString(16)}`
            }]
        })
        .catch((error:any) => {
            // dispatch({type:ActionType.SET_ERROR,payload:{msg:'Please take the right chain',type:'error'}  });
            console.log(error)
        })
    }

    useEffect(() => {
        if(id==="all" ||nftadd==="add" || !id || !nftadd ||!web3Provider || !chainIdstr || !chainId) return;
        setAddress(nftadd);
        setToken(id)
        queryInfo()

    }, [id,nftadd,web3Provider,chainId]);

    useEffect(()=>{
        const { ethereum } = window as any;
        if(typeof ethereum == 'undefined'){
            return;
        }
        const web3Instance = new ethers.providers.Web3Provider(ethereum);
        setWeb3Provider(web3Instance);
        getHistory()
    },[]);

    useEffect(()=>{
        let arr = [];
        for(let key in properties){
            console.log(key,properties[key])
            if(typeof properties[key] === "string"){
                arr.push({
                    name:key,
                    value: properties[key]
                })
            }


        }
        console.log(arr)
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
    const toGo =() =>{
        navigate(`/nft-checker/${chainId}/${address}/${token}`)
        return;
    }

    const  getHistory = () =>{

        let arr= localStorage.getItem('history');
        let MyArr:any[] = []
        if(arr){
            MyArr = JSON.parse(arr!)
        }
        MyArr.push({
            chain:chainIdstr,
            address:nftadd,
            id
        })

        let newArr:any[] = [];
        MyArr.forEach((item) => {
            let check = newArr.every((b) => {
                return item.chain !== b.chain || item.address !== b.address || item.id !== b.id;
            })
            if(check){
                return newArr.push(item)
            }else{
                return ''
            }
        })

        return newArr;
    }

    const HistoryRecord = () =>{
        const newArr = getHistory();
        let mylist = [...newArr];
        setList(mylist.splice(0,5))
        localStorage.setItem('history',JSON.stringify(newArr));
    }

    const queryInfo = async() =>{

        if(Number(chainIdstr)!== Number(chainId) ) {

            setErrorTips(true)
            setTimeout(()=>{
                setErrorTips(false)

            },2000)
            setShow(true)
            return true;
        }

        HistoryRecord()
        const contract1155 = new ethers.Contract(nftadd!, ERC1155_ABI, web3Provider);
        try{
            const isERC1155 = await contract1155?.supportsInterface('0xd9b67a26');
            if(isERC1155){
                setType('ERC1155')
                Get1155();
            }else{
                setType('ERC721')
                Get721();
            }
        }catch (e:any){
            console.error(e)
            setErrorTips(true)
            setTimeout(()=>{
                setErrorTips(false)
            },2000)
        }

    }



    const Get721 = async() =>{
        setImage('');
        setMetadata('');
        setName('');

        if(!web3Provider) return;
        const nftContract = new ethers.Contract(nftadd!, ERC721_ABI, web3Provider);
        const tokenURI = await nftContract.tokenURI(id);
        setMetadata(tokenURI);
        console.log(tokenURI)

        if(tokenURI.indexOf('metadata')>-1){
            let data = await api.getData(tokenURI);
            const image = data.data.image;
            setProperties(data.data?.properties)
            setImage(image);
            setName(data.data?.name);
            setSvgShow(false)
        }else if(tokenURI.indexOf('svg')>-1){
            console.error(tokenURI)
            setImage(tokenURI);
            setSvgShow(true)
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

            setSvgShow(false)
            setImage(imageUrl);
        }

    }
    const Get1155 = async ()=>{
        setImage('');
        setMetadata('');
        setName('');

        if(!web3Provider) return;
        const nftContract = new ethers.Contract(nftadd!, ERC1155_ABI, web3Provider);
        let tokenURI = await nftContract.uri(id);

        if(tokenURI.indexOf('0x{id}')>-1){
            let url = tokenURI.split('0x{id}')[0];
            let data = await api.getData(`${url}${id}`);
            setMetadata(`${url}${id}`);
            const image = data.data.image;
            setProperties(data.data?.properties)
            setImage(image);
            setName(data.data.name);
        }else if(tokenURI.indexOf('svg')>-1){
            setImage(tokenURI);
            setSvgShow(true)
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
    const clearInput = (type:string) =>{
        if(type === 'address'){
            setAddress('');
        }else{
            setToken('')
        }

    }

    const clearhistory = (MyItem:any) =>{
        let arr= localStorage.getItem('history');
        let arrFormat = JSON.parse(arr!);
        console.log(MyItem,)

        const after = arrFormat.findIndex((item:any)=>item.id===MyItem.id && item.address === MyItem.address && item.chain === MyItem.chain);
        console.log(after)
        if(after>-1){
            arrFormat.splice(after,1);
            console.log(arrFormat)
            localStorage.setItem('history',JSON.stringify(arrFormat))
            setList(arrFormat);
            console.log(arrFormat)
        }

    }

    const toGONew = (url:string) =>{
        navigate(url)
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
              <TopLine>
                  <Lft>
                      <div className="imgBox"><img src={NftLogo} alt=""/></div>
                      <TitleBox>
                          <div className="tit">NFT Checker</div>
                          <div>Verify and Source NFT Metadata</div>
                      </TitleBox>
                  </Lft>
                  <div className="rht">
                      {
                          show &&<Button onClick={()=>switchChain()} >Change the right chain</Button>
                      }

                      {/*{*/}
                      {/*    chainName && <AddressBox>{chainName}</AddressBox>*/}
                      {/*}*/}
                      {/*{*/}
                      {/*    ! chainName && <div>Please install MetaMask</div>*/}
                      {/*}*/}
                  </div>
              </TopLine>
            <Row>

                <CardBox body>

                    <Row>
                        <Col md={9} xs={12}>
                            <CenterBox>
                                <Col>
                                    <FloatingLabel
                                        controlId="Chain"
                                        label="Chain"
                                        className="mb-3"
                                    >
                                        <Form.Control
                                            type="text"
                                            name='address'
                                            placeholder="Contract address"
                                            value={chainName || chainIdstr}
                                            readOnly
                                        />
                                    </FloatingLabel>
                                </Col>
                            </CenterBox>
                            <CenterBox>
                                <Col>
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
                                        {
                                            !!address && <button className="inner-btn" onClick={()=>clearInput('address')}>
                                                <X />
                                            </button>
                                        }
                                    </FloatingLabel>
                                </Col>
                            </CenterBox>
                            <CenterBox>
                                <Col >
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
                                        {
                                            !!token && <button className="inner-btn" onClick={()=>clearInput('token')}>
                                                <X />
                                            </button>
                                        }
                                    </FloatingLabel>
                                </Col>
                            </CenterBox>
                            <CenterBox>
                                <Button variant="flat" onClick={()=>toGo()}>Resolve</Button>
                            </CenterBox>
                            <CenterBox>
                                <Col>
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

                                        {
                                            !svgShow && <ImageBox>
                                                <img src={image} alt=""/>
                                            </ImageBox>
                                        }
                                        {
                                            svgShow && <ImageBox dangerouslySetInnerHTML={{__html: image}} />
                                        }
                                    </GrayBox>
                                </Col>
                            </CenterBox>
                        </Col>
                        <Col md={3} xs={12}>
                            <HistoryBox>
                                <div className="titleRht">History</div>
                                <ul>
                                    {
                                        !!list.length && list.map((item,index)=>( <li key={index}>
                                            <div className="close" onClick={()=>clearhistory(item)}>
                                                {getName(item.chain)} --{item.id}
                                                <X />
                                            </div>
                                            <div onClick={()=>toGONew(`/nft-checker/${item.chain}/${item.address}/${item.id}`)}>
                                                {
                                                    `${window.location.host}/nft-checker/${item.chain}/${item.address}/${item.id}`
                                                }
                                            </div>

                                        </li>))
                                    }

                                </ul>
                            </HistoryBox>
                        </Col>
                    </Row>

                </CardBox>
            </Row>
          </ContentBox>
          <FooterBox />
        </MainContent>
        <GlobalStyle />
      </div>
  );
}

export default Home;
