import React, { useRef, useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import Layout from "components/Layout";
import bodyMapper from "lib/bodyMap";
import { AnalyzeBtnContainer } from "./Capture";
import { NewBtn, ButtonContainer } from "./Capture";
import Skeleton from "components/Skeleton";
import StreamChart from "components/StreamChart";

function Analyze(props) {
  const navigate = useNavigate();
  const [frame, setFrame] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [pauseAnimation, setPauseAnimation] = useState(false);
  const location = useLocation();
  const canvaContainer = useRef(null);
  const videoRef = useRef(null);
  const predictions = location.state.predictions || props.predictions;
  const { video } = location.state;

  const bmap = useMemo(
    () => bodyMapper(predictions?.[frame]?.keypoints, scale),
    [frame, predictions, scale]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function animate() {
    if (pauseAnimation || !predictions) return;
    setFrame((prev) => (prev + 1) % predictions?.length);
  }

  function handlePause() {
    setPauseAnimation(!pauseAnimation);
    if (!pauseAnimation) {
      videoRef.current.pause();
      videoRef.current.currentTime =
        (predictions[frame].time - predictions[0].time) / 1000;
    } else {
      videoRef.current.play();
    }
  }

  const countFramesPerSecond = useMemo(
    () =>
      (1000 * predictions?.length) /
      (predictions[predictions?.length - 1].time - predictions[0].time),
    [predictions]
  );

  useEffect(() => {
    const animation = setInterval(animate, 1000 / countFramesPerSecond);
    return () => clearInterval(animation);
  }, [animate, countFramesPerSecond]);

  return (
    <Layout scroll>
      <VidContainer>
        <video src={video} autoPlay loop playsInline ref={videoRef} />
      </VidContainer>

      <ControlsContainer top={"240px"} onClick={() => handlePause()}>
        {pauseAnimation ? "▷" : "| |"}
      </ControlsContainer>

      <ControlsContainer top={"0px"}>
        <div onClick={() => setScale(scale + 0.1)}> +</div>
        <div onClick={() => setScale(scale - 0.1)}> -</div>
      </ControlsContainer>

      <Container ref={canvaContainer}>
        {Array.isArray(predictions?.[frame]?.keypoints) && bmap && (
          <Skeleton body={bmap} scale={scale} />
        )}
      </Container>
      <div style={{
        zIndex: 999999999999,
        background: "white",
        height: "15px"
      }}>
      <Slider
       
      
       value={frame}
       onChange={(value) => {
         setFrame(value - 1);
         videoRef.current.currentTime =
           (predictions[frame].time - predictions[0].time) / 1000;
       }}
       min={1}
       shouldAnimateNumber
       max={predictions?.length}
       shouldDisplayValue={false}
     />
      </div>
   
      <StreamChart />
      <div style={{marginBottom:"250px"}} />
     

      <ButtonContainer zIndex={99}>
        <NewBtn onClick={() => navigate("/")}>New</NewBtn>
      </ButtonContainer>
    </Layout>
  );
}

export default Analyze;

const VidContainer = styled.div`
  position: absolute;
  border-radius: 10px;
  top: 0;
  right: 0;
  width: 110px;
  height: 110px !important;
  z-index: 1 !important;
  background-color: #422800;
  border: 2px solid #422800;
  opacity: 0.3;
  z-index: 0;
  :hover {
    opacity: 1;
  }
  video {
    width: 110px;
    height: 110px !important;
    object-fit: cover;
    border-radius: 10px;
  }
`;

const Container = styled.div`
  text-align: center;
  z-index: ${(props) => props.zIndex || 1};
  width: auto;
  height: 300px;
`;

const ControlsContainer = styled(AnalyzeBtnContainer)`
  top: ${(props) => props.top || "125px"};
  display: flex;
  justify-content: center;
  div {
    min-width: 30px;
    text-align: center;
  }
`;
