import { useState } from "react";
import { Search, Filter, MapPin, Package } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { StatusBadge, ShipmentStatus } from "./StatusBadge";
import { usePagination } from "../hooks/usePagination";
import { PaginationControls } from "./PaginationControls";
import { useIsMobile } from "./ui/use-mobile";

export interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  estimatedDelivery: string;
  customer: string;
  weight: string;
}

interface ShipmentsTableProps {
  shipments: Shipment[];
  onSelectShipment: (shipment: Shipment) => void;
}

export function ShipmentsTable({ shipments, onSelectShipment }: ShipmentsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const isMobile = useIsMobile();

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || shipment.status === statusFilter;

    return matchesSearch && matchesStatus;
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
    data: filteredShipments,
    itemsPerPage,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search by tracking number, customer, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="size-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mobile Card View */}
      {isMobile ? (
        <div className="space-y-3">
          {paginatedData.length === 0 ? (
            <Card className="p-8 text-center">
              <Package className="size-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No shipments found</p>
            </Card>
          ) : (
            paginatedData.map((shipment) => (
              <Card
                key={shipment.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onSelectShipment(shipment)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{shipment.trackingNumber}</p>
                      <p className="text-sm text-gray-600">{shipment.customer}</p>
                    </div>
                    <StatusBadge status={shipment.status} />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Route</p>
                      <div className="flex items-center gap-2">
                        <span>{shipment.origin}</span>
                        <MapPin className="size-3 text-gray-400" />
                        <span>{shipment.destination}</span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-600">Est. Delivery</p>
                        <p>{shipment.estimatedDelivery}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Weight</p>
                        <p>{shipment.weight}</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectShipment(shipment);
                    }}
                  >
                    View Details
                  </Button>
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
                <TableHead>Tracking Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Est. Delivery</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No shipments found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((shipment) => (
                  <TableRow key={shipment.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell onClick={() => onSelectShipment(shipment)}>
                      {shipment.trackingNumber}
                    </TableCell>
                    <TableCell onClick={() => onSelectShipment(shipment)}>
                      {shipment.customer}
                    </TableCell>
                    <TableCell onClick={() => onSelectShipment(shipment)}>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{shipment.origin}</span>
                        <MapPin className="size-3 text-gray-400" />
                        <span className="text-gray-600">{shipment.destination}</span>
                      </div>
                    </TableCell>
                    <TableCell onClick={() => onSelectShipment(shipment)}>
                      <StatusBadge status={shipment.status} />
                    </TableCell>
                    <TableCell onClick={() => onSelectShipment(shipment)}>
                      {shipment.estimatedDelivery}
                    </TableCell>
                    <TableCell onClick={() => onSelectShipment(shipment)}>
                      {shipment.weight}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectShipment(shipment)}
                      >
                        View Details
                      </Button>
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
    </div>
  );
}