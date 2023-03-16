import React, { useState, useCallback, useRef, useEffect } from "react";
import styled from "styled-components";
import Webcam from "react-webcam";
import { useTimer } from "use-timer";
import Slider from "react-smooth-range-input";
//import videoConstraints from "constants/videoConstraints";

const WebcamStreamCapture = () => {
  const { time, start, pause, reset } = useTimer();
  const webcamRef = useRef(null);
  const playerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [playbackRate, setPlayBackRate] = useState(1);

  useEffect(() => {
    if (playerRef?.current?.playbackRate) {
      playerRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    setPlaying(true);
    setPlayBackRate(1);
    reset();
    start();
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
  ]);

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef?.current?.stop();
    pause();
    setCapturing(false);
    setPlaying(false);
  }, [mediaRecorderRef, setCapturing, pause]);

  useEffect(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });

      const url = URL.createObjectURL(blob);
      const video = document.getElementById("video");
      video.src = url;
      video.style.display = "block";

      //document.body.appendChild(a);
      //a.style = "display: none";
      //a.href = url;
      //a.download = "react-webcam-stream-capture.webm";
      //a.click();
      //window.URL.revokeObjectURL(url);

      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  console.log(playbackRate)

  return (
    <>
      <WebCamContainer invisible={!playing}>
        <Webcam audio={false} ref={webcamRef} />
      </WebCamContainer>

      <WebCamContainer invisible={capturing}>
        <VideoComponent id="video" autoPlay playsinline loop ref={playerRef} controls />
        {
          !capturing &&  <Slider
          barStyle={{"borderRadius": 0}}
          value={playbackRate*1===1 ? 100 : playbackRate}
          onChange={(value) => setPlayBackRate(value / 100)}
          min={10}
          max={100}
          barColor={"#e1dada"}
          disabled={capturing || playing}
          shouldDisplayValue={false} 
        />
        }
       
       
      </WebCamContainer>

      <ButtonContainer zIndex={99}>
        {capturing ? (
          <>
            {" "}
            <Button onClick={handleStopCaptureClick}>{time}</Button>
          </>
        ) : (
          <Button onClick={handleStartCaptureClick}>New</Button>
        )}
      </ButtonContainer>
    </>
  );
};

export default WebcamStreamCapture;

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 65px;
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
`;

const WebCamContainer = styled(ButtonContainer)`
  display: ${(props) => (props.invisible ? "none" : "block")};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  video {
    width: 100%;
    object-fit: contain;
  }
`;

const VideoComponent = styled.video`
  z-index: 999999;
  display: none;
`;
