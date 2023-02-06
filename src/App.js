import React, { useEffect, useState, useRef, useMemo } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import styled from "styled-components";
import useWindowSize from "./hooks/useWindowSize";
import useTimeout from "./hooks/useTimeout";

function App() {
  const size = useWindowSize();
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [mediaIsReady, setMediaIsReady] = useState(false);
  const webcamRef = useRef(null);

  const videoConstraints = useMemo(() => {
    return {
      height: size.height,
      width: size.width,
      facingMode: "user",
      frameRate: {
        ideal: 10,
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
    if (!model || !mediaIsReady) return;
    //Start prediction
    try {
      const videoPredictions = await model.estimatePoses(
        document.getElementById("img")
      );
      setPredictions(videoPredictions);
      setTimeout(() => predictionFunction(), 500
      )
    } catch (error) {
      console.error(error);
    }
  }

  useTimeout(() => {
    predictionFunction();
  }, 1000);

  return (
    <div
      style={{
        textAlign: "center",
        position: "relative",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {
        predictions?.[0]?.keypoints[0] && <>
          <Noise top={predictions?.[0]?.keypoints[0].y} right={predictions?.[0]?.keypoints[0].x} />
          <Noise top={predictions?.[0]?.keypoints[1].y} right={predictions?.[0]?.keypoints[1].x} />
          <Noise top={predictions?.[0]?.keypoints[2].y} right={predictions?.[0]?.keypoints[2].x} />
          <Noise top={predictions?.[0]?.keypoints[3].y} right={predictions?.[0]?.keypoints[3].x} />
          <Noise top={predictions?.[0]?.keypoints[4].y} right={predictions?.[0]?.keypoints[4].x} />

          <Noise top={predictions?.[0]?.keypoints[5].y} right={predictions?.[0]?.keypoints[5].x} />
          <Noise top={predictions?.[0]?.keypoints[6].y} right={predictions?.[0]?.keypoints[6].x} />
          <Noise top={predictions?.[0]?.keypoints[7].y} right={predictions?.[0]?.keypoints[7].x} />
          <Noise top={predictions?.[0]?.keypoints[8].y} right={predictions?.[0]?.keypoints[8].x} />

          <Noise top={predictions?.[0]?.keypoints[9].y} right={predictions?.[0]?.keypoints[9].x} />
          <Noise top={predictions?.[0]?.keypoints[10].y} right={predictions?.[0]?.keypoints[10].x} />
          <Noise top={predictions?.[0]?.keypoints[11].y} right={predictions?.[0]?.keypoints[11].x} />
          <Noise top={predictions?.[0]?.keypoints[12].y} right={predictions?.[0]?.keypoints[12].x} />

          <Noise top={predictions?.[0]?.keypoints[13].y} right={predictions?.[0]?.keypoints[13].x} />
          <Noise top={predictions?.[0]?.keypoints[14].y} right={predictions?.[0]?.keypoints[14].x} />
          <Noise top={predictions?.[0]?.keypoints[15].y} right={predictions?.[0]?.keypoints[15].x} />
          <Noise top={predictions?.[0]?.keypoints[16].y} right={predictions?.[0]?.keypoints[16].x} />
        
        </>
      }
   

      <div
        style={{
          position: "fixed",
          bottom: 0,
          zIndex: 999999,
          background:"rgba(255,255,255,.5)",
        }}
      >
        {mediaIsReady && "media"}
        {JSON.stringify(predictions?.[0]?.keypoints.length)}
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
       
          
        }}
      >
        {videoConstraints?.height && (
          <Webcam
            audio={false}
            id="img"
            ref={webcamRef}
            onUserMedia={() => setMediaIsReady(true)}
            screenshotQuality={1}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            mirrored
           
          />
        )}
      </div>
    </div>
  );
}

export default App;

const Noise = styled.div`
  text-align:center;
  position:fixed;
  z-index:999999;
  width:20px;
  height:20px;
  background-color:black ;
  border-radius:50% ;
  top:${props=>props.top+'px'};
  right:${props=>props.right+'px'};
`