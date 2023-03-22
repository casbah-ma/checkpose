import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Layout from "components/Layout";
import  {Title, Paragraph} from "components/Typo"
const TEXT = [
  {
    title: 'Movements',
    description: 'Analyze your body movements with the comfort of a smartphone'
  },
  {
    title: 'Insights ',
    description: 'Visualization tools that help you understand your body’s strengths and weaknesses'
  },
  {
    title: 'Private',
    description: '100% offline. We do not collect or store your data'
  },
  {
    title: 'Free & Open',
    description: 'Code and documentation are MIT Licenced at github.com/opencoach'
  }
]

function Intro() {
  const navigate = useNavigate();

  function onSkip() {
    navigate('/capture')
  }

  return (
    <Layout>
      <Container>
        <Skip onClick={()=>onSkip()}>
          Skip
        </Skip>
        {
          TEXT.map(t => <>  <Title>{t.title }</Title>
            <Paragraph>{t.description }</Paragraph></>)
        }
      
     </Container>
    </Layout>
  );
}

export default Intro;

const Container = styled.div`
  color: white;
  padding: 20px;
  text-align:center;
  display: flex;
  justify-content:center;
  align-items:center;
  flex-direction:column;
  height:100%;
`



const Skip = styled.button`
  color: white;
  font-size: 17px;
  position: absolute;
  top:10px;
  right:20px;
`