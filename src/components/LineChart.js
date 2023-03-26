import { AreaChart, Tooltip, Area, ResponsiveContainer } from "recharts";
const colors = ["#45DAFA", "#45DAFA", "#FC2947", "#FE6244", "#FFDEB9"];

const LineChartComponent = ({ data, dataKeys, small, color }) => (
  <ResponsiveContainer width={"100%"} height={small ? 100 : 300}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Tooltip />
      {dataKeys.map((d, k) => (
          <Area type="monotone" dataKey={d} stroke={color || colors[k + 1]} fill={color || colors[k + 1]} strokeWidth="1" key={ k+'dd'} />
      ))}
    </AreaChart>
  </ResponsiveContainer>
);

export default LineChartComponent;
