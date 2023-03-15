import React from "react";
import styled from "styled-components";
import Webcam from "react-webcam";
import videoConstraints from "constants/videoConstraints";

const WebcamStreamCapture = () => {
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
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
        type: "video/webm"
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
      <h1>COUCOUCOUCOUC</h1>
      <FixedContainer zIndex={-1}>

        <Webcam
          audio={false}
          ref={webcamRef}
          mirrored
        />
      </FixedContainer>
    
      {capturing ? (
        <button onClick={handleStopCaptureClick}>Stop Capture</button>
      ) : (
        <button onClick={handleStartCaptureClick}>Start Capture</button>
      )}
      {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
      )}
    </>
  );
};

export default WebcamStreamCapture;

const FixedContainer = styled.div`
  position: fixed;
  top:0;
  bottom:0;
  right: 0;
  width: ${videoConstraints.width + "px"};
  height: 100%;
  left: 50%;
  transform: translate(-50%, 0) scale(-1, 1);
  z-index: ${(props) => props.zIndex || 1};
  background: ${(props) => props.background};
  box-shadow: inset rgb(0 0 0 / 40%) 11px -12px 20px 20px;
`;

const SystemMsg = styled.div`
  position: fixed;
  transform: translate(-50%, 0);
  width: 100%;
  left: 50%;
  top: 100px;
  text-align: center;
  height: 200px;
  z-index: 90;
  color: white;
  font-size: 2.5em;
`;

const Mirrored = styled.div`
transform: scale(-1, 1);
`