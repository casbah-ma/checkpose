import { useCallback, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import useKeyPress from "hooks/useKeyPress";
import Layout, { Footer } from "components/Layout";
import { Title, Paragraph } from "components/Typo";
import { NewBtn } from "./Capture";
import PACKAGE from "../../package.json";

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
        {TEXT.map((t, k) => (
          <div key={k}>
            <Title>{t.title}</Title>
            <Paragraph>{t.description}</Paragraph>
          </div>
        ))}

        <ButtonContainer>
          <TryBtn onClick={() => onSkip()}>Try</TryBtn>
        </ButtonContainer>
      </Container>
      <Footer>
        <a href="https://github.com/casbah-ma/checkpose" target="_blank" rel="noreferrer">
          Version {PACKAGE.version}
        </a>
      </Footer>
    </Layout>
  );
}

export default Intro;

const Container = styled.div`
  padding: 20px;
  text-align: center;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  height: auto;
`;

const TryBtn = styled(NewBtn)`
  box-shadow: #4caf50 4px 4px 0 0;
`;

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 50px;
  right: 0;
  width: 100vw;
  text-align: center;
  z-index: ${(props) => props.zIndex || 1};
  background: ${(props) => props.background};
`;

