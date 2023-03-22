import React, { useRef, useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import Layout from "components/Layout";
import LineChartComponent from "components/LineChart";
import bodyMapper from "lib/bodyMap";
import findAngle from "lib/findAngle";
import { AnalyzeBtnContainer } from "./Capture";
import { NewBtn, ButtonContainer } from "./Capture";
import Skeleton from "components/Skeleton";
import Spacer from "components/Spacer";

function Analyze(props) {
  const navigate = useNavigate();
  const [frame, setFrame] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [angles, setAngles] = useState([]);
  const [pauseAnimation, setPauseAnimation] = useState(false);
  const location = useLocation();
  const canvaContainer = useRef(null);
  const videoRef = useRef(null);
  const predictions = location?.state?.predictions || props?.predictions;

  useEffect(() => {
    if (!predictions && navigate) {
      navigate("/");
    }
  }, [predictions, navigate]);

  const bmap = useMemo(
    () => bodyMapper(predictions?.[frame]?.keypoints, scale),
    [frame, predictions, scale]
  );

  function handlePause() {
    setPauseAnimation(!pauseAnimation);
    try {
      if (!pauseAnimation) {
        videoRef.current.pause();
        videoRef.current.currentTime =
          (predictions[frame].time - predictions[0].time) / 1000;
      } else {
        videoRef.current.play();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const countFramesPerSecond = useMemo(() => {
    if (predictions) {
      return (
        (1000 * predictions?.length) /
        (predictions[predictions?.length - 1].time - predictions[0].time)
      );
    }
  }, [predictions]);

  useEffect(() => {
    function animate() {
      if (pauseAnimation || !predictions) return;
      setFrame((prev) => (prev + 1) % predictions?.length);
    }

    const animation = setInterval(animate, 1000 / countFramesPerSecond);
    return () => clearInterval(animation);
  }, [countFramesPerSecond, pauseAnimation, predictions]);

  useEffect(() => {
    if (predictions) {
      let output = [];
      const predictionLenght = predictions.length;

      for (let i = 0; i < predictionLenght; i++) {
        const bmap = bodyMapper(predictions[i].keypoints);
        const rightKnee = findAngle(
          bmap.rightHip.coords,
          bmap.rightKnee.coords,
          bmap.rightAnkle.coords
        );
        const leftKnee = findAngle(
          bmap.leftHip.coords,
          bmap.leftKnee.coords,
          bmap.leftAnkle.coords
        );
        const rightElbow = findAngle(
          bmap.rightShoulder.coords,
          bmap.rightElbow.coords,
          bmap.rightWrist.coords
        );
        const leftElbow = findAngle(
          bmap.leftShoulder.coords,
          bmap.leftElbow.coords,
          bmap.leftWrist.coords
        );
        const back = findAngle(
          bmap.rightShoulder.coords,
          bmap.rightHip.coords,
          bmap.rightKnee.coords
        );
        output.push({
          rightKnee,
          leftKnee,
          rightElbow,
          leftElbow,
          back,
          time: predictions[i].time - predictions[0].time,
        });
      }

      setAngles(output);
    }
  }, [predictions]);

  return (
    <Layout scroll>
      {predictions && (
        <>
          <Fixed>
            <VidContainer>
              <video
                src={location?.state?.video}
                autoPlay
                loop
                playsInline
                ref={videoRef}
              />
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

            <SliderContainer id="slider-track">
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
            </SliderContainer>
          </Fixed>

          <Spacer bottom={350} />
          <label>Knees</label>
          <Spacer />
          <LineChartComponent
            data={angles}
            dataKeys={["rightKnee", "leftKnee"]}
          />
          <Spacer />
          <label>Elbows</label>
          <Spacer />
          <LineChartComponent
            data={angles}
            dataKeys={["rightElbow", "leftElbow"]}
          />
          <Spacer />
          <label>Back</label>
          <Spacer />
          <LineChartComponent data={angles} dataKeys={["back"]} />
          <ButtonContainer zIndex={99999999}>
            <NewBtn onClick={() => navigate("/")}>New</NewBtn>
          </ButtonContainer>
        </>
      )}
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

const SliderContainer = styled.div`
  z-index: 999999999999;
  background: white;
  height: 15px;
`;

const Fixed = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  width: 100%;
  z-index: 999999999;
  background-color: #07090a;
  max-width: 600px;
  margin: 0 auto;
`;
