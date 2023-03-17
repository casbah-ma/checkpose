import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Stage, Layer, Line } from "react-konva";
import Slider from "react-smooth-range-input";
import Layout from "components/Layout";
import bodyMapper from "lib/bodyMap";
import { WebCamContainer } from "./Capture";
import {LINE_COLOR, LINE_WIDTH, MIN_SCORE, TENSION} from 'constants/config'

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
      <WebCamContainer>
        {Array.isArray(predictions?.[0]?.keypoints) && (
          <Stage
            width={"100%"}
            height={"60vh"}
          >
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
      </WebCamContainer>
    </Layout>
  );
}

export default Analyze;
