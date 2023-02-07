
import * as poseDetection from "@tensorflow-models/pose-detection";

export default async function loadMoveNet(cb) {
    try {
      const MoveNet = poseDetection.SupportedModels.MoveNet;
      const detector = await poseDetection.createDetector(MoveNet);
      cb(detector);
    } catch (error) {console.error(error)}
  }
  
  