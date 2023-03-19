import React, { useRef, useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { Stage, Layer, Line } from "react-konva";
import Slider from "react-smooth-range-input";
import Layout from "components/Layout";
import bodyMapper from "lib/bodyMap";
import { LINE_COLOR, LINE_WIDTH, MIN_SCORE, TENSION } from 'constants/config'

function Analyze() {
  const [frame, setFrame] = useState(0)
  const [pauseAnimation, setPauseAnimation] = useState(false)
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function animate() {
    if (pauseAnimation) return;
    setFrame((prev) => ((prev + 1) % predictions.length))
  }
  
  const countFramesPerSecond = useMemo(() => (1000*(predictions.length - 1))/(predictions[predictions.length - 1].time - predictions[0].time), [predictions])
  useEffect(() => {
    const animation = setInterval(animate, 1000 / countFramesPerSecond);
    return () => clearInterval(animation);
  }, [animate, countFramesPerSecond])
  
  return (
    <Layout scroll>
      <Container ref={canvaContainer} onClick={()=>setPauseAnimation(false)}>
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
      <Slider
            barStyle={{ borderRadius: 0, zIndex: 99999 }}
            value={frame}
        onChange={(value) => { setFrame(value - 1);  setPauseAnimation(true)}}
            min={1}
            max={predictions.length}
            barColor={"#e1dada"}
            shouldDisplayValue={false}
          />
      <h1>Analyze</h1>
      <div>{ JSON.stringify(predictions) }</div>
      
    </Layout>
  );
}

export default Analyze;

const Container = styled.div`
  background-color: #1a1919;
  text-align: center;
  z-index: ${(props) => props.zIndex || 1};
  width: 100%;
  min-width:100% ;
  height: 60vh !important;
`;