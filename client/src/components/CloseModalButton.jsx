import React from "react";
import styled from "styled-components";

const CloseButton = styled.button`
  position: absolute;
  margin: 0 0 0 0;
  background-color: white;
  border: 0;
  right: 0;
  cursor: pointer;
`;

const CloseModalButton = (props) => {
  return <CloseButton {...props} />;
};

export default CloseModalButton;
