"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SectoralChartProps {
  data: {
    sector: string;
    amount: number;
    cases?: number;
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

export function SectoralChart({ data }: SectoralChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recovery by Sector</CardTitle>
        <CardDescription>
          Distribution of recovered assets across government sectors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                type="number"
                tickFormatter={(value) => {
                  if (value >= 1e9) return `${(value / 1e9).toFixed(0)}B`;
                  if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`;
                  return value;
                }}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="sector"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                width={90}
              />
              <Tooltip
                formatter={(value: number) => formatValue(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="amount"
                name="Amount Recovered"
                fill="#1EB53A"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
