import * as poseDetection from "@tensorflow-models/pose-detection";
  
const detectorConfig = {
  runtime: 'tfjs', // or 'tfjs'
  modelType: 'SinglePose.Thunder', // SinglePose.Lightning,SinglePose.Thunder,MultiPose.Lightning
  modelUrl: 'https://storage.googleapis.com/tfhub-tfjs-modules/google/tfjs-model/movenet/singlepose/thunder/4/model.json'
};

export default async function loadMoveNet(cb) {
    try {
      const MoveNet = poseDetection.SupportedModels.MoveNet;
      const detector = await poseDetection.createDetector(MoveNet, detectorConfig);
      cb(detector);
    } catch (error) {console.error(error)}
  }
  
  