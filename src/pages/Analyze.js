import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { Stage, Layer, Line } from "react-konva";
//import Slider from "react-smooth-range-input";
import Layout from "components/Layout";
import bodyMapper from "lib/bodyMap";
import { LINE_COLOR, LINE_WIDTH, MIN_SCORE, TENSION } from 'constants/config'

function Analyze() {
  const [frame, setFrame]= useState(5)
  const location = useLocation();
  const canvaContainer = useRef(null);
  const predictions = location.state;
  
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
  } = bodyMapper(predictions?.[frame]?.keypoints);
  
  //console.log(predictions?.[frame]?.keypoints)
  
  return (
    <Layout scroll>
      <Container ref={canvaContainer}>
        {Array.isArray(predictions?.[frame]?.keypoints)  && (
          <Stage  width={canvaContainer?.current?.clientWidth || window.innerWidth} height={window.innerHeight*.6}>
            <Layer>
              <Line
                tension={TENSION}
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

              {rightKnee.score >= MIN_SCORE &&
                rightAnkle.score >= MIN_SCORE && (
                  <Line
                    tension={TENSION}
                    points={[
                      ...rightShoulder.coords,
                      ...rightHip.coords,
                      ...rightKnee.coords,
                      ...rightAnkle.coords,
                    ]}
                    stroke={LINE_COLOR}
                    strokeWidth={LINE_WIDTH}
                  />
                )}

              {leftKnee.score >= MIN_SCORE && leftAnkle.score >= MIN_SCORE && (
                <Line
                  tension={TENSION}
                  points={[
                    ...leftShoulder.coords,
                    ...leftHip.coords,
                    ...leftKnee.coords,
                    ...leftAnkle.coords,
                  ]}
                  stroke={LINE_COLOR}
                  strokeWidth={LINE_WIDTH}
                />
              )}
              <Line
                tension={TENSION}
                points={[...leftHip.coords, ...rightHip.coords]}
                stroke={LINE_COLOR}
                strokeWidth={LINE_WIDTH}
              />
            </Layer>
          </Stage>
                )}
      </Container>

      <h1>Analyze</h1>
      <div>{ JSON.stringify(predictions) }</div>
      
    </Layout>
  );
}

export default Analyze;

const Container = styled.div`
  text-align: center;
  z-index: ${(props) => props.zIndex || 1};
  width: 100%;
  min-width:100% ;
  height: 60vh !important;
`;