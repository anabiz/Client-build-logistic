import { TrendingUp, TrendingDown, Clock, Target, Award, AlertTriangle, Search } from "lucide-react";
import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [complianceFilter, setComplianceFilter] = useState<string>("all");
  const [selectedRider, setSelectedRider] = useState<RiderSLA | null>(null);
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
    {
      riderId: "R005",
      riderName: "Fatima Abdullahi",
      onTimeDeliveries: 198,
      lateDeliveries: 22,
      slaCompliance: 90.0,
      avgDeliveryTime: 2.4,
      targetDeliveryTime: 2.5,
      status: "good",
    },
    {
      riderId: "R006",
      riderName: "Emeka Okafor",
      onTimeDeliveries: 156,
      lateDeliveries: 18,
      slaCompliance: 89.7,
      avgDeliveryTime: 2.6,
      targetDeliveryTime: 2.5,
      status: "needs-improvement",
    },
    {
      riderId: "R007",
      riderName: "Aisha Mohammed",
      onTimeDeliveries: 312,
      lateDeliveries: 8,
      slaCompliance: 97.5,
      avgDeliveryTime: 1.9,
      targetDeliveryTime: 2.5,
      status: "excellent",
    },
    {
      riderId: "R008",
      riderName: "Olumide Adebayo",
      onTimeDeliveries: 145,
      lateDeliveries: 25,
      slaCompliance: 85.3,
      avgDeliveryTime: 2.8,
      targetDeliveryTime: 2.5,
      status: "needs-improvement",
    },
    {
      riderId: "R009",
      riderName: "Ibrahim Musa",
      onTimeDeliveries: 267,
      lateDeliveries: 13,
      slaCompliance: 95.4,
      avgDeliveryTime: 2.1,
      targetDeliveryTime: 2.5,
      status: "excellent",
    },
    {
      riderId: "R010",
      riderName: "Grace Okoro",
      onTimeDeliveries: 189,
      lateDeliveries: 31,
      slaCompliance: 85.9,
      avgDeliveryTime: 2.9,
      targetDeliveryTime: 2.5,
      status: "needs-improvement",
    },
    {
      riderId: "R011",
      riderName: "Kemi Adeyemi",
      onTimeDeliveries: 298,
      lateDeliveries: 7,
      slaCompliance: 97.7,
      avgDeliveryTime: 1.8,
      targetDeliveryTime: 2.5,
      status: "excellent",
    },
    {
      riderId: "R012",
      riderName: "Aliyu Garba",
      onTimeDeliveries: 134,
      lateDeliveries: 26,
      slaCompliance: 83.8,
      avgDeliveryTime: 3.1,
      targetDeliveryTime: 2.5,
      status: "critical",
    },
    {
      riderId: "R013",
      riderName: "Chioma Nwankwo",
      onTimeDeliveries: 223,
      lateDeliveries: 17,
      slaCompliance: 92.9,
      avgDeliveryTime: 2.3,
      targetDeliveryTime: 2.5,
      status: "good",
    },
    {
      riderId: "R014",
      riderName: "Bello Yakubu",
      onTimeDeliveries: 178,
      lateDeliveries: 22,
      slaCompliance: 89.0,
      avgDeliveryTime: 2.7,
      targetDeliveryTime: 2.5,
      status: "needs-improvement",
    },
    {
      riderId: "R015",
      riderName: "Adunni Ogundimu",
      onTimeDeliveries: 345,
      lateDeliveries: 9,
      slaCompliance: 97.5,
      avgDeliveryTime: 1.9,
      targetDeliveryTime: 2.5,
      status: "excellent",
    },
    {
      riderId: "R016",
      riderName: "Murtala Sani",
      onTimeDeliveries: 112,
      lateDeliveries: 28,
      slaCompliance: 80.0,
      avgDeliveryTime: 3.2,
      targetDeliveryTime: 2.5,
      status: "critical",
    },
    {
      riderId: "R017",
      riderName: "Blessing Udo",
      onTimeDeliveries: 256,
      lateDeliveries: 14,
      slaCompliance: 94.8,
      avgDeliveryTime: 2.2,
      targetDeliveryTime: 2.5,
      status: "excellent",
    },
    {
      riderId: "R018",
      riderName: "Abdulrahman Bello",
      onTimeDeliveries: 167,
      lateDeliveries: 33,
      slaCompliance: 83.5,
      avgDeliveryTime: 3.0,
      targetDeliveryTime: 2.5,
      status: "critical",
    },
    {
      riderId: "R019",
      riderName: "Ngozi Okafor",
      onTimeDeliveries: 289,
      lateDeliveries: 11,
      slaCompliance: 96.3,
      avgDeliveryTime: 2.0,
      targetDeliveryTime: 2.5,
      status: "excellent",
    },
    {
      riderId: "R020",
      riderName: "Suleiman Ahmed",
      onTimeDeliveries: 201,
      lateDeliveries: 19,
      slaCompliance: 91.4,
      avgDeliveryTime: 2.4,
      targetDeliveryTime: 2.5,
      status: "good",
    },
  ];

  const filteredRiders = riderSLAData.filter((rider) => {
    const matchesSearch = 
      rider.riderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.riderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || rider.status === statusFilter;
    
    const matchesCompliance = complianceFilter === "all" ||
      (complianceFilter === "excellent" && rider.slaCompliance >= 95) ||
      (complianceFilter === "good" && rider.slaCompliance >= 90 && rider.slaCompliance < 95) ||
      (complianceFilter === "needs-improvement" && rider.slaCompliance >= 85 && rider.slaCompliance < 90) ||
      (complianceFilter === "critical" && rider.slaCompliance < 85);
    
    return matchesSearch && matchesStatus && matchesCompliance;
  });

  const {
    paginatedData,
    currentPage,
    totalPages,
    goToPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: filteredRiders,
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

  const avgSLA = filteredRiders.length > 0 ? filteredRiders.reduce((sum, r) => sum + r.slaCompliance, 0) / filteredRiders.length : 0;
  const totalOnTime = filteredRiders.reduce((sum, r) => sum + r.onTimeDeliveries, 0);
  const totalLate = filteredRiders.reduce((sum, r) => sum + r.lateDeliveries, 0);

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
              <p className="text-3xl text-purple-600">{filteredRiders.filter((r) => r.slaCompliance >= 95).length}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Award className="size-5 text-purple-600" />
            </div>
          </div>
          <p className="text-purple-700">Meeting SLA targets</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search riders by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="needs-improvement">Needs Improvement</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Select value={complianceFilter} onValueChange={setComplianceFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="SLA Compliance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Compliance</SelectItem>
            <SelectItem value="excellent">≥95% (Excellent)</SelectItem>
            <SelectItem value="good">90-94% (Good)</SelectItem>
            <SelectItem value="needs-improvement">85-89% (Needs Improvement)</SelectItem>
            <SelectItem value="critical">&lt;85% (Critical)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* SLA Compliance Table */}
      <Card className="p-6">
        <h3 className="mb-4">Individual Rider Performance</h3>

        {/* Mobile Card View */}
        {isMobile ? (
          <div className="space-y-3">
            {paginatedData.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No riders found</p>
              </Card>
            ) : (
              paginatedData.map((rider) => (
                <Card 
                  key={rider.riderId} 
                  className="p-4 bg-gray-50 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedRider(rider)}
                >
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
              ))
            )}
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
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No riders found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((rider) => (
                    <TableRow 
                      key={rider.riderId} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedRider(rider)}
                    >
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

      {/* Rider Detail Modal */}
      {selectedRider && (
        <Dialog open={!!selectedRider} onOpenChange={() => setSelectedRider(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="size-5 text-blue-600" />
                {selectedRider.riderName} - Performance Details
              </DialogTitle>
              <DialogDescription>
                Detailed performance metrics and SLA compliance for {selectedRider.riderId}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Status Overview */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Current Status</p>
                  <p className="font-medium">{selectedRider.riderName}</p>
                  <p className="text-sm text-gray-500">ID: {selectedRider.riderId}</p>
                </div>
                {getStatusBadge(selectedRider.status)}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="size-4 text-green-600" />
                    <span className="text-sm font-medium">SLA Compliance</span>
                  </div>
                  <p className={`text-2xl font-bold ${getSLAColor(selectedRider.slaCompliance)}`}>
                    {selectedRider.slaCompliance}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {selectedRider.slaCompliance >= 95 ? (
                      <TrendingUp className="size-4 text-green-600" />
                    ) : (
                      <TrendingDown className="size-4 text-orange-600" />
                    )}
                    <span className="text-xs text-gray-600">
                      {selectedRider.slaCompliance >= 95 ? 'Above target' : 'Below target'}
                    </span>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="size-4 text-blue-600" />
                    <span className="text-sm font-medium">Avg Delivery Time</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedRider.avgDeliveryTime} days
                  </p>
                  <p className="text-xs text-gray-600">
                    Target: {selectedRider.targetDeliveryTime} days
                  </p>
                </Card>
              </div>

              {/* Delivery Statistics */}
              <div>
                <h4 className="font-medium mb-3">Delivery Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">On-Time Deliveries</p>
                    <p className="text-xl font-bold text-green-600">{selectedRider.onTimeDeliveries}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Late Deliveries</p>
                    <p className="text-xl font-bold text-orange-600">{selectedRider.lateDeliveries}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Delivery Success Rate</span>
                    <span>{((selectedRider.onTimeDeliveries / (selectedRider.onTimeDeliveries + selectedRider.lateDeliveries)) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${(selectedRider.onTimeDeliveries / (selectedRider.onTimeDeliveries + selectedRider.lateDeliveries)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Performance Analysis */}
              <div>
                <h4 className="font-medium mb-3">Performance Analysis</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Time Performance</span>
                    {selectedRider.avgDeliveryTime <= selectedRider.targetDeliveryTime ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <TrendingUp className="size-4" />
                        <span className="text-sm font-medium">Exceeding Target</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-orange-600">
                        <TrendingDown className="size-4" />
                        <span className="text-sm font-medium">Below Target</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">SLA Status</span>
                    <div className="flex items-center gap-2">
                      {selectedRider.slaCompliance >= 95 ? (
                        <Award className="size-4 text-green-600" />
                      ) : selectedRider.slaCompliance >= 85 ? (
                        <Clock className="size-4 text-yellow-600" />
                      ) : (
                        <AlertTriangle className="size-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium">
                        {selectedRider.slaCompliance >= 95 ? 'Excellent' :
                         selectedRider.slaCompliance >= 90 ? 'Good' :
                         selectedRider.slaCompliance >= 85 ? 'Needs Improvement' : 'Critical'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent History */}
              <div>
                <h4 className="font-medium mb-3">Recent Delivery History</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {[
                    { date: '2024-01-15', item: 'PKG-2024-001', status: 'delivered', time: '1.8 days' },
                    { date: '2024-01-14', item: 'PKG-2024-002', status: 'delivered', time: '2.1 days' },
                    { date: '2024-01-13', item: 'PKG-2024-003', status: 'late', time: '3.2 days' },
                    { date: '2024-01-12', item: 'PKG-2024-004', status: 'delivered', time: '1.9 days' },
                    { date: '2024-01-11', item: 'PKG-2024-005', status: 'delivered', time: '2.0 days' },
                  ].map((delivery, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600">{delivery.date}</span>
                        <span className="font-medium">{delivery.item}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{delivery.time}</span>
                        <Badge className={delivery.status === 'delivered' ? 
                          'bg-green-100 text-green-800 hover:bg-green-100' : 
                          'bg-orange-100 text-orange-800 hover:bg-orange-100'
                        }>
                          {delivery.status === 'delivered' ? 'On Time' : 'Late'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}