import { Shield, Calendar, User, Activity } from "lucide-react";
import { useState } from "react";
import { Card } from "./ui/card";
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
  const isMobile = useIsMobile();

  const {
    paginatedData,
    currentPage,
    totalPages,
    goToPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: logs,
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
          <p className="text-gray-600">{logs.length} total logs</p>
        </div>

        {/* Mobile Card View */}
        {isMobile ? (
          <div className="space-y-3">
            {paginatedData.map((log) => (
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
            ))}
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
                {paginatedData.map((log) => (
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
                ))}
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