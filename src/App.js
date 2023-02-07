import React, { useEffect, useState, useRef, useMemo } from "react";

import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { Stage, Layer, Line } from "react-konva";
import styled from "styled-components";
import loadMoveNet from "./lib/loadMoveNet";
import useWindowSize from "./hooks/useWindowSize";
import bodyMapper from "./lib/bodyMap";

const LINE_COLOR = "white";
const LINE_WIDTH = 4;

function App() {
  const size = useWindowSize();
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const webcamRef = useRef(null);
  const videoRef = useRef(null);

  
  useEffect(() => {
    tf.ready().then(() => {
      loadMoveNet(setModel);
    });
  }, []);

  const videoConstraints = useMemo(() => {
    return {
      height: size.height,
      width: size.width,
      facingMode: "user",
      frameRate: {
        ideal: 8,
      },
    };
  }, [size]);


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const predictionFunction = async () => {
    if (!model || !videoRef || !videoRef.current) return;
    try {
      const videoPredictions = await model.estimatePoses(videoRef.current);
      setPredictions(videoPredictions);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const animation = requestAnimationFrame(predictionFunction);
    return () => cancelAnimationFrame(animation);
  }, [predictionFunction]);

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

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          width: videoRef?.current?.getBoundingClientRect().width,
          height: videoRef?.current?.getBoundingClientRect().height,
          zIndex: 2,
          background: "black",
        }}
      >
        {Array.isArray(predictions?.[0]?.keypoints) && (
          <Stage
            width={videoRef?.current?.getBoundingClientRect().width}
            height={videoRef?.current?.getBoundingClientRect().height}
          >
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
      </div>

      <VideoContainer>
        <video controls id="demo-vid" autoPlay muted ref={videoRef}>
          <source src="/demo.mp4#t=20" type="video/mp4" />
        </video>

        {videoConstraints?.height && false && (
          <Webcam
            audio={false}
            id="img"
            ref={webcamRef}
            screenshotQuality={1}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            mirrored
          />
        )}
      </VideoContainer>
    </>
  );
}

export default App;

const VideoContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
`;
