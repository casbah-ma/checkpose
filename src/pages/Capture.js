import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import React, { useState, useCallback, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Slider from "react-smooth-range-input";
import { useTimer } from "use-timer";
import loadMoveNet from "lib/loadMoveNet";
import Layout from "components/Layout";
import videoConstraints from "constants/videoConstraints";

const WebcamStreamCapture = () => {
  const { time, start, pause, reset } = useTimer();
  const [capturing, setCapturing] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [playbackRate, setPlayBackRate] = useState(1);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [vidUrl, setVidUrl] = useState(null);
  const webcamRef = useRef(null);
  const playerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const predictionFunction = async () => {
    if (!model || !webcamRef?.current?.video || !capturing) return;
    try {
      const videoPredictions = await model.estimatePoses(
        webcamRef.current.video
      );
      if (videoPredictions?.[0]?.keypoints) {
        setPredictions([
          ...predictions,
          { ...videoPredictions[0], time: Date.now() },
        ]);
      }
    } catch (error) {
      console.error("predictionFunction()\n\n", error);
    }
  };

  useEffect(() => {
    tf.setBackend("webgl")
      .then(() => {
        loadMoveNet(setModel);
      })
      .catch((e) => alert("WebGL Not supported"));
  }, []);

  useEffect(() => {
    //const animation = requestAnimationFrame(predictionFunction);
    //return () => cancelAnimationFrame(animation);

    // 5 frames per second approx
    const animation = setInterval(predictionFunction, 1000 / 5);
    return () => clearInterval(animation);
  }, [predictionFunction]);

  useEffect(() => {
    if (playerRef?.current?.playbackRate) {
      playerRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      setVidUrl(url)
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = useCallback(() => {
    reset();
    setPredictions([]);
    setCapturing(true);
    setPlaying(false);
    setPlayBackRate(1);
    setVidUrl(null)
    start();
    window.URL.revokeObjectURL(vidUrl);

    mediaRecorderRef.current = new MediaRecorder(webcamRef?.current?.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [
    webcamRef,
    setCapturing,
    mediaRecorderRef,
    handleDataAvailable,
    start,
    reset,
    vidUrl
  ]);

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef?.current?.stop();
    pause();
    setCapturing(false);
    setPlaying(true);
  }, [mediaRecorderRef, setCapturing, pause]);

  return (
    <Layout>
      <WebCamContainer invisible={!playing && !capturing}>
        <Webcam
          audio={false}
          ref={webcamRef}
          videoConstraints={videoConstraints}
        />
        {capturing && (
          <AnalyzeBtnContainer>
            {time < 1 ? "⚙️ Warming UP" : ` 🔴 ${time}s`}
            {time > 1 && predictions.length<1 && "  ⚠️ Poses Not detected"}
          </AnalyzeBtnContainer>
        )}
      </WebCamContainer>
      {
        vidUrl && <WebCamContainer>
        
          <VideoComponent
          id="video"
          autoPlay
          playsinline
          loop
          ref={playerRef}
          controls
          src={vidUrl}
          
        />
        
     
        {playing && (
          <Slider
            barStyle={{ borderRadius: 0, zIndex: 99999 }}
            value={playbackRate * 1 === 1 ? 100 : playbackRate}
            onChange={(value) => setPlayBackRate(value / 100)}
            min={10}
            max={100}
            barColor={"#e1dada"}
            shouldDisplayValue={false}
          />
        )}

        {predictions.length ? (
          <AnalyzeBtnContainer>
            <Link to="/analyze" state={predictions.sort((a, b) => a.time - b.time)}>
              📈 Results
            </Link>
          </AnalyzeBtnContainer>
        ) : null}
      </WebCamContainer>
      }
      <ButtonContainer zIndex={99}>
        {capturing ? (
          <>
            <Button onClick={handleStopCaptureClick}>Stop</Button>
          </>
        ) : (
          <Button onClick={handleStartCaptureClick}>New</Button>
        )}
      </ButtonContainer>
    </Layout>
  );
};

export default WebcamStreamCapture;

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 50px;
  right: 0;
  width: 100vw;
  text-align: center;
  z-index: ${(props) => props.zIndex || 1};
  background: ${(props) => props.background};
`;

const Button = styled.button`
  width: 110px;
  height: ${(props) => (props.bg ? "auto" : "110px")};
  border-radius: 50%;
  background-color: ${(props) => props.bg || "#FC4847"};
  font-size: 25px;
  font-weight: 800;
  color: ${(props) => (props.bg ? "black" : "white")};
  text-align: center;
  box-shadow: #422800 4px 4px 0 0;
  :hover {
    background-color: #ff3433;
  }
  :active {
    box-shadow: #422800 2px 2px 0 0;
    transform: translate(2px, 2px);
  }
`;

export const WebCamContainer = styled(ButtonContainer)`
  display: ${(props) => (props.invisible ? "none" : "block")};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60vh !important;
  video {
    width: 100%;
    height: 60vh !important;
    object-fit: cover;
  }
`;

const VideoComponent = styled.video`
  z-index: 999999;
`;

export const AnalyzeBtnContainer = styled.div`
  position: absolute;
  background-color: white;
  left: 10px;
  top: 10px;
  padding: 10px;
  background-color: #fbeee0;
  border: 2px solid #422800;
  border-radius: 30px;
  box-shadow: #422800 4px 4px 0 0;
  color: #422800;
  cursor: pointer;
  display: inline-block;
  font-weight: 600;
  font-size: 18px;
  padding: 0 18px;
  line-height: 50px;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  z-index:999 ;
  :hover {
    background-color: #fff;
  }
  :active {
    box-shadow: #422800 2px 2px 0 0;
    transform: translate(2px, 2px);
  }
  a {
    text-decoration: none;
  }
`;