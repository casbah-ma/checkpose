import React, { useEffect, useState, useRef, useMemo } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { Stage, Layer, Line, Circle } from "react-konva";
import styled from "styled-components";
import loadMoveNet from "./lib/loadMoveNet";
import bodyMapper from "./lib/bodyMap";
import useTimeout from "./hooks/useTimeout";
import videoConstraints from "./constants/videoConstraints";
import {LINE_COLOR, LINE_WIDTH, MIN_SCORE} from './constants/config'

function App() {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [streamReady, setStreamReady] = useState(false);
  const videoRef = useRef(null);
  const handleMediaReady = useTimeout(() => setStreamReady(true), 500);
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



  return (
    <>
      {(!Array.isArray(predictions?.[0]?.keypoints) || !model) && <SystemMsg>❌ Camera</SystemMsg>}

      <FixedContainer zIndex={2} background={"#000000"}>
        {Array.isArray(predictions?.[0]?.keypoints) && (
          <Stage
            width={videoRef.current.video.clientWidth}
            height={videoRef.current.video.clientHeight}
          >
            <Layer>
              {
                nose.score >= MIN_SCORE &&  <Circle
                radius={80}
                x={nose.coords[0]}
                y={nose.coords[1]}
                stroke={LINE_COLOR}
                strokeWidth={5}
              />
              }
             
            </Layer>
            <Layer>
        
                <Line
                tension={0.25}
                points={[
                  ...rightWrist.coords,
                  ...rightElbow.coords,
                  ...rightShoulder.coords,
                  ...leftShoulder.coords,
                  ...leftElbow.coords,
                  ...leftWrist.coords,
                ]}
                stroke={LINE_COLOR}
                strokeWidth={LINE_WIDTH}
              />
            
              
              {
                rightKnee.score >= MIN_SCORE && rightAnkle.score >= MIN_SCORE && 
                <Line
                tension={0.25}
                points={[
                  ...rightShoulder.coords,
                  ...rightHip.coords,
                  ...rightKnee.coords,
                  ...rightAnkle.coords,
                ]}
                stroke={LINE_COLOR}
                strokeWidth={LINE_WIDTH}
              />

              }
              
              {
                 leftKnee.score >= MIN_SCORE && leftAnkle.score >= MIN_SCORE &&  <Line
                 tension={0.25}
                 points={[
                   ...leftShoulder.coords,
                   ...leftHip.coords,
                   ...leftKnee.coords,
                   ...leftAnkle.coords,
                 ]}
                 stroke={LINE_COLOR}
                 strokeWidth={LINE_WIDTH}
               />
              }
              <Line
                tension={0.25}
                points={[...leftHip.coords, ...rightHip.coords]}
                stroke={LINE_COLOR}
                strokeWidth={LINE_WIDTH}
              />
            </Layer>
          </Stage>
        )}
      </FixedContainer>

      <FixedContainer zIndex={-1}>
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
  top:0;
  bottom:0;
  right: 0;
  width: ${videoConstraints.width + "px"};
  height: 100%;
  left: 50%;
  transform: translate(-50%, 0) scale(-1, 1);
  z-index: ${(props) => props.zIndex || 1};
  background: ${(props) => props.background};
  box-shadow: inset rgb(0 0 0 / 40%) 11px -12px 20px 20px;
`;

const SystemMsg = styled.div`
  position: fixed;
  transform: translate(-50%, 0);
  width: 100%;
  left: 50%;
  top: 100px;
  text-align: center;
  height: 200px;
  z-index: 90;
  color: white;
  font-size: 2.5em;
`;
