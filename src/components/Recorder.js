import React from "react";
import styled from "styled-components";
import Webcam from "react-webcam";
import videoConstraints from "constants/videoConstraints";

const WebcamStreamCapture = () => {
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  //console.log(mediaRecorderRef?.current)

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  return (
    <>
      <WebCamContainer>
        <Webcam audio={false} ref={webcamRef} mirrored />
      </WebCamContainer>

      <ButtonContainer zIndex={1}>
        {capturing ? (
          <button onClick={handleStopCaptureClick}>Stop Capture</button>
        ) : (
          <button onClick={handleStartCaptureClick}>Start Capture</button>
        )}
        {recordedChunks.length > 0 && (
          <button onClick={handleDownload}>Download</button>
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
