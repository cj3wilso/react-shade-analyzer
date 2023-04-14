import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
body{
    font-family: "Roboto", Arial, sans-serif !important;
}
`;

export const Container = styled.div`
  box-sizing: border-box;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 10;

  background: url("./img/bg-foundation.webp") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  border: 3px solid white;
`;

export const Title = styled.div`
  font-size: 2em;
  font-weight: 900;
  text-transform: uppercase;
  margin-top: 30vh;
  margin-bottom: 0vh;
  white-space: pre;
  text-align: left;
  order: 1;
`;

export const Subtitle = styled.div`
  font-size: 0.9em;
  font-weight: 300;
  letter-spacing: 0.04em;
  margin-bottom: 3vh;
  line-height: 1.6;
  text-align: left;
  order: 2;
`;

// export const Button = styled.button`
//   font-size: 18px;
//   text-transform: uppercase;
//   color: white;
//   background-color: black;
//   cursor: pointer;
//   width: 100%;
//   max-width: 700px;
//   border: 0;
//   padding: calc(1px + 1.5625vw);
//   /*margin: 0 3vh 3vh;*/
//   margin-bottom: 3vh;
//   display:block;
// `;

// export const ButtonSpan = styled(Button)`
//   display: inline-block;
//   margin-top: 10px;
//   margin-right: 0.25rem;
//   width: auto;
//   max-width: none;
// `;

// export const ContentArea = styled(Container)`
// box-sizing: border-box;
// padding: calc(8px + 1.5625vw);
// `;
export const MarginArea = styled.div`
  box-sizing: border-box;
  padding: calc(8px + 1.5625vw);
  height: 100%;
`;

export const ContentBox = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  height: calc(100% - (50px + 1.5625vw));
  //height: 100%;
`;
export const Content1 = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  overflow: hidden;
  height: 50%;
  @media screen and (min-width: 800px) {
    flex: 3;
    height: 100%;
  }
  img {
    width: auto;
    height: 100%;
    align-self: center;
    overflow: hidden;
  }
`;
export const Content2 = styled(Content1)`
  background: rgba(255, 255, 255, 0.9);
  //background: white;
  -webkit-box-shadow: 5px 5px 8px -1px rgba(0, 0, 0, 0.38);
  box-shadow: 5px 5px 8px -1px rgba(0, 0, 0, 0.38);
  border: white solid 2px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 0.25rem;
  @media screen and (min-width: 800px) {
    flex: 1;
  }
`;

export const ContentArea = styled.div`
  background-color: white;
  /*overflow:auto*/
`;
