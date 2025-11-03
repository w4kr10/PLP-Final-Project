import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export default function SimpleLineChart({ data, title, dataKey, valueKey, color = '#10b981' }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">No data available</div>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(item => item[valueKey] || 0));
  const minValue = Math.min(...data.map(item => item[valueKey] || 0));
  const range = maxValue - minValue;
  const height = 200;
  const width = 100;

  const points = data.map((item, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = range > 0 ? height - (((item[valueKey] - minValue) / range) * height) : height / 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ height: `${height + 60}px` }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full"
            style={{ height: `${height}px` }}
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((percent) => {
              const y = (percent / 100) * height;
              return (
                <line
                  key={percent}
                  x1="0"
                  y1={y}
                  x2={width}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                />
              );
            })}

            {/* Line */}
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Area fill */}
            <polygon
              points={`0,${height} ${points} ${width},${height}`}
              fill={color}
              fillOpacity="0.1"
            />

            {/* Data points */}
            {data.map((item, idx) => {
              const x = (idx / (data.length - 1)) * width;
              const y = range > 0 ? height - (((item[valueKey] - minValue) / range) * height) : height / 2;
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r="3"
                  fill={color}
                  className="hover:r-5 transition-all"
                >
                  <title>{`${item[dataKey]}: ${item[valueKey]}`}</title>
                </circle>
              );
            })}
          </svg>

          {/* Labels */}
          <div className="flex justify-between mt-2">
            {data.map((item, idx) => (
              <div key={idx} className="text-xs text-gray-600 text-center" style={{ flex: 1 }}>
                <div>{item[dataKey]}</div>
                <div className="font-semibold" style={{ color }}>{item[valueKey]}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
