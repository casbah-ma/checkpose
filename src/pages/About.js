import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Layout from "components/Layout";
import { Title, Paragraph } from "components/Typo";

function Intro() {
  const navigate = useNavigate();

  function onSkip() {
    navigate("/capture");
  }

  return (
    <Layout scroll>
      <Container>
        <Skip onClick={() => onSkip()}>Skip</Skip>
        <Title>ABOUT</Title>
      </Container>
    </Layout>
  );
}

export default Intro;

const Container = styled.div`
  color: white;
  padding: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;

const Skip = styled.button`
  color: white;
  font-size: 17px;
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer;
  border-bottom:5px solid yellow;
`;
