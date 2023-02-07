import React, { useEffect, useState, useRef, useMemo } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { Stage, Layer, Line, Circle } from "react-konva";
import styled from "styled-components";
import useWindowSize from "./hooks/useWindowSize";
import useInterval from "./hooks/useIInterval";

/* The map from joint index to joint:
* 0 : neck; 1 & 2 : eyes; 3 & 4 : ears
* 5 & 6 : shoulders; 7 & 8 : elbows; 9 & 10 : hands
* 11 & 12 : hips; 13 & 14 : knees;
* 15 & 16 : feet

   const leftShoulder = poses[0].keypoints.find(
        (k) => k.name === "left_shoulder"
      );
      const rightShoulder = poses[0].keypoints.find(
        (k) => k.name === "right_shoulder"
      );
      const leftElbow = poses[0].keypoints.find((k) => k.name === "left_elbow");
      const rightElbow = poses[0].keypoints.find(
        (k) => k.name === "right_elbow"
      );
      const leftHip = poses[0].keypoints.find((k) => k.name === "left_hip");
      const rightHip = poses[0].keypoints.find((k) => k.name === "right_hip");
      const leftKnee = poses[0].keypoints.find((k) => k.name === "left_knee");
      const rightKnee = poses[0].keypoints.find((k) => k.name === "right_knee");
      const leftAnkle = poses[0].keypoints.find((k) => k.name === "left_ankle");
      const rightAnkle = poses[0].keypoints.find(
        (k) => k.name === "right_ankle"
      );


*/

function App() {
  const size = useWindowSize();
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const webcamRef = useRef(null);
  const videoRef = useRef(null);

  const videoConstraints = useMemo(() => {
    return {
      height: size.height - 10,
      width: size.width,
      facingMode: "user",
      frameRate: {
        ideal: 8,
      },
    };
  }, [size]);

  async function loadModel() {
    try {
      const MoveNet = poseDetection.SupportedModels.MoveNet;
      const detector = await poseDetection.createDetector(MoveNet);
      setModel(detector);
    } catch (error) {}
  }

  useEffect(() => {
    tf.ready().then(() => {
      loadModel();
    });
  }, []);

  async function predictionFunction() {
    if (!model || !videoRef || !videoRef.current) return;
    //Start prediction
    try {
      const videoPredictions = await model.estimatePoses(
        //document.getElementById("img")
        videoRef.current
      );
      setPredictions(videoPredictions);
    } catch (error) {
      console.error(error);
    }
  }

  useInterval(predictionFunction, 50)

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
        }}
      >
        {Array.isArray(predictions?.[0]?.keypoints) && (
          <Stage
            width={videoRef?.current?.getBoundingClientRect().width}
            height={videoRef?.current?.getBoundingClientRect().height}
          >
            <Layer>
              {predictions?.[0]?.keypoints.map(({ x, y }) => (
                <Circle
                  key={x + y + "b"}
                  x={x}
                  y={y}
                  width={10}
                  height={10}
                  fill={"rgba(0,0,0,.5)"}
                />
              ))}
            </Layer>
            <Layer>
              {predictions?.[0]?.keypoints.map(({ x, y }) => (
                <Circle
                  key={x + y + "a"}
                  x={x}
                  y={y}
                  width={5}
                  height={5}
                  fill={"white"}
                  onClick={() => alert("clicked")}
                />
              ))}
            </Layer>
            {
              <Layer>
                <Line
                  points={Array.from(predictions?.[0]?.keypoints, (d) => [
                    d.x,
                    d.y,
                  ]).flat()}
                  width={20}
                  height={20}
                  stroke={"red"}
                  strokeWidth={1}
                />
              </Layer>
            }
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
`
