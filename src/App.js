import React, { useEffect, useState, useRef, useMemo } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { Stage, Layer, Line, Circle } from "react-konva";
import styled from "styled-components";
import loadMoveNet from "./lib/loadMoveNet";
import bodyMapper from "./lib/bodyMap";
import useTimeout from "./hooks/useTimeout";
import videoConstraints from "./constants/videoConstraints";

const LINE_COLOR = "orange";
const LINE_WIDTH = 4;
const MIN_SCORE = 0.49;

function App() {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [streamReady, setStreamReady] = useState(false);
  const [score, setScore] = useState(null);
  const videoRef = useRef(null);
  const handleMediaReady = useTimeout(() => setStreamReady(true), 1000);
  const bodyMap =
    useMemo(() => bodyMapper(predictions?.[0]?.keypoints), [predictions]) || {};

  const {
    nose,
    leftShoulder,
    rightShoulder,
    leftElbow,
    rightElbow,
    leftHip,
    rightHip,
    leftKnee,
    rightKnee,
    leftAnkle,
    rightAnkle,
    rightWrist,
    leftWrist,
  } = bodyMap;

  // useCallback and useMemo are not working here
  // Refactor
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const predictionFunction = async () => {
    if (!model || !videoRef?.current?.video) return;
    if (streamReady) {
      try {
        const videoPredictions = await model.estimatePoses(
          videoRef.current.video
        );
        setPredictions(videoPredictions);
        setScore(videoPredictions[0]?.score * 1);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    tf.ready().then(() => {
      loadMoveNet(setModel);
    });
  }, []);

  useEffect(() => {
    const animation = requestAnimationFrame(predictionFunction);
    return () => cancelAnimationFrame(animation);
  }, [predictionFunction]);

  useEffect(() => {
    if (score < MIN_SCORE) {
      setShowCanvas(false);
    }
    /*add a penality to avoid fast changes*/
    if (score >= MIN_SCORE + 0.05) {
      setShowCanvas(true);
    }
  }, [score]);

  return (
    <>
      {!showCanvas && Array.isArray(predictions?.[0]?.keypoints) && (
        <SystemMsg>⚠️ Corriger votre position devant la camera</SystemMsg>
      )}

      {!Array.isArray(predictions?.[0]?.keypoints) && <SystemMsg>⌛</SystemMsg>}

      <FixedContainer zIndex={2} background={"rgba(20,10,85,.99)"}>
        {Array.isArray(predictions?.[0]?.keypoints) && (
          <Stage
            width={videoRef.current.video.clientWidth}
            height={videoRef.current.video.clientHeight}
          >
            <Layer>
              <Circle
                radius={80}
                x={nose[0]}
                y={nose[1]}
                stroke={LINE_COLOR}
                strokeWidth={5}
              />
            </Layer>
            <Layer>
              <Line
                tension={0.25}
                points={[
                  ...rightWrist,
                  ...rightElbow,
                  ...rightShoulder,
                  ...leftShoulder,
                  ...leftElbow,
                  ...leftWrist,
                ]}
                stroke={LINE_COLOR}
                strokeWidth={LINE_WIDTH}
              />

              <Line
                points={[
                  ...rightShoulder,
                  ...rightHip,
                  ...rightKnee,
                  ...rightAnkle,
                ]}
                stroke={LINE_COLOR}
                strokeWidth={LINE_WIDTH}
              />

              <Line
                points={[
                  ...leftShoulder,
                  ...leftHip,
                  ...leftKnee,
                  ...leftAnkle,
                ]}
                stroke={LINE_COLOR}
                strokeWidth={LINE_WIDTH}
              />
              <Line
                points={[...leftHip, ...rightHip]}
                stroke={LINE_COLOR}
                strokeWidth={LINE_WIDTH}
              />
            </Layer>
          </Stage>
        )}
      </FixedContainer>

      <FixedContainer>
        <Webcam
          onUserMedia={() => handleMediaReady()}
          audio={false}
          id="mywebcam"
          ref={videoRef}
          screenshotQuality={1}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
      </FixedContainer>
    </>
  );
}

export default App;

const FixedContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 0;
  width: ${videoConstraints.width + "px"};
  height: ${videoConstraints.height + "px"};
  left: 50%;
  transform: translate(-50%, 0) scale(-1, 1);
  z-index: ${(props) => props.zIndex || 1};
  background: ${(props) => props.background};
  box-shadow: inset rgb(0 0 0 / 40%) 11px -12px 20px 20px;
  border: 10px solid white;
`;

const SystemMsg = styled.div`
  position: fixed;
  transform: translate(-50%, 0);
  width: ${videoConstraints.width + "px"};
  left: 50%;
  top: 100px;
  text-align: center;
  height: 200px;
  z-index: 90;
  color: white;
  font-size: 2.5em;
`;
