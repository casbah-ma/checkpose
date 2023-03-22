import { ResponsiveStream } from "@nivo/stream";

// make sure parent container have a defined height
/**
 * 
 Data example : [
  {
    genoux_droit,
        genoux_gauche,
        coude_droit,
        coude_gauche,
        dos
  }
]
*/
const StreamChart = ({
  data,
}) => (
  <ResponsiveStream
    data={data}
    margin={{ top: 50, right: 0, bottom: 550, left: 0 }}
    keys={["genoux_droit", "genoux_gauche", "coude_droit", "dos", "coude_gauche"]}
    axisTop={null}
    axisRight={null}
    enableGridX={true}
    enableGridY={false}
    offsetType="none"
    colors={{ scheme: "nivo" }}
    fillOpacity={0.85}
    borderColor={{ theme: "background" }}
    defs={[
      {
        id: "dots",
        type: "patternDots",
        background: "inherit",
        color: "#2c998f",
        size: 4,
        padding: 2,
        stagger: true,
      },
      {
        id: "squares",
        type: "patternSquares",
        background: "inherit",
        color: "#e4c912",
        size: 6,
        padding: 2,
        stagger: true,
      },
    ]}
    fill={[
      {
        match: {
          id: "coude_droit",
        },
        id: "dots",
      },
      {
        match: {
          id: "dos",
        },
        id: "squares",
      },
    ]}
    dotSize={8}
    dotColor={{ from: "color" }}
    dotBorderWidth={2}
    dotBorderColor={{
      from: "color",
      modifiers: [["darker", 0.7]],
    }}
    legends={[
      {
        anchor: "bottom-right",
        direction: "column",
        translateX: 0,
        itemBackground: "black",
        itemWidth: 80,
        itemHeight: 20,
        itemTextColor: "#999999",
        symbolSize: 12,
        symbolShape: "circle",
        effects: [
          {
            on: "hover",
            style: {
              itemTextColor: "#000000",
            },
          },
        ],
      },
    ]}
  />
);

export default StreamChart;
