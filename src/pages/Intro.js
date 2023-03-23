import { useCallback, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import useKeyPress from "hooks/useKeyPress";
import Layout from "components/Layout";
import { Title, Paragraph } from "components/Typo";
import { NewBtn } from "./Capture";
import Spacer from "components/Spacer";
import { ButtonContainer } from "./Capture";
import ANNOUNCEMENTS from "ANNOUNCEMENTS";

const TEXT = [
  {
    title: "Capture",
    description:
      "Analyze your body movements with the comfort of a smartphone camera.",
  },
  {
    title: "Visualize",
    description:
      "Understand with graphics your body’s strengths and weaknesses.",
  },
  {
    title: "Offline",
    description:
      "Runs on your browser without the internet or a remote server.",
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
        <News>
          <span>{ ANNOUNCEMENTS.version }</span>
          <p>{ ANNOUNCEMENTS.description }</p>
        </News>

        {TEXT.map((t, k) => (
          <div key={k + "key--"}>
            <Title>{t.title}</Title>
            <Paragraph>{t.description}</Paragraph>
          </div>
        ))}

        <a href="https://github.com/casbah-ma" target="_blank"  rel="noreferrer" >
            Source Code
        </a>
      </Container>
      <Spacer top={300} />
      <ButtonContainer>
        <TryBtn onClick={() => onSkip()}>Try</TryBtn>
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
  a{
    color: white;
    margin-bottom:9px;
  }
`;

const News = styled.div`
  width: 300px;
  height: auto;
  padding: 20px;
  padding-bottom:0;
  padding-top:0;
  margin-bottom: 30px;
  background-color: black;
  
  span {
    color: black;
    background-color: white;
    padding: 5px;
    margin: 0;
  }
  p {
  }
`;

const TryBtn = styled(NewBtn)`
  box-shadow: #4caf50 4px 4px 0 0;
`;
