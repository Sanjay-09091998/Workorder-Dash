import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  UserCircle,
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  assignedWorkOrders: number;
  completedWorkOrders: number;
  overtime: number;
  idleHours: number;
  geofenceCompliance: number;
  status: "active" | "idle" | "overtime";
}

interface EmployeeGridProps {
  employees?: Employee[];
  onEmployeeSelect?: (employee: Employee) => void;
}

const EmployeeGrid = ({
  employees = defaultEmployees,
  onEmployeeSelect = () => {},
}: EmployeeGridProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Employee;
    direction: "asc" | "desc";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Sort employees based on current sort configuration
  const sortedEmployees = React.useMemo(() => {
    let sortableEmployees = [...employees];
    if (sortConfig !== null) {
      sortableEmployees.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableEmployees;
  }, [employees, sortConfig]);

  // Filter employees based on search term and status filter
  const filteredEmployees = React.useMemo(() => {
    return sortedEmployees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || employee.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [sortedEmployees, searchTerm, filterStatus]);

  // Get top performers and underperformers
  const topPerformers = React.useMemo(() => {
    return [...employees]
      .sort(
        (a, b) =>
          b.completedWorkOrders / b.assignedWorkOrders -
          a.completedWorkOrders / a.assignedWorkOrders,
      )
      .slice(0, 5);
  }, [employees]);

  const underperformers = React.useMemo(() => {
    return [...employees]
      .sort(
        (a, b) =>
          a.completedWorkOrders / a.assignedWorkOrders -
          b.completedWorkOrders / b.assignedWorkOrders,
      )
      .slice(0, 5);
  }, [employees]);

  // Handle sorting when a column header is clicked
  const requestSort = (key: keyof Employee) => {
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

  // Render sort indicator for column headers
  const getSortIndicator = (key: keyof Employee) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "idle":
        return <Badge className="bg-yellow-500">Idle</Badge>;
      case "overtime":
        return <Badge className="bg-red-500">Overtime</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Employee Performance</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-8 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[130px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="overtime">Overtime</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Employees</TabsTrigger>
            <TabsTrigger value="top">Top Performers</TabsTrigger>
            <TabsTrigger value="under">Underperformers</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => requestSort("name")}
                      >
                        Employee
                        {getSortIndicator("name")}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => requestSort("assignedWorkOrders")}
                      >
                        Assigned
                        {getSortIndicator("assignedWorkOrders")}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => requestSort("completedWorkOrders")}
                      >
                        Completed
                        {getSortIndicator("completedWorkOrders")}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => requestSort("overtime")}
                      >
                        Overtime (hrs)
                        {getSortIndicator("overtime")}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => requestSort("idleHours")}
                      >
                        Idle (hrs)
                        {getSortIndicator("idleHours")}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => requestSort("geofenceCompliance")}
                      >
                        Compliance %{getSortIndicator("geofenceCompliance")}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={employee.avatar}
                                alt={employee.name}
                              />
                              <AvatarFallback>
                                {employee.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {employee.role}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.assignedWorkOrders}</TableCell>
                        <TableCell>{employee.completedWorkOrders}</TableCell>
                        <TableCell>
                          <span
                            className={
                              employee.overtime > 5
                                ? "text-red-500 font-medium"
                                : ""
                            }
                          >
                            {employee.overtime}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              employee.idleHours > 10
                                ? "text-yellow-500 font-medium"
                                : ""
                            }
                          >
                            {employee.idleHours}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              employee.geofenceCompliance < 90
                                ? "text-red-500 font-medium"
                                : "text-green-500 font-medium"
                            }
                          >
                            {employee.geofenceCompliance}%
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(employee.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEmployeeSelect(employee)}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No employees found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="top">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Employee</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>Compliance %</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPerformers.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={employee.avatar}
                              alt={employee.name}
                            />
                            <AvatarFallback>
                              {employee.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {employee.role}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.assignedWorkOrders}</TableCell>
                      <TableCell>{employee.completedWorkOrders}</TableCell>
                      <TableCell>
                        <span className="text-green-500 font-medium">
                          {Math.round(
                            (employee.completedWorkOrders /
                              employee.assignedWorkOrders) *
                              100,
                          )}
                          %
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            employee.geofenceCompliance < 90
                              ? "text-red-500 font-medium"
                              : "text-green-500 font-medium"
                          }
                        >
                          {employee.geofenceCompliance}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEmployeeSelect(employee)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="under">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Employee</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>Idle Hours</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {underperformers.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={employee.avatar}
                              alt={employee.name}
                            />
                            <AvatarFallback>
                              {employee.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {employee.role}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.assignedWorkOrders}</TableCell>
                      <TableCell>{employee.completedWorkOrders}</TableCell>
                      <TableCell>
                        <span className="text-red-500 font-medium">
                          {Math.round(
                            (employee.completedWorkOrders /
                              employee.assignedWorkOrders) *
                              100,
                          )}
                          %
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-yellow-500 font-medium">
                          {employee.idleHours}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEmployeeSelect(employee)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Mock data for default display
const defaultEmployees: Employee[] = [
  {
    id: "EMP001",
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    role: "Senior Operator",
    assignedWorkOrders: 12,
    completedWorkOrders: 10,
    overtime: 2,
    idleHours: 3,
    geofenceCompliance: 98,
    status: "active",
  },
  {
    id: "EMP002",
    name: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    role: "Equipment Specialist",
    assignedWorkOrders: 8,
    completedWorkOrders: 7,
    overtime: 1,
    idleHours: 2,
    geofenceCompliance: 100,
    status: "active",
  },
  {
    id: "EMP003",
    name: "Robert Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    role: "Heavy Equipment Operator",
    assignedWorkOrders: 15,
    completedWorkOrders: 9,
    overtime: 6,
    idleHours: 1,
    geofenceCompliance: 92,
    status: "overtime",
  },
  {
    id: "EMP004",
    name: "Emily Davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    role: "Junior Operator",
    assignedWorkOrders: 6,
    completedWorkOrders: 2,
    overtime: 0,
    idleHours: 12,
    geofenceCompliance: 85,
    status: "idle",
  },
  {
    id: "EMP005",
    name: "Michael Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    role: "Senior Operator",
    assignedWorkOrders: 10,
    completedWorkOrders: 9,
    overtime: 3,
    idleHours: 1,
    geofenceCompliance: 97,
    status: "active",
  },
  {
    id: "EMP006",
    name: "Sarah Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    role: "Equipment Specialist",
    assignedWorkOrders: 9,
    completedWorkOrders: 3,
    overtime: 0,
    idleHours: 8,
    geofenceCompliance: 88,
    status: "idle",
  },
  {
    id: "EMP007",
    name: "David Miller",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    role: "Heavy Equipment Operator",
    assignedWorkOrders: 14,
    completedWorkOrders: 12,
    overtime: 7,
    idleHours: 0,
    geofenceCompliance: 95,
    status: "overtime",
  },
  {
    id: "EMP008",
    name: "Lisa Taylor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    role: "Senior Operator",
    assignedWorkOrders: 11,
    completedWorkOrders: 10,
    overtime: 2,
    idleHours: 1,
    geofenceCompliance: 99,
    status: "active",
  },
];

export default EmployeeGrid;
