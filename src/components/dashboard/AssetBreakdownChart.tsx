"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AssetBreakdownChartProps {
  data: {
    name: string;
    value: number;
  }[];
  title: string;
  description?: string;
}

const COLORS = ["#1EB53A", "#0072C6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

const formatValue = (value: number) => {
  if (value >= 1e9) {
    return `Le ${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `Le ${(value / 1e6).toFixed(1)}M`;
  }
  return `Le ${value.toLocaleString()}`;
};

export function AssetBreakdownChart({
  data,
  title,
  description,
}: AssetBreakdownChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={{ stroke: "hsl(var(--muted-foreground))" }}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatValue(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{formatValue(total)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
