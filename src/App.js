import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";

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
const MIN_SCORE = 0.55;

function App() {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [streamReady, setStreamReady] = useState(false);
  const [score, setScore] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    tf.ready().then(() => {
      loadMoveNet(setModel);
    });
  }, []);

  // useCallback and useMemo are not working here
  // Refactor
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const predictionFunction = async () => {
    if (!model || !videoRef?.current?.video) return;
    if (streamReady) {
      try {
        const videoPredictions = await model.estimatePoses(videoRef.current.video);
        setPredictions(videoPredictions);
        setScore(videoPredictions[0]?.score * 1);
      } catch (error) {
        console.error(error);
      }
    }
  }


  useEffect(() => {
    if (score < MIN_SCORE) {
      setShowCanvas(false);
    }

    /*add a penality to avoid fast change*/
    if (score >= MIN_SCORE + 0.1) {
      setShowCanvas(true);
    }
   
  }, [score]);

  useEffect(() => {
    const animation = requestAnimationFrame(()=>predictionFunction());
    return () => cancelAnimationFrame(animation);
  }, [predictionFunction]);

  const bodyMap =
    useMemo(() => bodyMapper(predictions?.[0]?.keypoints), [predictions]) || {};

  const handleMediaReady = useTimeout(() => setStreamReady(true), 1000);

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

  return (
    <>
       {
        !Array.isArray(predictions?.[0]?.keypoints) && <SystemMsg>⌛ Chargement...</SystemMsg>
      }
      {
        !showCanvas && Array.isArray(predictions?.[0]?.keypoints) && <SystemMsg>⚠️ Corriger votre position</SystemMsg>
      }

      <Dot error={!showCanvas} />
     
     
      <FixedContainer
        style={{
          zIndex: 2,
          background: "rgba(20,10,85,.95)",
        }}
      >
       
        {Array.isArray(predictions?.[0]?.keypoints)  && (
          <Stage width={videoConstraints.width} height={videoConstraints.height}>
            <Layer>
              <Circle radius={70} x={nose[0]} y={nose[1]} fill={LINE_COLOR} />
            </Layer>
            <Layer>
              <Line
                tension={0}
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
            </Layer>
          </Stage>
        )}
      </FixedContainer>

      <FixedContainer opacity="0">
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
  top: 0;
  right: 0;
  width: ${videoConstraints.width+'px'};
  height: ${videoConstraints.height+'px'};
  left: 50%;
  transform: translate(-50%, 0) scale(-1, 1);
  z-index: 1;
  box-shadow: inset rgb(0 0 0 / 40%) 11px -12px 20px 20px;
`;

const SideBar = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  width: 200px;
  height: calc(100% );
  z-index: 3;
  background-color: #050312;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  flex-direction: column ;
  z-index:8;
  h1 {
    font-size: 1.9em;
    font-weight:100;
    color: white;
    margin:0;
    border-bottom:1px dashed rgba(255,255,255,.8) ;
  }
`;

const Item = styled.div`

`
const Dot = styled.div`
  position: fixed ;
  top:0;
  left:0;
  width: 100%;
  height: 2px;
  z-index:9;
  background-color: ${props=>props.error ? 'red' : 'green'} ;
`

const SystemMsg =  styled.div`
  position: fixed ;
  top:10px;
  left:0;
  width: 100%;
  height: 200px;
  z-index:90;
  color:white
`
