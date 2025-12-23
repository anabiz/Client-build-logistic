import { useState } from "react";
import { Upload, FileText, Calendar, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Batch } from "../types";
import { usePagination } from "../hooks/usePagination";
import { PaginationControls } from "./PaginationControls";

interface BatchManagementProps {
  batches: Batch[];
  onBatchSelect: (batch: Batch) => void;
}

export function BatchManagement({ batches, onBatchSelect }: BatchManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    paginatedData,
    currentPage,
    totalPages,
    goToPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: batches,
    itemsPerPage,
  });

  const getStatusBadge = (status: Batch["status"]) => {
    const variants = {
      processing: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      ready: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      dispatched: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      completed: "bg-green-100 text-green-800 hover:bg-green-100",
    };
    return <Badge className={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Batch Management</h2>
          <p className="text-gray-600">Upload and manage item batches</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Upload className="size-4" />
              Upload New Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Batch</DialogTitle>
              <DialogDescription>
                Upload a CSV file containing item details or enter them manually
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="batchFile">Upload CSV File</Label>
                <Input
                  id="batchFile"
                  type="file"
                  accept=".csv,.xlsx"
                  className="mt-2"
                />
                <p className="text-gray-500 mt-1">
                  Expected columns: Applicant Name, Phone, Email, Address, State, LGA
                </p>
              </div>
              <div>
                <Label htmlFor="description">Batch Description</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., December Distribution - Lagos Zone"
                  className="mt-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Upload Batch
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {paginatedData.map((batch) => (
          <Card
            key={batch.id}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onBatchSelect(batch)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Package className="size-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="mb-1">{batch.batchNumber}</h3>
                  <p className="text-gray-600">{batch.description}</p>
                </div>
              </div>
              {getStatusBadge(batch.status)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pl-0 sm:pl-11">
              <div>
                <p className="text-gray-600">Total Items</p>
                <p>{batch.totalItems}</p>
              </div>
              <div>
                <p className="text-gray-600">Uploaded By</p>
                <p>{batch.uploadedBy}</p>
              </div>
              <div>
                <p className="text-gray-600">Upload Date</p>
                <p>{new Date(batch.uploadedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

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