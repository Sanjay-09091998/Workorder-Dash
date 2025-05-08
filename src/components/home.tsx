import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Activity, AlertTriangle, BarChart3, Clock, Users } from "lucide-react";
import InteractiveMap from "./dashboard/InteractiveMap";
import EquipmentTable from "./dashboard/EquipmentTable";
import EmployeeGrid from "./dashboard/EmployeeGrid";
import NotificationPanel from "./dashboard/NotificationPanel";
import MachineUsageGraph from "./dashboard/MachineUsageGraph";

const Home = () => {
  // Mock data for key performance metrics
  const metrics = {
    workOrders: {
      active: 124,
      completed: 89,
      pending: 37,
      total: 250,
    },
    machines: {
      deployed: 342,
      idle: 98,
      maintenance: 110,
      total: 550,
    },
    operators: {
      active: 1250,
      idle: 320,
      overtime: 230,
      total: 1800,
    },
    alerts: {
      critical: 12,
      warnings: 28,
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header with key performance metrics */}
      <header className="sticky top-0 z-10 w-full bg-background border-b p-4">
        <div className="container mx-auto">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                Executive Operational Dashboard
              </h1>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-sm">
                  <Clock className="h-3 w-3 mr-1" /> Live Data
                </Badge>
                <Badge variant="destructive" className="text-sm">
                  <AlertTriangle className="h-3 w-3 mr-1" />{" "}
                  {metrics.alerts.critical} Critical Alerts
                </Badge>
              </div>
            </div>

            {/* Key metrics row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Work Orders</p>
                    <p className="text-2xl font-bold">
                      {metrics.workOrders.total}
                    </p>
                    <div className="flex items-center space-x-2 text-xs">
                      <Badge variant="secondary">
                        {metrics.workOrders.active} Active
                      </Badge>
                      <Badge variant="outline">
                        {metrics.workOrders.pending} Pending
                      </Badge>
                    </div>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary opacity-80" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Machines</p>
                    <p className="text-2xl font-bold">
                      {metrics.machines.total}
                    </p>
                    <div className="flex items-center space-x-2 text-xs">
                      <Badge variant="secondary">
                        {metrics.machines.deployed} Deployed
                      </Badge>
                      <Badge variant="outline">
                        {metrics.machines.idle} Idle
                      </Badge>
                    </div>
                  </div>
                  <Activity className="h-8 w-8 text-primary opacity-80" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Operators</p>
                    <p className="text-2xl font-bold">
                      {metrics.operators.total}
                    </p>
                    <div className="flex items-center space-x-2 text-xs">
                      <Badge variant="secondary">
                        {metrics.operators.active} Active
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      >
                        {metrics.operators.overtime} Overtime
                      </Badge>
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-primary opacity-80" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Alerts</p>
                    <p className="text-2xl font-bold">
                      {metrics.alerts.critical + metrics.alerts.warnings}
                    </p>
                    <div className="flex items-center space-x-2 text-xs">
                      <Badge variant="destructive">
                        {metrics.alerts.critical} Critical
                      </Badge>
                      <Badge variant="outline">
                        {metrics.alerts.warnings} Warnings
                      </Badge>
                    </div>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive opacity-80" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left column - Map and Tables */}
          <div className="flex-1 space-y-4">
            {/* Interactive Map */}
            <Card>
              <CardHeader>
                <CardTitle>Work Order Map View</CardTitle>
              </CardHeader>
              <CardContent>
                <InteractiveMap />
              </CardContent>
            </Card>

            {/* Machine Usage Graph */}
            <MachineUsageGraph />

            {/* Tabs for Equipment and Employee data */}
            <Tabs defaultValue="equipment" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="equipment">
                  Equipment Utilization
                </TabsTrigger>
                <TabsTrigger value="employees">
                  Employee Performance
                </TabsTrigger>
              </TabsList>
              <TabsContent value="equipment" className="mt-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Equipment Utilization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EquipmentTable />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="employees" className="mt-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Employee Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmployeeGrid />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Notifications */}
          <div className="w-full lg:w-[350px]">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Real-Time Notifications</CardTitle>
                <Separator />
              </CardHeader>
              <CardContent>
                <NotificationPanel />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
