import { useCallback, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import useKeyPress from "hooks/useKeyPress";
import Layout from "components/Layout";
import { Title, Paragraph } from "components/Typo";
import { NewBtn } from "./Capture";
import { ButtonContainer } from "./Capture";
import Spacer from "components/Spacer";
const TEXT = [
  {
    title: "Capture",
    description: "Analyze your body movements with the comfort of a smartphone camera.",
  },
  {
    title: "Visualize",
    description: "Understand with graphics your body’s strengths and weaknesses.",
  },
  {
    title: "Offline",
    description: "Runs on your browser without the internet or a remote server.",
  },
  {
    title: "Free",
    description: "Open-source and 100% free.",
  },
];

function Intro() {
  const navigate = useNavigate();
  const escapePress = useKeyPress("Escape");

  const onSkip = useCallback(() => navigate("/capture"), [navigate]);

  useEffect(() => {
    if (escapePress) {
      onSkip();
    }
  }, [escapePress, onSkip]);

  return (
    <Layout scroll>
      <Container>
      
      

        {TEXT.map((t, k) => (
          <div  key={k + "key--"}>
            <Title>{t.title}</Title>
            <Paragraph>{t.description}</Paragraph>
          </div>
        ))}
         <img src="/bg.png" alt="abstract-bg" width="100%" height={"100%"}/>
      </Container>
      <ButtonContainer>
        {" "}
        <NewBtn onClick={()=>onSkip()}>Try</NewBtn>
      </ButtonContainer>
     
    </Layout>
  );
}

export default Intro;

const Container = styled.div`
  color: white;
  padding: 20px;
  text-align: center;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;
