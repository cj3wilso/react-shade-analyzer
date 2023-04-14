import styled from "styled-components";

import { SpinnerContainer } from "../spinner/spinner.styles.tsx";

export const BaseButton = styled.button`
  font-size: 18px;
  text-transform: uppercase;
  color: white;
  background-color: black;
  cursor: pointer;
  border: 0;
  padding: calc(1px + 1.5625vw);
  /*margin: 0 3vh 3vh;*/
  margin-bottom: 3vh;
  display: inline-block;
  margin-top: 10px;
  margin-right: 0.25rem;
  width: auto;
  max-width: none;
  &:hover {
    background-color: white;
    color: black;
  }
`;

export const WideButton = styled(BaseButton)`
  display: block;
  width: 100%;
  max-width: 700px;
  margin-top: 0;
  margin-right: 0;
  &:hover {
    background-color: white;
    color: black;
  }
`;

export const InvertedButton = styled(BaseButton)`
  background-color: white;
  color: black;
  position: absolute;
  bottom: 0;
  left: 0;
  margin-bottom: 0;
  padding-top: 1.2vw;
  padding-bottom: 1.2vw;
  &:before {
    content: "\\2713";
    color: green;
    display: inline-block;
    padding: 0 6px 0 0;
    visibility: hidden;
  }
  &.cropped:before {
    visibility: visible;
  }
  &:hover {
    background-color: black;
    color: white;
    border: none;
  }
`;

export const ButtonSpinner = styled(SpinnerContainer)`
  width: 30px;
  height: 30px;
`;
