import { Stage, Layer, Line, Circle, Rect } from "react-konva";
import { LINE_COLOR, LINE_WIDTH, TENSION } from "constants/config";

const Skeleton = ({body, scale}) => {
    return (
        <Stage width={300} height={300}>
            <Layer draggable>
              <Rect x={0} y={0} width={300} height={300} fill="#07090A" />

              <Circle
                x={body?.nose.coords[0]}
                y={body?.nose.coords[1]}
                radius={4 * scale}
                fill="rgba(255,255,255,.8)"
              />
              <Circle
                x={body?.leftEye.coords[0]}
                y={body?.leftEye.coords[1]}
                radius={3 * scale}
                fill="rgba(255,255,255,.7)"
              />
              <Circle
                x={body?.rightEye.coords[0]}
                y={body?.rightEye.coords[1]}
                radius={3 * scale}
                fill="rgba(255,255,255,.7)"
              />

              <Circle
                x={body?.leftEar.coords[0]}
                y={body?.leftEar.coords[1]}
                radius={2 * scale}
                fill="rgba(255,255,255,.6)"
              />
              <Circle
                x={body?.rightEar.coords[0]}
                y={body?.rightEar.coords[1]}
                radius={2 * scale}
                fill="rgba(255,255,255,.6)"
              />
              <Line
                tension={0.1}
                points={[
                  ...body?.rightShoulder.coords,
                  ...body?.leftShoulder.coords,
                  ...body?.leftHip.coords,
                  ...body?.rightHip.coords,
                ]}
                fill="black"
                closed
              />

              <Line
                tension={TENSION}
                points={[
                  ...body?.rightWrist.coords,
                  ...body?.rightElbow.coords,
                  ...body?.rightShoulder.coords,
                  ...body?.leftShoulder.coords,
                  ...body?.leftElbow.coords,
                  ...body?.leftWrist.coords,
                ]}
                stroke={LINE_COLOR}
                strokeWidth={LINE_WIDTH}
              />

              <Line
                tension={TENSION}
                points={[
                  ...body?.rightShoulder.coords,
                  ...body?.rightHip.coords,
                  ...body?.rightKnee.coords,
                  ...body?.rightAnkle.coords,
                ]}
                stroke={LINE_COLOR}
                strokeWidth={LINE_WIDTH}
              />

              <Line
                tension={TENSION}
                points={[
                  ...body?.leftShoulder.coords,
                  ...body?.leftHip.coords,
                  ...body?.leftKnee.coords,
                  ...body?.leftAnkle.coords,
                ]}
                stroke={LINE_COLOR}
                strokeWidth={LINE_WIDTH}
              />

              <Line
                tension={TENSION}
                points={[...body?.leftHip.coords, ...body?.rightHip.coords]}
                stroke={LINE_COLOR}
                strokeWidth={LINE_WIDTH}
              />
            </Layer>
          </Stage>
    )
}

export default Skeleton