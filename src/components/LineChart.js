import { AreaChart,Tooltip, Area, ResponsiveContainer } from "recharts";
const colors = ["#8884d8", "#8957E5", "#FC2947", "#FE6244", "#FFDEB9"];

const LineChartComponent = ({ data, dataKeys }) => (
  <ResponsiveContainer width={"100%"} height={500}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Tooltip />
      {dataKeys.map((d, k) => (
        <Area type="monotone" dataKey={d} stroke={colors[k+1]} fill={colors[k+1]} strokeWidth="5" />
      ))}
    </AreaChart>
  </ResponsiveContainer>
);

export default LineChartComponent;
