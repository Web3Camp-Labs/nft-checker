import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

  @font-face {
    font-family: "AdobeGurmukhi-Bold";
    src: url("https://web3camp.us/AdobeGurmukhi-Bold.otf");
  }
  @font-face {
    font-family: "Helvetica";
    src: url('https://web3camp.us/Helvetica.ttc');
  }

  html,
  body {
    padding: 0;
    margin: 0;
    background: #FAFBFC;
    color: #666666;
  }
  * {
    padding: 0;
    margin: 0;
    font-family: "Helvetica";
  }

  a{
    text-decoration: none;
    color: #666666;
  }
  a:hover{
    color: purple;
  }

  ul,li{
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .btn-flat {
    background-color: #2D1D0A;
    color: white;
    width: 152px;
    height: 46px;
    font-family: "Helvetica";
  }
  .btn-flat:focus{
    outline: none;
  }
  .btn-flat:hover{
    background: purple;
    color: white;
  }
  .spinner-primary{
    color: purple;
  }
  .backgroun-gray{
    background: #f8f8f8;
  }
  .form-check-input:checked {
    background-color: purple;
    border-color: purple;
  }
  .form-check-input:focus{
    outline: none;
    border-color: #ccc;
  }
  .header{
    /*box-shadow: 0 0 5px #ccc;*/
    padding:23px 0;
    background: #fff;
  }
  .header img{
    height: 45px;
  }
  .headerTxt{
    font-family: "Helvetica";
    font-weight: bolder;
    font-size: 32px;
    /* text-transform: uppercase; */
  }
  .headetRht{
    text-align: right;
    font-size: 12px;
    padding-top: 20px;
  }

    .spinner-primary{
    color: purple;
    }
  .title{
    font-size: 24px;
    line-height: 32px;
    text-align: center;
    font-weight: 400;
    margin-top: 20px;
    font-weight: lighter;
  }
  .tips{
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
    opacity: 0.6;
  }
  .desc{
    margin: 20px;
    opacity: 0.6;
    text-align: center;
  }
  .tipsBox{
    opacity: 0.6;
    font-size: 12px;
    line-height: 1em;
  }
  .lastLine{
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    button{
      font-size: 12px;
    }
  }
  .liBox{
    &>div{
      height: 100%;
    }
  }
  .result{
    text-align: center;
    color:green;
  }
`;
export default GlobalStyle
