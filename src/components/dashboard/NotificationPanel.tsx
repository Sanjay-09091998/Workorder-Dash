import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Bell,
  AlertTriangle,
  Clock,
  Wrench,
  CheckCircle,
  Filter,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "critical" | "warning" | "info";
  category: "machine" | "operator" | "maintenance";
  isRead: boolean;
  actionRequired: boolean;
}

const NotificationPanel = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Machine Breakdown",
      description:
        "Excavator #EX-2234 has reported a hydraulic system failure at Site B.",
      timestamp: "10 mins ago",
      type: "critical",
      category: "machine",
      isRead: false,
      actionRequired: true,
    },
    {
      id: "2",
      title: "Operator Overtime Alert",
      description:
        "John Smith has exceeded 12 hours of continuous operation on Bulldozer #BD-1123.",
      timestamp: "25 mins ago",
      type: "warning",
      category: "operator",
      isRead: false,
      actionRequired: true,
    },
    {
      id: "3",
      title: "Maintenance Due",
      description:
        "Scheduled maintenance for Crane #CR-5567 is overdue by 2 days.",
      timestamp: "1 hour ago",
      type: "warning",
      category: "maintenance",
      isRead: false,
      actionRequired: true,
    },
    {
      id: "4",
      title: "Geofence Violation",
      description: "Loader #LD-3389 has left designated work area at Site C.",
      timestamp: "2 hours ago",
      type: "critical",
      category: "machine",
      isRead: true,
      actionRequired: false,
    },
    {
      id: "5",
      title: "Operator Check-in Missing",
      description:
        "Michael Johnson has not checked in for scheduled shift on Excavator #EX-4478.",
      timestamp: "3 hours ago",
      type: "warning",
      category: "operator",
      isRead: true,
      actionRequired: true,
    },
    {
      id: "6",
      title: "Fuel Level Low",
      description:
        "Bulldozer #BD-2245 is reporting critically low fuel levels.",
      timestamp: "4 hours ago",
      type: "info",
      category: "machine",
      isRead: true,
      actionRequired: false,
    },
    {
      id: "7",
      title: "Maintenance Completed",
      description:
        "Scheduled maintenance for Excavator #EX-1190 has been completed.",
      timestamp: "5 hours ago",
      type: "info",
      category: "maintenance",
      isRead: true,
      actionRequired: false,
    },
  ]);

  const [filters, setFilters] = useState({
    showCritical: true,
    showWarning: true,
    showInfo: true,
    showMachine: true,
    showOperator: true,
    showMaintenance: true,
    showUnreadOnly: false,
    showActionRequired: false,
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const handleTakeAction = (id: string) => {
    // In a real application, this would open a dialog or navigate to a details page
    console.log(`Taking action on notification ${id}`);
  };

  const filteredNotifications = notifications.filter((notification) => {
    // Filter by tab
    if (activeTab !== "all" && notification.category !== activeTab)
      return false;

    // Filter by type
    if (notification.type === "critical" && !filters.showCritical) return false;
    if (notification.type === "warning" && !filters.showWarning) return false;
    if (notification.type === "info" && !filters.showInfo) return false;

    // Filter by category
    if (notification.category === "machine" && !filters.showMachine)
      return false;
    if (notification.category === "operator" && !filters.showOperator)
      return false;
    if (notification.category === "maintenance" && !filters.showMaintenance)
      return false;

    // Filter by read status
    if (filters.showUnreadOnly && notification.isRead) return false;

    // Filter by action required
    if (filters.showActionRequired && !notification.actionRequired)
      return false;

    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const criticalCount = notifications.filter(
    (n) => n.type === "critical" && !n.isRead,
  ).length;

  const getNotificationIcon = (type: string, category: string) => {
    if (type === "critical")
      return <AlertTriangle className="h-5 w-5 text-destructive" />;
    if (category === "operator")
      return <Clock className="h-5 w-5 text-amber-500" />;
    if (category === "maintenance")
      return <Wrench className="h-5 w-5 text-blue-500" />;
    if (type === "info")
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <Bell className="h-5 w-5 text-amber-500" />;
  };

  const getNotificationBadge = (type: string) => {
    if (type === "critical")
      return <Badge variant="destructive">Critical</Badge>;
    if (type === "warning")
      return (
        <Badge variant="outline" className="border-amber-500 text-amber-500">
          Warning
        </Badge>
      );
    return (
      <Badge variant="outline" className="border-green-500 text-green-500">
        Info
      </Badge>
    );
  };

  return (
    <Card className="w-full h-full bg-background">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
          </CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">
                    Filter Notifications
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Customize which notifications to display
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-critical"
                        checked={filters.showCritical}
                        onCheckedChange={(checked) =>
                          setFilters({ ...filters, showCritical: !!checked })
                        }
                      />
                      <Label htmlFor="show-critical">Critical</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-warning"
                        checked={filters.showWarning}
                        onCheckedChange={(checked) =>
                          setFilters({ ...filters, showWarning: !!checked })
                        }
                      />
                      <Label htmlFor="show-warning">Warning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-info"
                        checked={filters.showInfo}
                        onCheckedChange={(checked) =>
                          setFilters({ ...filters, showInfo: !!checked })
                        }
                      />
                      <Label htmlFor="show-info">Info</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-machine"
                        checked={filters.showMachine}
                        onCheckedChange={(checked) =>
                          setFilters({ ...filters, showMachine: !!checked })
                        }
                      />
                      <Label htmlFor="show-machine">Machine</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-operator"
                        checked={filters.showOperator}
                        onCheckedChange={(checked) =>
                          setFilters({ ...filters, showOperator: !!checked })
                        }
                      />
                      <Label htmlFor="show-operator">Operator</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-maintenance"
                        checked={filters.showMaintenance}
                        onCheckedChange={(checked) =>
                          setFilters({ ...filters, showMaintenance: !!checked })
                        }
                      />
                      <Label htmlFor="show-maintenance">Maintenance</Label>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-unread"
                        checked={filters.showUnreadOnly}
                        onCheckedChange={(checked) =>
                          setFilters({ ...filters, showUnreadOnly: !!checked })
                        }
                      />
                      <Label htmlFor="show-unread">Unread only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-action"
                        checked={filters.showActionRequired}
                        onCheckedChange={(checked) =>
                          setFilters({
                            ...filters,
                            showActionRequired: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-action">Action required only</Label>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <Badge variant="outline" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="machine">
              Machine
              {criticalCount > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {criticalCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="operator">Operator</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[650px] pr-4">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${notification.isRead ? "bg-background" : "bg-muted"} ${notification.type === "critical" ? "border-destructive" : "border-border"}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        {getNotificationIcon(
                          notification.type,
                          notification.category,
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              {notification.title}
                            </h4>
                            {getNotificationBadge(notification.type)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                      {notification.actionRequired && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTakeAction(notification.id)}
                        >
                          Take action
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Bell className="h-10 w-10 mb-2" />
                <p>No notifications match your filters</p>
              </div>
            )}
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
