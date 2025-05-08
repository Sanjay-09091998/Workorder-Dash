import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface Equipment {
  id: string;
  type: string;
  location: string;
  operationalHours: number;
  idleHours: number;
  maintenanceStatus: "active" | "idle" | "breakdown" | "maintenance";
  lastMaintenance: string;
  assignedTo: string;
}

interface EquipmentTableProps {
  data?: Equipment[];
  onRowClick?: (equipment: Equipment) => void;
}

const EquipmentTable = ({
  data = defaultEquipment,
  onRowClick,
}: EquipmentTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Equipment;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Equipment) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const filteredData = React.useMemo(() => {
    return sortedData.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.maintenanceStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sortedData, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" /> Active
          </Badge>
        );
      case "idle":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="h-3 w-3 mr-1" /> Idle
          </Badge>
        );
      case "breakdown":
        return (
          <Badge className="bg-red-500">
            <AlertTriangle className="h-3 w-3 mr-1" /> Breakdown
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-blue-500">
            <span className="h-3 w-3 mr-1">🔧</span> Maintenance
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getRowClassName = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50";
      case "idle":
        return "bg-yellow-50";
      case "breakdown":
        return "bg-red-50";
      case "maintenance":
        return "bg-blue-50";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Equipment Utilization</CardTitle>
          <div className="text-sm text-muted-foreground">
            {filteredData.length} of {data.length} machines
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="breakdown">Breakdown</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("id")}
                    className="p-0 h-auto font-medium flex items-center"
                  >
                    ID <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("type")}
                    className="p-0 h-auto font-medium flex items-center"
                  >
                    Type <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("location")}
                    className="p-0 h-auto font-medium flex items-center"
                  >
                    Location <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("operationalHours")}
                    className="p-0 h-auto font-medium flex items-center justify-end w-full"
                  >
                    Op. Hours <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("idleHours")}
                    className="p-0 h-auto font-medium flex items-center justify-end w-full"
                  >
                    Idle Hours <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("maintenanceStatus")}
                    className="p-0 h-auto font-medium flex items-center"
                  >
                    Status <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Assigned To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((equipment) => (
                  <TableRow
                    key={equipment.id}
                    className={getRowClassName(equipment.maintenanceStatus)}
                    onClick={() => onRowClick && onRowClick(equipment)}
                    style={{ cursor: onRowClick ? "pointer" : "default" }}
                  >
                    <TableCell className="font-medium">
                      {equipment.id}
                    </TableCell>
                    <TableCell>{equipment.type}</TableCell>
                    <TableCell>{equipment.location}</TableCell>
                    <TableCell className="text-right">
                      {equipment.operationalHours}
                    </TableCell>
                    <TableCell className="text-right">
                      {equipment.idleHours}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(equipment.maintenanceStatus)}
                    </TableCell>
                    <TableCell>{equipment.assignedTo}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No equipment found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

// Sample data for demonstration
const defaultEquipment: Equipment[] = [
  {
    id: "EX-1001",
    type: "Excavator",
    location: "Site A",
    operationalHours: 120,
    idleHours: 8,
    maintenanceStatus: "active",
    lastMaintenance: "2023-05-15",
    assignedTo: "John Doe",
  },
  {
    id: "BL-2002",
    type: "Bulldozer",
    location: "Site B",
    operationalHours: 85,
    idleHours: 24,
    maintenanceStatus: "idle",
    lastMaintenance: "2023-06-02",
    assignedTo: "Unassigned",
  },
  {
    id: "CR-3003",
    type: "Crane",
    location: "Site C",
    operationalHours: 210,
    idleHours: 5,
    maintenanceStatus: "breakdown",
    lastMaintenance: "2023-04-20",
    assignedTo: "Sarah Johnson",
  },
  {
    id: "FT-4004",
    type: "Forklift",
    location: "Warehouse",
    operationalHours: 45,
    idleHours: 2,
    maintenanceStatus: "active",
    lastMaintenance: "2023-06-10",
    assignedTo: "Mike Smith",
  },
  {
    id: "TR-5005",
    type: "Truck",
    location: "Site A",
    operationalHours: 320,
    idleHours: 0,
    maintenanceStatus: "active",
    lastMaintenance: "2023-05-28",
    assignedTo: "Emma Wilson",
  },
  {
    id: "LD-6006",
    type: "Loader",
    location: "Site D",
    operationalHours: 95,
    idleHours: 12,
    maintenanceStatus: "maintenance",
    lastMaintenance: "2023-06-12",
    assignedTo: "Maintenance Team",
  },
  {
    id: "EX-1007",
    type: "Excavator",
    location: "Site B",
    operationalHours: 150,
    idleHours: 18,
    maintenanceStatus: "idle",
    lastMaintenance: "2023-05-10",
    assignedTo: "Unassigned",
  },
  {
    id: "DR-7008",
    type: "Drill",
    location: "Site C",
    operationalHours: 65,
    idleHours: 3,
    maintenanceStatus: "active",
    lastMaintenance: "2023-06-05",
    assignedTo: "Robert Brown",
  },
  {
    id: "GR-8009",
    type: "Grader",
    location: "Site D",
    operationalHours: 180,
    idleHours: 15,
    maintenanceStatus: "breakdown",
    lastMaintenance: "2023-04-30",
    assignedTo: "Technical Team",
  },
  {
    id: "CP-9010",
    type: "Compactor",
    location: "Site A",
    operationalHours: 110,
    idleHours: 7,
    maintenanceStatus: "active",
    lastMaintenance: "2023-05-22",
    assignedTo: "David Lee",
  },
];

export default EquipmentTable;
