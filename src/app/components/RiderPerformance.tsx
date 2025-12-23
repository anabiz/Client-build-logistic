import { TrendingUp, TrendingDown, Clock, Target, Award, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Rider } from "../types";
import { usePagination } from "../hooks/usePagination";
import { PaginationControls } from "./PaginationControls";
import { useIsMobile } from "./ui/use-mobile";

interface RiderPerformanceProps {
  riders: Rider[];
}

interface RiderSLA {
  riderId: string;
  riderName: string;
  onTimeDeliveries: number;
  lateDeliveries: number;
  slaCompliance: number;
  avgDeliveryTime: number;
  targetDeliveryTime: number;
  status: "excellent" | "good" | "needs-improvement" | "critical";
}

export function RiderPerformance({ riders }: RiderPerformanceProps) {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const isMobile = useIsMobile();

  // Mock SLA data for riders
  const riderSLAData: RiderSLA[] = [
    {
      riderId: "R001",
      riderName: "Tunde Bakare",
      onTimeDeliveries: 330,
      lateDeliveries: 12,
      slaCompliance: 96.5,
      avgDeliveryTime: 2.1,
      targetDeliveryTime: 2.5,
      status: "excellent",
    },
    {
      riderId: "R002",
      riderName: "Chukwudi Eze",
      onTimeDeliveries: 274,
      lateDeliveries: 15,
      slaCompliance: 94.8,
      avgDeliveryTime: 2.3,
      targetDeliveryTime: 2.5,
      status: "excellent",
    },
    {
      riderId: "R003",
      riderName: "Yusuf Hassan",
      onTimeDeliveries: 390,
      lateDeliveries: 11,
      slaCompliance: 97.2,
      avgDeliveryTime: 2.0,
      targetDeliveryTime: 2.5,
      status: "excellent",
    },
    {
      riderId: "R004",
      riderName: "Samuel Okon",
      onTimeDeliveries: 244,
      lateDeliveries: 12,
      slaCompliance: 95.3,
      avgDeliveryTime: 2.2,
      targetDeliveryTime: 2.5,
      status: "excellent",
    },
  ];

  const {
    paginatedData,
    currentPage,
    totalPages,
    goToPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: riderSLAData,
    itemsPerPage,
  });

  const getStatusBadge = (status: RiderSLA["status"]) => {
    const variants = {
      excellent: "bg-green-100 text-green-800 hover:bg-green-100",
      good: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      "needs-improvement": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      critical: "bg-red-100 text-red-800 hover:bg-red-100",
    };
    return (
      <Badge className={variants[status]}>
        {status.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
      </Badge>
    );
  };

  const getSLAColor = (compliance: number) => {
    if (compliance >= 95) return "text-green-600";
    if (compliance >= 90) return "text-blue-600";
    if (compliance >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  const avgSLA = riderSLAData.reduce((sum, r) => sum + r.slaCompliance, 0) / riderSLAData.length;
  const totalOnTime = riderSLAData.reduce((sum, r) => sum + r.onTimeDeliveries, 0);
  const totalLate = riderSLAData.reduce((sum, r) => sum + r.lateDeliveries, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">Rider Performance & SLA Tracking</h2>
        <p className="text-gray-600">
          Monitor rider performance against Service Level Agreements
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-gray-600 mb-1">Average SLA Compliance</p>
              <p className="text-3xl text-green-600">{avgSLA.toFixed(1)}%</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <Target className="size-5 text-green-600" />
            </div>
          </div>
          <p className="text-green-700 flex items-center gap-1">
            <TrendingUp className="size-4" />
            Above 95% target
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-gray-600 mb-1">On-Time Deliveries</p>
              <p className="text-3xl text-blue-600">{totalOnTime}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Clock className="size-5 text-blue-600" />
            </div>
          </div>
          <p className="text-blue-700">This month</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-gray-600 mb-1">Late Deliveries</p>
              <p className="text-3xl text-orange-600">{totalLate}</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <AlertTriangle className="size-5 text-orange-600" />
            </div>
          </div>
          <p className="text-orange-700">{((totalLate / (totalOnTime + totalLate)) * 100).toFixed(1)}% of total</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-gray-600 mb-1">Top Performers</p>
              <p className="text-3xl text-purple-600">{riderSLAData.filter((r) => r.slaCompliance >= 95).length}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Award className="size-5 text-purple-600" />
            </div>
          </div>
          <p className="text-purple-700">Meeting SLA targets</p>
        </Card>
      </div>

      {/* SLA Compliance Table */}
      <Card className="p-6">
        <h3 className="mb-4">Individual Rider Performance</h3>

        {/* Mobile Card View */}
        {isMobile ? (
          <div className="space-y-3">
            {paginatedData.map((rider) => (
              <Card key={rider.riderId} className="p-4 bg-gray-50">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{rider.riderName}</p>
                      <p className="text-sm text-gray-500">ID: {rider.riderId}</p>
                    </div>
                    {getStatusBadge(rider.status)}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">SLA Compliance</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl ${getSLAColor(rider.slaCompliance)}`}>
                          {rider.slaCompliance}%
                        </span>
                        {rider.slaCompliance >= 95 ? (
                          <TrendingUp className="size-4 text-green-600" />
                        ) : (
                          <TrendingDown className="size-4 text-orange-600" />
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-600">On-Time</p>
                        <p className="text-green-600">{rider.onTimeDeliveries}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Late</p>
                        <p className="text-orange-600">{rider.lateDeliveries}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Avg Delivery</span>
                        <span>{rider.avgDeliveryTime} days</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            rider.avgDeliveryTime <= rider.targetDeliveryTime
                              ? "bg-green-500"
                              : "bg-orange-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (rider.avgDeliveryTime / rider.targetDeliveryTime) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Target: {rider.targetDeliveryTime} days
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Performance</span>
                      {rider.avgDeliveryTime <= rider.targetDeliveryTime ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <TrendingUp className="size-4" />
                          <span>Exceeding</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-orange-600">
                          <TrendingDown className="size-4" />
                          <span>Below Target</span>
                        </div>
                      )}
                    </div>
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
                  <TableHead>Rider</TableHead>
                  <TableHead>SLA Compliance</TableHead>
                  <TableHead>On-Time</TableHead>
                  <TableHead>Late</TableHead>
                  <TableHead>Avg Delivery Time</TableHead>
                  <TableHead>Target Time</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((rider) => (
                  <TableRow key={rider.riderId}>
                    <TableCell>
                      <div>
                        <p>{rider.riderName}</p>
                        <p className="text-gray-500">ID: {rider.riderId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl ${getSLAColor(rider.slaCompliance)}`}>
                          {rider.slaCompliance}%
                        </span>
                        {rider.slaCompliance >= 95 ? (
                          <TrendingUp className="size-4 text-green-600" />
                        ) : (
                          <TrendingDown className="size-4 text-orange-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-green-600">{rider.onTimeDeliveries}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-orange-600">{rider.lateDeliveries}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{rider.avgDeliveryTime} days</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className={`h-1.5 rounded-full ${
                              rider.avgDeliveryTime <= rider.targetDeliveryTime
                                ? "bg-green-500"
                                : "bg-orange-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                (rider.avgDeliveryTime / rider.targetDeliveryTime) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{rider.targetDeliveryTime} days</TableCell>
                    <TableCell>
                      {rider.avgDeliveryTime <= rider.targetDeliveryTime ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <TrendingUp className="size-4" />
                          <span>Exceeding</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-orange-600">
                          <TrendingDown className="size-4" />
                          <span>Below Target</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(rider.status)}</TableCell>
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

      {/* SLA Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="mb-3 flex items-center gap-2">
          <Target className="size-5 text-blue-600" />
          SLA Performance Guidelines
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2">Compliance Targets:</p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-green-500" />
                <span>≥95% - Excellent</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-blue-500" />
                <span>90-94% - Good</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-yellow-500" />
                <span>85-89% - Needs Improvement</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-red-500" />
                <span>&lt;85% - Critical</span>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-2">Delivery Time SLA:</p>
            <ul className="space-y-1 text-sm">
              <li>• Target: 2.5 days from dispatch</li>
              <li>• Within Lagos: 24-48 hours</li>
              <li>• Other states: 48-72 hours</li>
              <li>• Remote areas: Up to 96 hours</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}