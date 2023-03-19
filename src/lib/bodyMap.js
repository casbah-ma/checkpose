/* The map from joint index to joint:
* 0 : neck; 1 & 2 : eyes; 3 & 4 : ears
* 5 & 6 : shoulders; 7 & 8 : elbows; 9 & 10 : hands
* 11 & 12 : hips; 13 & 14 : knees;
* 15 & 16 : feet
*/
import { MIN_SCORE } from "constants/config";

export default function bodyMap(keypoints) {
    if(!Array.isArray(keypoints)) return
    const nose = toArray(keypoints.find((k) => k.name === "nose"));
    const leftShoulder = toArray(keypoints.find((k) => k.name === "left_shoulder"));
    const rightShoulder = toArray(keypoints.find((k) => k.name === "right_shoulder"));
    const leftElbow = toArray(keypoints.find((k) => k.name === "left_elbow"));
    const rightElbow = toArray(keypoints.find((k) => k.name === "right_elbow"));
    const leftWrist = toArray(keypoints.find((k) => k.name === "left_wrist"));
    const rightWrist = toArray(keypoints.find((k) => k.name === "right_wrist"));
    const leftHip = toArray(keypoints.find((k) => k.name === "left_hip"));
    const rightHip = toArray(keypoints.find((k) => k.name === "right_hip"));
    const leftKnee = toArray(keypoints.find((k) => k.name === "left_knee"));
    const rightKnee = toArray(keypoints.find((k) => k.name === "right_knee"));
    const leftAnkle = toArray(keypoints.find((k) => k.name === "left_ankle"));
    const rightAnkle = toArray(keypoints.find((k) => k.name === "right_ankle"));

    return {
        nose,
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
        leftWrist,
        rightWrist,
    };
}

function toArray({ x, y, score }) {
    return {
        coords: [x, y],
        score
    }
}