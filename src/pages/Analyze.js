import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Slider from "react-smooth-range-input";
import Layout from "components/Layout";
import bodyMapper from "lib/bodyMap";


function Analyze() {
  const location = useLocation();
  const predictions = location.state;

  const bodyMap =
    useMemo(() => bodyMapper(predictions?.[0]?.keypoints), [predictions]) || {};
  const {
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
    <Layout scroll>
      <h1>Predictions</h1>
      {
        JSON.stringify(predictions)
     }
      
    
    </Layout>
  );
}

export default Analyze;