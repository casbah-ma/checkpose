import React, { useRef, useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { Stage, Layer, Line, Circle } from "react-konva";
import Slider from "react-smooth-range-input";
import Layout from "components/Layout";
import bodyMapper from "lib/bodyMap";
import { AnalyzeBtnContainer } from "./Capture";
import { LINE_COLOR, LINE_WIDTH, TENSION } from "constants/config";
const tool = "pen";

function Analyze(props) {
  const navigate = useNavigate();
  const [frame, setFrame] = useState(0);
  const [scale, setScale] = useState(1.5)
  const [lines, setLines] = React.useState([]);
  const isDrawing = React.useRef(false);
  const [pauseAnimation, setPauseAnimation] = useState(false);
  const location = useLocation();
  const canvaContainer = useRef(null);
  const predictions = location.state.predictions || props.predictions;
  const { video } = location.state;

  const bmap = useMemo(
    () => bodyMapper(predictions?.[frame]?.keypoints, scale),
    [frame, predictions, scale]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function animate() {
    if (pauseAnimation || !predictions) return;
    setFrame((prev) => (prev + 1) % predictions?.length);
  }

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const countFramesPerSecond = useMemo(
    () =>
      (1000 * predictions?.length) /
      (predictions[predictions?.length - 1].time - predictions[0].time),
    [predictions]
  );

  useEffect(() => {
    const animation = setInterval(animate, 1000 / countFramesPerSecond);
    return () => clearInterval(animation);
  }, [animate, countFramesPerSecond]);

  return (
    <Layout scroll>

      
      <ControlsContainer top={"10px"} onClick={() => navigate(-1)}>
        ← New
      </ControlsContainer>
      <ControlsContainer
        top={"95px"}
        onClick={() => setPauseAnimation(!pauseAnimation)}
      >
        {pauseAnimation ? "Play" : "Pause"}
      </ControlsContainer>


      {lines.length ? (
        <ControlsContainer top={"150px"} onClick={() => setLines([])}>
          Erase
        </ControlsContainer>

      ) : null}

      <ControlsContainer
        top={"205px"}
        onClick={() => setScale(scale+.1 <=2 ? scale+.1 : 1)}
      >
       { scale+.1 <=2 ? '+' : '-' }
      </ControlsContainer>

      <Container ref={canvaContainer}>
      <VidContainer>
        <video src={video} autoPlay loop playsInline/>
      </VidContainer>
         
        {Array.isArray(predictions?.[frame]?.keypoints) && bmap && (
          <Stage
            width={300}
            height={300}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
     
  
          >
            <Layer draggable>
              <Circle
                x={bmap?.nose.coords[0]}
                y={bmap?.nose.coords[1]}
                radius={3*scale}
                fill="white" />
               <Circle
                x={bmap?.leftEye.coords[0]}
                y={bmap?.leftEye.coords[1]}
                radius={3*scale}
                fill="white"/>
                  <Circle
                x={bmap?.rightEye.coords[0]}
                y={bmap?.rightEye.coords[1]}
                radius={3*scale}
                fill="white" />
              
              <Circle
                x={bmap?.leftEar.coords[0]}
                y={bmap?.leftEar.coords[1]}
                radius={2*scale}
                fill="white"/>
                  <Circle
                x={bmap?.rightEar.coords[0]}
                y={bmap?.rightEar.coords[1]}
                radius={2*scale}
                fill="white" />
              <Line
                tension={0.1}
                points={[
                  ...bmap?.rightShoulder.coords,
                  ...bmap?.leftShoulder.coords,
                  ...bmap?.leftHip.coords,
                  ...bmap?.rightHip.coords,
                ]}
                fill="black"
                closed
              />

              <Line
                tension={TENSION}
                points={[
                  ...bmap?.rightWrist.coords,
                  ...bmap?.rightElbow.coords,
                  ...bmap?.rightShoulder.coords,
                  ...bmap?.leftShoulder.coords,
                  ...bmap?.leftElbow.coords,
                  ...bmap?.leftWrist.coords,
                ]}
                stroke={LINE_COLOR}
                strokeWidth={LINE_WIDTH}
              />

              <Line
                tension={TENSION}
                points={[
                  ...bmap?.rightShoulder.coords,
                  ...bmap?.rightHip.coords,
                  ...bmap?.rightKnee.coords,
                  ...bmap?.rightAnkle.coords,
                ]}
                stroke={LINE_COLOR}
                strokeWidth={LINE_WIDTH}
              />

              <Line
                tension={TENSION}
                points={[
                  ...bmap?.leftShoulder.coords,
                  ...bmap?.leftHip.coords,
                  ...bmap?.leftKnee.coords,
                  ...bmap?.leftAnkle.coords,
                ]}
                stroke={LINE_COLOR}
                strokeWidth={LINE_WIDTH}
              />

              <Line
                tension={TENSION}
                points={[...bmap?.leftHip.coords, ...bmap?.rightHip.coords]}
                stroke={LINE_COLOR}
                strokeWidth={LINE_WIDTH}
              />
            </Layer>
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke="#df4b26"
                  strokeWidth={5}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    line.tool === "eraser" ? "destination-out" : "source-over"
                  }
                />
              ))}
            </Layer>
          </Stage>
        )}
        
      </Container>
      <Slider
        barStyle={{ borderRadius: 0, zIndex: 99999 }}
        value={frame}
        onChange={(value) => {
          setFrame(value - 1);
          setPauseAnimation(true);
        }}
        min={1}
        shouldAnimateNumber
        max={predictions?.length}
        shouldDisplayValue={false}
      />

      <div>{JSON.stringify(bodyMapper(predictions?.[frame]?.keypoints))}</div>
    </Layout>
  );
}

export default Analyze;

const VidContainer = styled.div`
  position: absolute;
  border-radius:10px;
  top: 5px;
  right: 22px;
  width: 110px;
  height: 110px !important;
  z-index:999 ;
  background-color: #422800;

  border: 2px solid #422800;
  opacity:.3;
  z-index:0 ;
  :hover{
    opacity:1 ;
  }
  video {
    width: 110px;
    height: 110px !important;
    object-fit:cover ;
    border-radius:10px;
  }
 
`;



const Container = styled.div`
  background-color: #1a1919;
  text-align: center;
  z-index: ${(props) => props.zIndex || 1};
  width: auto;
  height: 300px;
`;

const ControlsContainer = styled(AnalyzeBtnContainer)`
  top: ${(props) => props.top || "125px"};
`;

