"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RecoveryTrendChartProps {
  data: {
    period: string;
    recovered: number;
    treasury: number;
  }[];
}

const formatValue = (value: number) => {
  if (value >= 1e9) {
    return `Le ${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `Le ${(value / 1e6).toFixed(1)}M`;
  }
  return `Le ${value.toLocaleString()}`;
};

export function RecoveryTrendChart({ data }: RecoveryTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Recovery Trend</CardTitle>
        <CardDescription>
          Total assets recovered and funds transferred to Consolidated Revenue Fund
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="period"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 1e9) return `${(value / 1e9).toFixed(0)}B`;
                  if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`;
                  return value;
                }}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => formatValue(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="recovered"
                name="Total Recovered"
                stroke="#1EB53A"
                strokeWidth={2}
                dot={{ fill: "#1EB53A", strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="treasury"
                name="To CRF"
                stroke="#0072C6"
                strokeWidth={2}
                dot={{ fill: "#0072C6", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
