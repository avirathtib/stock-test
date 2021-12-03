import React from "react";
import styled from "styled-components";

const TextInput = styled.input`
  display: flex;
  margin-bottom: 0.5em;
  height: 100%;
  width: 100%;
  margin: 0% 0 0 0%;
  border: 1px solid #e0e5ea;
  box-sizing: border-box;
  border-radius: 5px;
  font-size: large;
  line-height: 200%;
  padding-left: 1em;
  padding: 0.25em;
`;

const UserInput = (props) => {
  return <TextInput {...props} />;
};

export default UserInput;
