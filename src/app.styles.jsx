import styled, { createGlobalStyle } from "styled-components";

// import {
//   BaseButton,
//   GoogleSignInButton,
//   InvertedButton,
// } from '../button/button.styles';

export const GlobalStyle = createGlobalStyle`
body{
    font-family: "Roboto", Arial, sans-serif !important;
}
`;

export const Container = styled.div`
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
`;

export const Title = styled.div`
  font-size: 2.0em;
  font-weight: 900;
  text-transform: uppercase;
  margin-top: 50vh;
  margin-bottom: 0vh;
  white-space: pre;
  text-align: left;
  order: 1;
`;

export const Subtitle = styled.div`
font-size: .90em;
font-weight: 300;
letter-spacing: 0.04em;
margin-bottom: 3vh;
line-height: 1.6;
text-align: left;
order: 2;
`;

export const Button = styled.button`
  font-size: 18px;
  text-transform: uppercase;
  color: white;
  background-color: black;
  cursor: pointer;
  width:100%;
  border: 0;
  padding: calc(1px + 1.5625vw);
  margin-bottom: 3vh;
`;

export const ContentArea = styled(Container)`
box-sizing: border-box;
padding: calc(8px + 1.5625vw);
`;

export const CartDropdownContainer = styled.div`
  position: absolute;
  width: 240px;
  height: 340px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid black;
  background-color: white;
  top: 90px;
  right: 40px;
  z-index: 5;
`;

export const EmptyMessage = styled.span`
  font-size: 18px;
  margin: 50px auto;
`;

export const CartItems = styled.div`
  height: 240px;
  display: flex;
  flex-direction: column;
  overflow: scroll;
`;
