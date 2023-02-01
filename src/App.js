import React, { useEffect, useState, useRef } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";

import "./App.css";

function App() {
  const [model, setModel] = useState(null);
  const webcamRef = React.useRef(null);
  const [videoWidth, setVideoWidth] = useState(960);
  const [videoHeight, setVideoHeight] = useState(640);
  const videoConstraints = {
    height: 1080,
    width: 1920,
    facingMode: "environment",
  };

  async function loadModel() {
    try {
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet
      );
      setModel(detector);
    } catch (error) {}
  }

  useEffect(() => {
    tf.ready().then(() => {
      loadModel();
    });
  }, []);

  async function predictionFunction() {
    if (!model) return
    console.log(model)
    //Clear the canvas for each prediction
    var cnvs = document.getElementById("myCanvas");
    var ctx = cnvs.getContext("2d");
    ctx.clearRect(
      0,
      0,
      webcamRef.current.video.videoWidth,
      webcamRef.current.video.videoHeight
    );
    //Start prediction
    const predictions = await model.detect(document.getElementById("img"));
    if (predictions.length > 0) {
      console.log(predictions);
      for (let n = 0; n < predictions.length; n++) {
        console.log(n);
        if (predictions[n].score > 0.8) {
          //Threshold is 0.8 or 80%
          //Extracting the coordinate and the bounding box information
          let bboxLeft = predictions[n].bbox[0];
          let bboxTop = predictions[n].bbox[1];
          let bboxWidth = predictions[n].bbox[2];
          let bboxHeight = predictions[n].bbox[3] - bboxTop;
          console.log("bboxLeft: " + bboxLeft);
          console.log("bboxTop: " + bboxTop);
          console.log("bboxWidth: " + bboxWidth);
          console.log("bboxHeight: " + bboxHeight);
          //Drawing begin
          ctx.beginPath();
          ctx.font = "28px Arial";
          ctx.fillStyle = "red";
          ctx.fillText(
            predictions[n].class +
              ": " +
              Math.round(parseFloat(predictions[n].score) * 100) +
              "%",
            bboxLeft,
            bboxTop
          );
          ctx.rect(bboxLeft, bboxTop, bboxWidth, bboxHeight);
          ctx.strokeStyle = "#FF0000";
          ctx.lineWidth = 3;
          ctx.stroke();
          console.log("detected");
        }
      }
    }
    //Rerun prediction by timeout
    setTimeout(() => predictionFunction(), 500);
  }

  return (
    <div className="App">
      {!model ? "loading" : "Hello"}

      <div style={{ position: "absolute", top: "400px" }}>
        <Webcam
          audio={false}
          id="img"
          ref={webcamRef}
          screenshotQuality={1}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
      </div>

      <div style={{ position: "absolute", top: "400px", zIndex: "9999" }}>
        <canvas
          id="myCanvas"
          width={videoWidth}
          height={videoHeight}
          style={{ backgroundColor: "transparent" }}
        />
      </div>

      <button
        variant={"contained"}
        style={{
          color: "white",
          backgroundColor: "blueviolet",
          width: "50%",
          maxWidth: "250px",
        }}
        onClick={() => {
          predictionFunction();
        }}
      >
        Start Detect
      </button>
    </div>
  );
}

export default App;
