import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface MachineVertical {
  name: string;
  total: number;
  active: number;
  idle: number;
  maintenance: number;
}

interface MachineUsageGraphProps {
  data?: MachineVertical[];
}

const MachineUsageGraph: React.FC<MachineUsageGraphProps> = ({
  data = defaultMachineData,
}) => {
  const [viewType, setViewType] = React.useState<"bar" | "stacked">("bar");

  // Calculate the maximum value for scaling the bars
  const maxTotal = Math.max(...data.map((item) => item.total));

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Machine Usage by Vertical</CardTitle>
          <Tabs
            value={viewType}
            onValueChange={(value) => setViewType(value as "bar" | "stacked")}
            className="w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bar">Bar</TabsTrigger>
              <TabsTrigger value="stacked">Stacked</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-end mb-2 gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs">Idle</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">Maintenance</span>
          </div>
        </div>

        <div className="h-[300px] mt-4">
          {viewType === "bar" ? (
            <div className="flex items-end justify-between h-full gap-2">
              {data.map((vertical) => (
                <div
                  key={vertical.name}
                  className="flex flex-col items-center gap-1 w-full"
                >
                  <div className="flex flex-col items-center w-full h-[250px] justify-end gap-1">
                    <div
                      className="w-full max-w-[50px] bg-green-500 rounded-t"
                      style={{
                        height: `${(vertical.active / maxTotal) * 100 * 2}px`,
                      }}
                      title={`Active: ${vertical.active}`}
                    ></div>
                    <div
                      className="w-full max-w-[50px] bg-yellow-500 rounded-t"
                      style={{
                        height: `${(vertical.idle / maxTotal) * 100 * 2}px`,
                      }}
                      title={`Idle: ${vertical.idle}`}
                    ></div>
                    <div
                      className="w-full max-w-[50px] bg-blue-500 rounded-t"
                      style={{
                        height: `${(vertical.maintenance / maxTotal) * 100 * 2}px`,
                      }}
                      title={`Maintenance: ${vertical.maintenance}`}
                    ></div>
                  </div>
                  <div className="text-xs font-medium mt-1">
                    {vertical.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {vertical.total} units
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-end justify-between h-full gap-2">
              {data.map((vertical) => (
                <div
                  key={vertical.name}
                  className="flex flex-col items-center gap-1 w-full"
                >
                  <div className="flex flex-col items-center w-full h-[250px] justify-end">
                    <div
                      className="w-full max-w-[50px] bg-green-500"
                      style={{
                        height: `${(vertical.active / vertical.total) * 100 * 2}px`,
                      }}
                      title={`Active: ${vertical.active}`}
                    ></div>
                    <div
                      className="w-full max-w-[50px] bg-yellow-500"
                      style={{
                        height: `${(vertical.idle / vertical.total) * 100 * 2}px`,
                      }}
                      title={`Idle: ${vertical.idle}`}
                    ></div>
                    <div
                      className="w-full max-w-[50px] bg-blue-500 rounded-b"
                      style={{
                        height: `${(vertical.maintenance / vertical.total) * 100 * 2}px`,
                      }}
                      title={`Maintenance: ${vertical.maintenance}`}
                    ></div>
                  </div>
                  <div className="text-xs font-medium mt-1">
                    {vertical.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {vertical.total} units
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Mock data for machine verticals
const defaultMachineData: MachineVertical[] = [
  {
    name: "Excavators",
    total: 120,
    active: 85,
    idle: 20,
    maintenance: 15,
  },
  {
    name: "Bulldozers",
    total: 95,
    active: 60,
    idle: 25,
    maintenance: 10,
  },
  {
    name: "Cranes",
    total: 75,
    active: 45,
    idle: 15,
    maintenance: 15,
  },
  {
    name: "Loaders",
    total: 110,
    active: 70,
    idle: 30,
    maintenance: 10,
  },
  {
    name: "Trucks",
    total: 150,
    active: 100,
    idle: 35,
    maintenance: 15,
  },
  {
    name: "Rigs",
    total: 65,
    active: 40,
    idle: 15,
    maintenance: 10,
  },
  {
    name: "Forklifts",
    total: 85,
    active: 55,
    idle: 20,
    maintenance: 10,
  },
  {
    name: "Graders",
    total: 50,
    active: 30,
    idle: 10,
    maintenance: 10,
  },
];

export default MachineUsageGraph;
