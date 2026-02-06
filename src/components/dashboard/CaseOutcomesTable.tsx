import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CaseOutcome {
  period: string;
  prosecutions: number;
  convictions: number;
  acquittals: number;
  pending?: number;
}

interface CaseOutcomesTableProps {
  data: CaseOutcome[];
}

export function CaseOutcomesTable({ data }: CaseOutcomesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prosecution Outcomes</CardTitle>
        <CardDescription>
          Summary of prosecution cases and their outcomes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Prosecutions</TableHead>
              <TableHead className="text-right">Convictions</TableHead>
              <TableHead className="text-right">Acquittals</TableHead>
              <TableHead>Conviction Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => {
              const convictionRate = row.prosecutions > 0
                ? Math.round((row.convictions / row.prosecutions) * 100)
                : 0;

              return (
                <TableRow key={row.period}>
                  <TableCell className="font-medium">{row.period}</TableCell>
                  <TableCell className="text-right">{row.prosecutions}</TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    {row.convictions}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    {row.acquittals}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={convictionRate} className="h-2 w-20" />
                      <span className="text-sm font-medium">{convictionRate}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
