import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
   
    *{
      padding: 0;
      margin: 0;
    }
    body,html{
      background: #fff;
      color: #666666;
    }
    ul,li{
        list-style: none;
         padding: 0;
        margin: 0;
    }
    .btn-flat {
      background-color: purple;
      color: white;
    
      &:focus{
        outline: none;
      }
      &:hover{
        background: #000;
        color: white;
      }
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
