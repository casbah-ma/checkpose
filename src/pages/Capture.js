import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import Spacer from "components/Spacer";
import { toast } from "react-hot-toast";
import styled from "styled-components";
import Slider from "rc-slider";
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
      toast.error(error);
    }
  };

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = useCallback(() => {
    if (vidUrl && window?.URL?.revokeObjectURL) {
      window.URL.revokeObjectURL(vidUrl);
    }

    reset();
    setPredictions([]);
    setPlaying(false);
    setPlayBackRate(1);
    setVidUrl(null);
    mediaRecorderRef.current = new MediaRecorder(webcamRef?.current?.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
    setCapturing(true);
    start();
  }, [
    webcamRef,
    setCapturing,
    mediaRecorderRef,
    handleDataAvailable,
    start,
    reset,
    vidUrl,
  ]);

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef?.current?.stop();
    pause();
    setCapturing(false);
    setPlaying(true);
  }, [mediaRecorderRef, setCapturing, pause]);


  useEffect(() => {
    tf.setBackend("webgl")
      .then(() => {
        loadMoveNet(setModel);
      })
      .catch(() => toast.error("WebGL Not supported"));
  }, []);

  useEffect(() => {
    toast("When you press [Start] for the first time, this app may freeze for few seconds.", {
      icon: "👏",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
      duration: 4300,
    });

  }, []);

  useEffect(() => {
    const animation = requestAnimationFrame(predictionFunction);
    return () => cancelAnimationFrame(animation);
    //const animation = setInterval(predictionFunction, 1000 / 20);
    //return () => clearInterval(animation);
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
      setVidUrl(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  useEffect(() => {
    if (time > 1 && predictions.length < 1) {
      toast.error(time < 5 ? "⚠️ NO POSE DETECTED" : "⚠️ STOPPING CAMERA")
    }
    if (time === 10 && predictions.length < 1) {
      handleStopCaptureClick()
    }
  },[time, predictions, handleStopCaptureClick])

 

  return (
    <Layout bgColor="black">
      
      <WebCamContainer invisible={!playing && !capturing}>
        <OverlayImage />
        <Webcam
          audio={false}
          ref={webcamRef}
          videoConstraints={videoConstraints}
        />
        {capturing && (
          <AnalyzeBtnContainer>
            {time < 1 ? "⚙️ Warming UP" : ` 🔴 ${time}s`}
          </AnalyzeBtnContainer>
        )}
      </WebCamContainer>
      
      {vidUrl && (
        <WebCamContainer>
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
            <>
              <Spacer />
              <label>Playback Speed</label>
              <Slider
                value={playbackRate * 1 === 1 ? 100 : playbackRate * 100}
                onChange={(value) => setPlayBackRate(value / 100)}
                min={10}
                max={100}
                defaultValue={100}
              />
            </>
          )}

          {predictions.length ? (
            <AnalyzeBtnContainer
              to="/analyze"
              state={{
                predictions: predictions.sort((a, b) => a.time - b.time),
                video: vidUrl,
              }}
            >
              📈 Results
            </AnalyzeBtnContainer>
          ) : null}
        </WebCamContainer>
      )}
    
      <ButtonContainer zIndex={99}>
        {capturing ? (
          <>
            <Button onClick={handleStopCaptureClick}>Stop</Button>
          </>
        ) : (
            <NewBtn onClick={handleStartCaptureClick}>Start</NewBtn>
        )}
      </ButtonContainer>
    </Layout>
  );
};

export default WebcamStreamCapture;

export const ButtonContainer = styled.div`
  position: fixed;
  bottom: 50px;
  right: 0;
  width: 100vw;
  text-align: center;
  z-index: ${(props) => props.zIndex || 1};
  background: ${(props) => props.background};
`;

const Button = styled.button`
  cursor: pointer;
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

export const NewBtn = styled(Button)`
  background-color: black;
  box-shadow: #ffc107 4px 4px 0 0;
  :hover {
    background-color: black;
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
  margin: 0 auto;
  width: 300px;
  height: 300px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  video {
    width: 300px;
    height: 300px;
  }
`;

const OverlayImage = styled.div`
   position: absolute;
  top: 0;
  left: 0;
  margin: 0 auto;
  width: 300px;
  height: 300px;
  background-image: url('/background.png');
  background-size:contain;
  background-position:center;
  background-repeat:no-repeat;
`

const VideoComponent = styled.video`
  z-index: 999999;
`;

export const AnalyzeBtnContainer = styled(Link)`
  position: absolute;
  background-color: white;
  left: 0;
  top: 0;
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
  z-index: 999;
  :hover {
    background-color: #fff;
  }
  :active {
    box-shadow: #422800 2px 2px 0 0;
    transform: translate(2px, 2px);
  }
  a {
    text-decoration: none;
    height: 100%;
  }
`;
