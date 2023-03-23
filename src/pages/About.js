import styled from "styled-components";
import Layout from "components/Layout";
import { Title } from "components/Typo";

function Intro() {
 
  return (
    <Layout scroll>
      <Container>

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

