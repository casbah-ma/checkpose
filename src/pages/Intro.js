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
    title: "Analyze",
    description: "Analyze your body movements with the comfort of a smartphone",
  },
  {
    title: "Visualize",
    description: "Understand your body’s strengths and weaknesses",
  },
  {
    title: "Offline",
    description: "Runs on your browser without internet or a remote server",
  },
  {
    title: "Private",
    description: "Your video feed and body data never leave your browser",
  },
  {
    title: "Open source",
    description: "Fork us at Github",
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
      </Container>
      <ButtonContainer>
        {" "}
        <NewBtn onClick={()=>onSkip()}>Try</NewBtn>
      </ButtonContainer>
      <Spacer bottom={200} />
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

const Skip = styled.button`
  color: white;
  font-size: 17px;
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer;
  border-bottom: 5px solid yellow;
`;
