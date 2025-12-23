import { useState } from "react";
import { MapPin, Package, Navigation, Camera, CheckCircle, Phone, Clock, Calendar, Search } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { StatCard } from "./StatCard";
import { ItemStatusBadge } from "./ItemStatusBadge";
import { Item, Rider } from "../types";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useIsMobile } from "./ui/use-mobile";
import { usePagination } from "../hooks/usePagination";
import { PaginationControls } from "./PaginationControls";

interface RiderDashboardProps {
  rider: Rider;
  assignedItems: Item[];
}

export function RiderDashboard({ rider, assignedItems }: RiderDashboardProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>("all");
  const [historyDateFilter, setHistoryDateFilter] = useState<string>("all");
  const [historyItemsPerPage, setHistoryItemsPerPage] = useState(10);
  const isMobile = useIsMobile();

  const pendingDeliveries = assignedItems.filter(
    (item) => item.status === "dispatched" || item.status === "in-transit"
  );
  const completedToday = assignedItems.filter(
    (item) => item.status === "delivered"
  ).length;
  
  const allHistory = assignedItems.filter(
    (item) => item.status === "delivered" || item.status === "failed"
  );

  const filteredHistory = allHistory.filter((item) => {
    const matchesSearch = 
      item.itemNumber.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.applicantName.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.deliveryAddress.toLowerCase().includes(historySearch.toLowerCase());
    
    const matchesStatus = historyStatusFilter === "all" || item.status === historyStatusFilter;
    
    const matchesDate = historyDateFilter === "all" || (() => {
      if (!item.deliveredAt) return historyDateFilter === "failed";
      const deliveryDate = new Date(item.deliveredAt);
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      switch (historyDateFilter) {
        case "today": return deliveryDate.toDateString() === today.toDateString();
        case "yesterday": return deliveryDate.toDateString() === yesterday.toDateString();
        case "week": return deliveryDate >= weekAgo;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const {
    paginatedData: paginatedHistory,
    currentPage: historyCurrentPage,
    totalPages: historyTotalPages,
    goToPage: historyGoToPage,
    startIndex: historyStartIndex,
    endIndex: historyEndIndex,
    totalItems: historyTotalItems,
  } = usePagination({
    data: filteredHistory,
    itemsPerPage: historyItemsPerPage,
  });

  const handleStartDelivery = (item: Item) => {
    setSelectedItem(item);
    setShowDeliveryModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Rider Profile Card */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl mb-2">Welcome, {rider.name}</h2>
            <p className="text-gray-600 mb-4">Rider ID: {rider.id}</p>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                {rider.status === "available" ? "Available" : rider.status}
              </Badge>
              <div className="flex items-center gap-2 text-gray-600">
                <span>⭐ {rider.rating}</span>
                <span>•</span>
                <span>{rider.totalDeliveries} deliveries</span>
                <span>•</span>
                <span>{rider.successRate}% success rate</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Vehicle</p>
            <p className="text-xl">{rider.vehicleNumber}</p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Pending Deliveries"
          value={pendingDeliveries.length}
          icon={Package}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
        <StatCard
          title="Completed Today"
          value={completedToday}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Success Rate"
          value={`${rider.successRate}%`}
          icon={Navigation}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
      </div>

      {/* Deliveries Tabs */}
      <Tabs defaultValue="assigned" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assigned" className="flex items-center gap-2">
            <Package className="size-4" />
            Assigned ({pendingDeliveries.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="size-4" />
            History ({allHistory.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned">
          <div className="space-y-4">
            {pendingDeliveries.length === 0 ? (
              <Card className="p-8 text-center">
                <Package className="size-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No pending deliveries</p>
                <p className="text-gray-500">Check back later for new assignments</p>
              </Card>
            ) : (
              pendingDeliveries.map((item) => (
                <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-sm sm:text-base font-medium">{item.itemNumber}</h4>
                        <ItemStatusBadge status={item.status} />
                      </div>
                      <div className="space-y-2 text-gray-600">
                        <p className="flex items-center gap-2 text-xs sm:text-sm">
                          <Package className="size-3 sm:size-4 flex-shrink-0" />
                          <span className="font-mono truncate">{item.qrCode}</span>
                        </p>
                        <p className="flex items-start gap-2 text-xs sm:text-sm">
                          <MapPin className="size-3 sm:size-4 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{item.deliveryAddress}, {item.lga}, {item.state}</span>
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleStartDelivery(item)}
                      className="flex items-center gap-2 w-full sm:w-auto text-sm"
                      size={isMobile ? "sm" : "default"}
                    >
                      <Navigation className="size-3 sm:size-4" />
                      <span className="sm:inline">Start Delivery</span>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t text-xs sm:text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Recipient</p>
                      <p className="font-medium truncate">{item.applicantName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Contact</p>
                      <p className="flex items-center gap-1">
                        <Phone className="size-3 flex-shrink-0" />
                        <span className="truncate">{item.applicantPhone}</span>
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          {/* History Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search history..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={historyStatusFilter} onValueChange={setHistoryStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={historyDateFilter} onValueChange={setHistoryDateFilter}>
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

          {filteredHistory.length === 0 ? (
            <Card className="p-8 text-center">
              <Clock className="size-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No delivery history found</p>
              <p className="text-gray-500">Try adjusting your filters</p>
            </Card>
          ) : isMobile ? (
            <div className="space-y-3">
              {paginatedHistory.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{item.itemNumber}</h4>
                        <p className="text-sm text-gray-600">{item.applicantName}</p>
                      </div>
                      <ItemStatusBadge status={item.status} />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-gray-400" />
                        <span className="truncate">{item.deliveryAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-gray-400" />
                        <span>
                          {item.deliveredAt 
                            ? new Date(item.deliveredAt).toLocaleDateString()
                            : 'Failed delivery'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Number</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono">{item.itemNumber}</TableCell>
                        <TableCell>
                          <div>
                            <p>{item.applicantName}</p>
                            <p className="text-sm text-gray-500">{item.applicantPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{item.deliveryAddress}</p>
                            <p className="text-sm text-gray-500">{item.lga}, {item.state}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <ItemStatusBadge status={item.status} />
                        </TableCell>
                        <TableCell>
                          {item.deliveredAt ? (
                            <div>
                              <p>{new Date(item.deliveredAt).toLocaleDateString()}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(item.deliveredAt).toLocaleTimeString()}
                              </p>
                            </div>
                          ) : (
                            <span className="text-red-600">Failed</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
          
          {filteredHistory.length > 0 && (
            <PaginationControls
              currentPage={historyCurrentPage}
              totalPages={historyTotalPages}
              onPageChange={historyGoToPage}
              startIndex={historyStartIndex}
              endIndex={historyEndIndex}
              totalItems={historyTotalItems}
              itemsPerPage={historyItemsPerPage}
              onItemsPerPageChange={setHistoryItemsPerPage}
              showItemsPerPage={true}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Delivery Confirmation Modal */}
      {selectedItem && (
        <Dialog open={showDeliveryModal} onOpenChange={setShowDeliveryModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Delivery</DialogTitle>
              <DialogDescription>
                Complete the delivery for {selectedItem.itemNumber}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Card className="p-4 bg-gray-50">
                <p className="text-gray-600 mb-1">Scan QR Code</p>
                <p className="font-mono text-xl">{selectedItem.qrCode}</p>
              </Card>

              <div>
                <Label>Capture GPS Location</Label>
                <Button variant="outline" className="w-full mt-2">
                  <MapPin className="size-4 mr-2" />
                  Capture Current Location
                </Button>
                <p className="text-gray-500 mt-1">
                  GPS: 6.5244, 3.3792 (Auto-captured)
                </p>
              </div>

              <div>
                <Label>Proof of Delivery Photo</Label>
                <Button variant="outline" className="w-full mt-2">
                  <Camera className="size-4 mr-2" />
                  Take Photo
                </Button>
              </div>

              <div>
                <Label htmlFor="recipientName">Recipient Name</Label>
                <input
                  id="recipientName"
                  type="text"
                  placeholder="Enter recipient name"
                  defaultValue={selectedItem.applicantName}
                  className="w-full mt-2 px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes..."
                  className="mt-2"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeliveryModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setShowDeliveryModal(false);
                    setSelectedItem(null);
                  }}
                >
                  <CheckCircle className="size-4 mr-2" />
                  Confirm Delivery
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
