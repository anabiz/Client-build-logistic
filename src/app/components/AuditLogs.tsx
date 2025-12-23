import { Shield, Calendar, User, Activity, Search, Filter } from "lucide-react";
import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { AuditLog } from "../types";
import { usePagination } from "../hooks/usePagination";
import { PaginationControls } from "./PaginationControls";
import { useIsMobile } from "./ui/use-mobile";

interface AuditLogsProps {
  logs: AuditLog[];
}

export function AuditLogs({ logs }: AuditLogsProps) {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const isMobile = useIsMobile();

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.itemId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesUser = userFilter === "all" || log.userId === userFilter;
    
    const matchesDate = dateFilter === "all" || (() => {
      const logDate = new Date(log.timestamp);
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      switch (dateFilter) {
        case "today": return logDate.toDateString() === today.toDateString();
        case "yesterday": return logDate.toDateString() === yesterday.toDateString();
        case "week": return logDate >= weekAgo;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesAction && matchesUser && matchesDate;
  });

  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));
  const uniqueUsers = Array.from(new Set(logs.map(log => ({ id: log.userId, name: log.userName }))));

  const {
    paginatedData,
    currentPage,
    totalPages,
    goToPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: filteredLogs,
    itemsPerPage,
  });

  const getActionBadge = (action: string) => {
    const variants: Record<string, string> = {
      ITEM_ASSIGNED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      ITEM_PICKED_UP: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      ITEM_DELIVERED: "bg-green-100 text-green-800 hover:bg-green-100",
      BATCH_UPLOADED: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      HUB_TRANSFER: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      USER_LOGIN: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      STATUS_CHANGED: "bg-teal-100 text-teal-800 hover:bg-teal-100",
    };

    return (
      <Badge className={variants[action] || variants.STATUS_CHANGED}>
        {action.replace(/_/g, " ")}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-start gap-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Shield className="size-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl mb-2">Audit Logs</h2>
            <p className="text-gray-600">
              Complete immutable record of all system activities for compliance and security
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-gray-600" />
            <h3>Recent Activity</h3>
          </div>
          <p className="text-gray-600">{filteredLogs.length} of {logs.length} logs</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {uniqueActions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger>
              <SelectValue placeholder="User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {uniqueUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Card View */}
        {isMobile ? (
          <div className="space-y-3">
            {paginatedData.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No audit logs found</p>
              </Card>
            ) : (
              paginatedData.map((log) => (
              <Card key={log.id} className="p-4 bg-gray-50">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-gray-400" />
                      <div>
                        <p className="text-sm">{new Date(log.timestamp).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    {getActionBadge(log.action)}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">User</p>
                      <div className="flex items-center gap-2">
                        <User className="size-3 text-gray-400" />
                        <div>
                          <p>{log.userName}</p>
                          <p className="text-gray-500 text-xs">ID: {log.userId}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-600">Details</p>
                      <p>{log.details}</p>
                    </div>

                    {log.itemId && (
                      <div>
                        <p className="text-gray-600">Item ID</p>
                        <p className="font-mono text-xs">{log.itemId}</p>
                      </div>
                    )}

                    {log.ipAddress && (
                      <div>
                        <p className="text-gray-600">IP Address</p>
                        <p className="font-mono text-xs">{log.ipAddress}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
              ))
            )}
          </div>
        ) : (
          /* Desktop Table View */
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Item ID</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-gray-400" />
                        <div>
                          <p>{new Date(log.timestamp).toLocaleDateString()}</p>
                          <p className="text-gray-500">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-gray-400" />
                        <div>
                          <p>{log.userName}</p>
                          <p className="text-gray-500">ID: {log.userId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>
                      <p className="text-gray-600 max-w-md">{log.details}</p>
                    </TableCell>
                    <TableCell>
                      {log.itemId ? (
                        <span className="font-mono text-sm">{log.itemId}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.ipAddress ? (
                        <span className="font-mono text-sm">{log.ipAddress}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          showItemsPerPage={true}
        />
      </Card>

      {/* Security Notice */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Shield className="size-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-blue-900 mb-1">Secure & Immutable</p>
            <p className="text-blue-700">
              All audit logs are encrypted and cannot be modified or deleted. They are retained for compliance purposes and available for regulatory audits.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}