/* The map from joint index to joint:
* 0 : neck; 1 & 2 : eyes; 3 & 4 : ears
* 5 & 6 : shoulders; 7 & 8 : elbows; 9 & 10 : hands
* 11 & 12 : hips; 13 & 14 : knees;
* 15 & 16 : feet
*/

export default function bodyMap(keypoints, scale=1) {
    if (!Array.isArray(keypoints)) return
    const nose = toArray(keypoints.find((k) => k.name === "nose"), scale);
    const leftShoulder = toArray(keypoints.find((k) => k.name === "left_shoulder"), scale);
    const leftEye = toArray(keypoints.find((k) => k.name === "left_eye"), scale);
    const rightEye = toArray(keypoints.find((k) => k.name === "right_eye"), scale);
    const leftEar = toArray(keypoints.find((k) => k.name === "left_ear"), scale);
    const rightEar = toArray(keypoints.find((k) => k.name === "right_ear"), scale);
    const rightShoulder = toArray(keypoints.find((k) => k.name === "right_shoulder"), scale);
    const leftElbow = toArray(keypoints.find((k) => k.name === "left_elbow"), scale);
    const rightElbow = toArray(keypoints.find((k) => k.name === "right_elbow"), scale);
    const leftWrist = toArray(keypoints.find((k) => k.name === "left_wrist"), scale);
    const rightWrist = toArray(keypoints.find((k) => k.name === "right_wrist"), scale);
    const leftHip = toArray(keypoints.find((k) => k.name === "left_hip"), scale);
    const rightHip = toArray(keypoints.find((k) => k.name === "right_hip"), scale);
    const leftKnee = toArray(keypoints.find((k) => k.name === "left_knee"), scale);
    const rightKnee = toArray(keypoints.find((k) => k.name === "right_knee"), scale);
    const leftAnkle = toArray(keypoints.find((k) => k.name === "left_ankle"), scale);
    const rightAnkle = toArray(keypoints.find((k) => k.name === "right_ankle"), scale);
 
    return {
        nose,
        leftEye,
        rightEye,
        leftEar,
        rightEar,
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

function toArray({ x, y, score }, scale) {
    return {
        coords: [x*scale, y*scale],
        score
    }
}