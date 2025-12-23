import { useState } from "react";
import { Search, Plus, Star, MapPin, Phone, Mail, Truck } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
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
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Rider } from "../types";
import { usePagination } from "../hooks/usePagination";
import { PaginationControls } from "./PaginationControls";
import { RiderDetailModal } from "./RiderDetailModal";
import { useIsMobile } from "./ui/use-mobile";
import { toast } from "sonner";

interface RidersManagementProps {
  riders: Rider[];
  onRiderSelect?: (rider: Rider) => void;
  onCreateRider?: (rider: Omit<Rider, "id">) => void;
  onUpdateRider?: (id: string, rider: Partial<Rider>) => void;
}

export function RidersManagement({ 
  riders, 
  onRiderSelect, 
  onCreateRider,
  onUpdateRider 
}: RidersManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [ridersData, setRidersData] = useState<Rider[]>(riders);
  const isMobile = useIsMobile();

  const filteredRiders = ridersData.filter((rider) => {
    const matchesSearch =
      rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || rider.status === statusFilter;
    const matchesRegion = regionFilter === "all" || rider.region === regionFilter;
    const matchesRating = ratingFilter === "all" || 
      (ratingFilter === "high" && rider.rating >= 4.0) ||
      (ratingFilter === "medium" && rider.rating >= 3.0 && rider.rating < 4.0) ||
      (ratingFilter === "low" && rider.rating < 3.0);

    return matchesSearch && matchesStatus && matchesRegion && matchesRating;
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

  const regions = Array.from(new Set(ridersData.map((rider) => rider.region)));

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 hover:bg-green-100",
      inactive: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      suspended: "bg-red-100 text-red-800 hover:bg-red-100",
    };
    return <Badge className={variants[status as keyof typeof variants] || variants.inactive}>{status.toUpperCase()}</Badge>;
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`size-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const handleCreateRider = (formData: FormData) => {
    const newRider: Rider = {
      id: `R${String(ridersData.length + 1).padStart(3, "0")}`,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      vehicleNumber: formData.get("vehicleNumber") as string,
      region: formData.get("region") as string,
      status: "active",
      rating: 0,
      totalDeliveries: 0,
      successRate: 0,
    };
    setRidersData([...ridersData, newRider]);
    onCreateRider?.(newRider);
    setIsCreateDialogOpen(false);
    toast("Rider created successfully", {
      description: `${newRider.name} has been added to the system.`,
    });
  };

  const handleUpdateRiderStatus = (riderId: string, status: string) => {
    setRidersData(prev => 
      prev.map(rider => 
        rider.id === riderId ? { ...rider, status } : rider
      )
    );
    onUpdateRider?.(riderId, { status });
    toast(`Rider ${status === 'active' ? 'enabled' : 'disabled'} successfully`);
  };

  const handleRiderClick = (rider: Rider) => {
    setSelectedRider(rider);
    onRiderSelect?.(rider);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl mb-1">Riders Management</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Manage delivery riders and their performance
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="size-4" />
              <span className="hidden sm:inline">Add Rider</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Rider</DialogTitle>
              <DialogDescription>
                Create a new rider account for deliveries
              </DialogDescription>
            </DialogHeader>
            <form action={handleCreateRider} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                <Input id="vehicleNumber" name="vehicleNumber" required />
              </div>
              <div>
                <Label htmlFor="region">Region</Label>
                <Select name="region" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Rider</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search riders by name, phone, email, or vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="high">4+ Stars</SelectItem>
            <SelectItem value="medium">3-4 Stars</SelectItem>
            <SelectItem value="low">Below 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {paginatedData.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No riders found</p>
          </Card>
        ) : (
          paginatedData.map((rider) => (
            <Card
              key={rider.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleRiderClick(rider)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Truck className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{rider.name}</h3>
                    <div className="flex items-center gap-1 mb-1">
                      {getRatingStars(rider.rating)}
                      <span className="text-sm text-gray-600 ml-1">
                        ({rider.rating.toFixed(1)})
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {rider.totalDeliveries} deliveries • {rider.successRate.toFixed(1)}% success rate
                    </p>
                  </div>
                </div>
                {getStatusBadge(rider.status)}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-gray-400" />
                  <span>{rider.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-gray-400" />
                  <span className="truncate">{rider.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="size-4 text-gray-400" />
                  <span>{rider.vehicleNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-gray-400" />
                  <span>{rider.region}</span>
                </div>
              </div>
            </Card>
          ))
        )}
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

      {/* Rider Detail Modal */}
      {selectedRider && (
        <RiderDetailModal
          rider={selectedRider}
          onClose={() => setSelectedRider(null)}
          onUpdateStatus={handleUpdateRiderStatus}
        />
      )}
    </div>
  );
}