import React, { useState, useCallback, useRef, useEffect } from "react";
import styled from "styled-components";
import Webcam from "react-webcam";
import videoConstraints from "constants/videoConstraints";

const WebcamStreamCapture = () => {
  const webcamRef = useRef(null);
  const playerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  
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
    mediaRecorderRef.current = new MediaRecorder(webcamRef?.current?.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef?.current?.stop();
    setCapturing(false);

  }, [mediaRecorderRef, setCapturing]);

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
  },[recordedChunks])

  return (
    <>
      <WebCamContainer invisible={ !capturing }>
        <Webcam audio={false} ref={webcamRef} />
      </WebCamContainer>

      <WebCamContainer invisible={ capturing }>
        <VideoComponent id="video" autoPlay playsinline loop controls ref={playerRef}/>
      </WebCamContainer>

      <ButtonContainer zIndex={99}>
        {capturing ? (
          <button onClick={handleStopCaptureClick}>Stop Capture</button>
        ) : (
          <button onClick={handleStartCaptureClick}>Start Capture</button>
        )}
      </ButtonContainer>
    </>
  );
};

export default WebcamStreamCapture;

const ButtonContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: ${videoConstraints.width + "px"};
  height: 100%;
  left: 50%;
  z-index: ${(props) => props.zIndex || 1};
  background: ${(props) => props.background};
`;

const WebCamContainer = styled(ButtonContainer)`
  display: ${props=>props.invisible ? "none" : "block"};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  video {
    width: 100vw !important;
    height: 100vh !important;
    object-fit: cover;
  }
`;

const VideoComponent = styled.video`
  z-index: 999999;
  display: none;
`;
