import React, { useState } from "react";
import { MapPin, ZoomIn, ZoomOut, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkOrderCluster {
  id: string;
  latitude: number;
  longitude: number;
  status: "active" | "delayed" | "breakdown" | "completed";
  count: number;
  machines: number;
  operators: number;
}

interface WorkOrder {
  id: string;
  title: string;
  customer: string;
  status: "active" | "delayed" | "breakdown" | "completed";
  machines: number;
  operators: number;
  startTime: string;
  endTime: string;
}

interface InteractiveMapProps {
  clusters?: WorkOrderCluster[];
  onClusterClick?: (clusterId: string) => void;
  onWorkOrderClick?: (workOrderId: string) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  clusters = defaultClusters,
  onClusterClick = () => {},
  onWorkOrderClick = () => {},
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [selectedCluster, setSelectedCluster] =
    useState<WorkOrderCluster | null>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(
    null,
  );
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const handleZoomIn = () => {
    if (zoom < 2) setZoom(zoom + 0.2);
  };

  const handleZoomOut = () => {
    if (zoom > 0.6) setZoom(zoom - 0.2);
  };

  const handleClusterClick = (cluster: WorkOrderCluster) => {
    setSelectedCluster(cluster);
    onClusterClick(cluster.id);
  };

  const handleWorkOrderClick = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    onWorkOrderClick(workOrder.id);
  };

  const filteredClusters = filterStatus
    ? clusters.filter((cluster) => cluster.status === filterStatus)
    : clusters;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "delayed":
        return "bg-yellow-500";
      case "breakdown":
        return "bg-red-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "delayed":
        return <Badge className="bg-yellow-500">Delayed</Badge>;
      case "breakdown":
        return <Badge className="bg-red-500">Breakdown</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full h-[400px] bg-white overflow-hidden">
      <CardContent className="p-0 relative h-full">
        {/* Map Background */}
        <div className="absolute inset-0 bg-slate-100 overflow-hidden">
          {/* Map Grid Lines */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
              backgroundSize: `${50 * zoom}px ${50 * zoom}px`,
              transform: `scale(${zoom})`,
              transformOrigin: "center",
            }}
          ></div>

          {/* Map Clusters */}
          <div
            className="absolute inset-0 transform-gpu"
            style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
          >
            {filteredClusters.map((cluster) => (
              <motion.div
                key={cluster.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${cluster.longitude}%`,
                  top: `${cluster.latitude}%`,
                  transform: "translate(-50%, -50%)",
                }}
                whileHover={{ scale: 1.2 }}
                onClick={() => handleClusterClick(cluster)}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`rounded-full ${getStatusColor(cluster.status)} flex items-center justify-center text-white font-bold`}
                        style={{
                          width: `${Math.max(30, cluster.count * 5)}px`,
                          height: `${Math.max(30, cluster.count * 5)}px`,
                        }}
                      >
                        {cluster.count}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="p-2">
                        <p className="font-bold">Cluster {cluster.id}</p>
                        <p>Work Orders: {cluster.count}</p>
                        <p>Machines: {cluster.machines}</p>
                        <p>Operators: {cluster.operators}</p>
                        <p>Status: {cluster.status}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("delayed")}>
                Delayed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("breakdown")}>
                Breakdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md z-10">
          <div className="flex flex-col gap-1">
            <div className="text-xs font-bold mb-1">Status Legend</div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs">Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs">Delayed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs">Breakdown</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs">Completed</span>
            </div>
          </div>
        </div>

        {/* Selected Cluster Details */}
        {selectedCluster && (
          <Card className="absolute bottom-4 right-4 w-64 z-10 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold">Cluster {selectedCluster.id}</h3>
                {getStatusBadge(selectedCluster.status)}
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm">Work Orders: {selectedCluster.count}</p>
                <p className="text-sm">Machines: {selectedCluster.machines}</p>
                <p className="text-sm">
                  Operators: {selectedCluster.operators}
                </p>
              </div>
              <div className="mt-3">
                <h4 className="text-xs font-semibold mb-1">Work Orders</h4>
                {mockWorkOrders
                  .filter((wo) => wo.status === selectedCluster.status)
                  .slice(0, 3)
                  .map((workOrder) => (
                    <div
                      key={workOrder.id}
                      className="text-xs p-1 hover:bg-slate-100 rounded cursor-pointer"
                      onClick={() => handleWorkOrderClick(workOrder)}
                    >
                      {workOrder.id}: {workOrder.title}
                    </div>
                  ))}
                <Button
                  variant="link"
                  size="sm"
                  className="mt-1 h-auto p-0 text-xs"
                >
                  View all {selectedCluster.count} work orders
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Work Order Details */}
        {selectedWorkOrder && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <Card className="w-96 max-w-[90%]">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold">{selectedWorkOrder.title}</h3>
                  <div className="flex gap-2">
                    {getStatusBadge(selectedWorkOrder.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedWorkOrder(null)}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">ID:</span>{" "}
                    {selectedWorkOrder.id}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Customer:</span>{" "}
                    {selectedWorkOrder.customer}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Machines:</span>{" "}
                    {selectedWorkOrder.machines}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Operators:</span>{" "}
                    {selectedWorkOrder.operators}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Start Time:</span>{" "}
                    {selectedWorkOrder.startTime}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">End Time:</span>{" "}
                    {selectedWorkOrder.endTime}
                  </p>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedWorkOrder(null)}
                  >
                    Close
                  </Button>
                  <Button size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Mock data for default props
const defaultClusters: WorkOrderCluster[] = [
  {
    id: "C1",
    latitude: 20,
    longitude: 30,
    status: "active",
    count: 12,
    machines: 18,
    operators: 24,
  },
  {
    id: "C2",
    latitude: 35,
    longitude: 50,
    status: "delayed",
    count: 8,
    machines: 12,
    operators: 16,
  },
  {
    id: "C3",
    latitude: 60,
    longitude: 25,
    status: "breakdown",
    count: 5,
    machines: 7,
    operators: 10,
  },
  {
    id: "C4",
    latitude: 75,
    longitude: 70,
    status: "completed",
    count: 15,
    machines: 22,
    operators: 30,
  },
  {
    id: "C5",
    latitude: 40,
    longitude: 80,
    status: "active",
    count: 10,
    machines: 15,
    operators: 20,
  },
  {
    id: "C6",
    latitude: 65,
    longitude: 60,
    status: "delayed",
    count: 6,
    machines: 9,
    operators: 12,
  },
  {
    id: "C7",
    latitude: 25,
    longitude: 15,
    status: "breakdown",
    count: 3,
    machines: 5,
    operators: 7,
  },
  {
    id: "C8",
    latitude: 50,
    longitude: 40,
    status: "active",
    count: 9,
    machines: 14,
    operators: 18,
  },
];

const mockWorkOrders: WorkOrder[] = [
  {
    id: "WO-1001",
    title: "Site Excavation - Downtown",
    customer: "ABC Construction",
    status: "active",
    machines: 5,
    operators: 8,
    startTime: "2023-06-15 08:00",
    endTime: "2023-06-22 17:00",
  },
  {
    id: "WO-1002",
    title: "Highway Expansion Project",
    customer: "State DOT",
    status: "active",
    machines: 7,
    operators: 12,
    startTime: "2023-06-10 07:00",
    endTime: "2023-07-15 18:00",
  },
  {
    id: "WO-1003",
    title: "Commercial Building Foundation",
    customer: "XYZ Developers",
    status: "delayed",
    machines: 4,
    operators: 6,
    startTime: "2023-06-05 08:00",
    endTime: "2023-06-12 17:00",
  },
  {
    id: "WO-1004",
    title: "Bridge Repair Project",
    customer: "County Engineering",
    status: "delayed",
    machines: 3,
    operators: 5,
    startTime: "2023-06-08 07:30",
    endTime: "2023-06-18 16:30",
  },
  {
    id: "WO-1005",
    title: "Shopping Mall Expansion",
    customer: "Retail Properties Inc",
    status: "breakdown",
    machines: 6,
    operators: 10,
    startTime: "2023-06-01 08:00",
    endTime: "2023-06-30 17:00",
  },
  {
    id: "WO-1006",
    title: "Residential Complex Grading",
    customer: "Homes & Gardens LLC",
    status: "completed",
    machines: 4,
    operators: 7,
    startTime: "2023-05-20 08:00",
    endTime: "2023-06-05 17:00",
  },
  {
    id: "WO-1007",
    title: "Airport Runway Extension",
    customer: "Metro Airport Authority",
    status: "active",
    machines: 8,
    operators: 14,
    startTime: "2023-06-12 06:00",
    endTime: "2023-07-20 20:00",
  },
  {
    id: "WO-1008",
    title: "Solar Farm Site Preparation",
    customer: "Green Energy Co",
    status: "breakdown",
    machines: 5,
    operators: 8,
    startTime: "2023-06-07 07:00",
    endTime: "2023-06-28 18:00",
  },
];

export default InteractiveMap;
