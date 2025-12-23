import { useState } from "react";
import { Search, QrCode, MapPin, Phone } from "lucide-react";
import { Input } from "./ui/input";
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
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ItemStatusBadge } from "./ItemStatusBadge";
import { Item, ItemStatus } from "../types";
import { usePagination } from "../hooks/usePagination";
import { PaginationControls } from "./PaginationControls";
import { useIsMobile } from "./ui/use-mobile";

interface ItemsTableProps {
  items: Item[];
  onItemSelect: (item: Item) => void;
  showActions?: boolean;
}

export function ItemsTable({ items, onItemSelect, showActions = true }: ItemsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const isMobile = useIsMobile();

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.itemNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.qrCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesState = stateFilter === "all" || item.state === stateFilter;

    return matchesSearch && matchesStatus && matchesState;
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
    data: filteredItems,
    itemsPerPage,
  });

  const states = Array.from(new Set(items.map((item) => item.state)));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search by item number, applicant name, or QR code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="stored">Stored</SelectItem>
            <SelectItem value="dispatched">Dispatched</SelectItem>
            <SelectItem value="in-transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {states.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile Card View */}
      {isMobile ? (
        <div className="space-y-3">
          {paginatedData.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No items found</p>
            </Card>
          ) : (
            paginatedData.map((item) => (
              <Card
                key={item.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onItemSelect(item)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="size-4 text-gray-400" />
                      <span className="font-medium">{item.itemNumber}</span>
                    </div>
                    <ItemStatusBadge status={item.status} />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">QR Code</p>
                      <p className="font-mono">{item.qrCode}</p>
                    </div>

                    <div>
                      <p className="text-gray-600">Applicant</p>
                      <p>{item.applicantName}</p>
                      <p className="text-gray-500 flex items-center gap-1">
                        <Phone className="size-3" />
                        {item.applicantPhone}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600">Location</p>
                      <p className="flex items-center gap-1">
                        <MapPin className="size-3 text-gray-400" />
                        <span>{item.lga}, {item.state}</span>
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600">Created</p>
                      <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {showActions && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemSelect(item);
                      }}
                    >
                      View Details
                    </Button>
                  )}
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
                <TableHead>Item Number</TableHead>
                <TableHead>QR Code</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                {showActions && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={showActions ? 7 : 6}
                    className="text-center py-8 text-gray-500"
                  >
                    No items found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => onItemSelect(item)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <QrCode className="size-4 text-gray-400" />
                        {item.itemNumber}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {item.qrCode}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{item.applicantName}</p>
                        <p className="text-gray-500 flex items-center gap-1">
                          <Phone className="size-3" />
                          {item.applicantPhone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3 text-gray-400" />
                        <span>{item.lga}, {item.state}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ItemStatusBadge status={item.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    {showActions && (
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onItemSelect(item);
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    )}
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