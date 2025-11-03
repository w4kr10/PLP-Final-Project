import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export default function SimpleBarChart({ data, title, dataKey, valueKey, color = '#3b82f6' }) {
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
  const scale = maxValue > 0 ? 100 / maxValue : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, idx) => {
            const height = (item[valueKey] || 0) * scale;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">{item[dataKey]}</span>
                  <span className="text-gray-600">{item[valueKey]}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${height}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
