import { useState } from "react";
import { Truck, MapPin, User, Star, Package, Plus } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
import { Item, Rider, Hub } from "../types";
import { ItemStatusBadge } from "./ItemStatusBadge";
import { usePagination } from "../hooks/usePagination";
import { PaginationControls } from "./PaginationControls";

interface DispatchManagementProps {
  items: Item[];
  riders: Rider[];
  hubs: Hub[];
  onAddHub?: (hub: Omit<Hub, "id">) => void;
  onReassignItem?: (
    itemId: string,
    newRiderId: string,
    reason: string,
    reasonCategory: any,
    notes?: string
  ) => void;
}

export function DispatchManagement({ items, riders, hubs, onAddHub, onReassignItem }: DispatchManagementProps) {
  const [selectedHub, setSelectedHub] = useState<string>("all");
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [addHubModalOpen, setAddHubModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedRider, setSelectedRider] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // New hub form state
  const [newHub, setNewHub] = useState({
    name: "",
    state: "",
    address: "",
    manager: "",
    capacity: 1000,
    currentLoad: 0,
  });

  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
    "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
    "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
    "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
    "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ];

  const pendingItems = items.filter(
    (item) => item.status === "stored" || item.status === "received"
  );

  const filteredItems =
    selectedHub === "all"
      ? pendingItems
      : pendingItems.filter((item) => item.hubId === selectedHub);

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

  const availableRiders = riders.filter((rider) => rider.status === "available");

  const handleAssignRider = (item: Item) => {
    setSelectedItem(item);
    setAssignModalOpen(true);
  };

  const handleConfirmAssignment = () => {
    setAssignModalOpen(false);
    setSelectedItem(null);
    setSelectedRider("");
  };

  const handleAddHub = () => {
    if (onAddHub && newHub.name && newHub.state && newHub.address && newHub.manager) {
      onAddHub(newHub);
      setNewHub({
        name: "",
        state: "",
        address: "",
        manager: "",
        capacity: 1000,
        currentLoad: 0,
      });
      setAddHubModalOpen(false);
    }
  };

  const getRiderStatusBadge = (status: Rider["status"]) => {
    const variants = {
      available: "bg-green-100 text-green-800 hover:bg-green-100",
      "on-delivery": "bg-orange-100 text-orange-800 hover:bg-orange-100",
      offline: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    };
    return <Badge className={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl mb-1">Dispatch Management</h2>
          <p className="text-gray-600">
            Assign items to hubs and riders for delivery
          </p>
        </div>
        {onAddHub && (
          <Button onClick={() => setAddHubModalOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
            <Plus className="size-4" />
            Add New Hub
          </Button>
        )}
      </div>

      {/* Hub Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hubs.map((hub) => (
          <Card key={hub.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <MapPin className="size-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="mb-1">{hub.name}</h3>
                  <p className="text-gray-600">{hub.state}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Manager</span>
                <span>{hub.manager}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Capacity</span>
                <span>
                  {hub.currentLoad} / {hub.capacity}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${(hub.currentLoad / hub.capacity) * 100}%`,
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Available Riders */}
      <Card className="p-6">
        <h3 className="mb-4">Available Riders</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {riders.map((rider) => (
            <Card key={rider.id} className="p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Truck className="size-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm">{rider.name}</p>
                    <p className="text-xs text-gray-600">{rider.vehicleNumber}</p>
                  </div>
                </div>
                {getRiderStatusBadge(rider.status)}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="size-4 text-yellow-500" />
                <span>{rider.rating}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">
                  {rider.totalDeliveries} deliveries
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Pending Items */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <h3>Pending Assignment</h3>
          <Select value={selectedHub} onValueChange={setSelectedHub}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by hub" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hubs</SelectItem>
              {hubs.map((hub) => (
                <SelectItem key={hub.id} value={hub.id}>
                  {hub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {totalItems === 0 ? (
          <div className="text-center py-8">
            <Package className="size-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No pending items</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedData.map((item) => (
                <Card key={item.id} className="p-4 bg-gray-50">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
                        <p>{item.itemNumber}</p>
                        <ItemStatusBadge status={item.status} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Applicant</p>
                          <p>{item.applicantName}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Location</p>
                          <p>
                            {item.lga}, {item.state}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Hub</p>
                          <p>
                            {hubs.find((h) => h.id === item.hubId)?.name || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAssignRider(item)}
                      disabled={availableRiders.length === 0}
                      className="w-full sm:w-auto"
                    >
                      Assign Rider
                    </Button>
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
          </>
        )}
      </Card>

      {/* Add Hub Modal */}
      <Dialog open={addHubModalOpen} onOpenChange={setAddHubModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Hub</DialogTitle>
            <DialogDescription>
              Create a new regional hub for item distribution
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hubName">Hub Name *</Label>
                <Input
                  id="hubName"
                  placeholder="e.g., Kano Regional Hub"
                  value={newHub.name}
                  onChange={(e) => setNewHub({ ...newHub, name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="hubState">State *</Label>
                <Select
                  value={newHub.state}
                  onValueChange={(value) => setNewHub({ ...newHub, state: value })}
                >
                  <SelectTrigger id="hubState" className="mt-2">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {nigerianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="hubAddress">Address *</Label>
              <Input
                id="hubAddress"
                placeholder="e.g., Plot 15, Industrial Area, Kano"
                value={newHub.address}
                onChange={(e) => setNewHub({ ...newHub, address: e.target.value })}
                className="mt-2"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hubManager">Manager Name *</Label>
                <Input
                  id="hubManager"
                  placeholder="e.g., Abubakar Ibrahim"
                  value={newHub.manager}
                  onChange={(e) => setNewHub({ ...newHub, manager: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="hubCapacity">Storage Capacity *</Label>
                <Input
                  id="hubCapacity"
                  type="number"
                  placeholder="1000"
                  value={newHub.capacity}
                  onChange={(e) => setNewHub({ ...newHub, capacity: parseInt(e.target.value) || 0 })}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setAddHubModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddHub}
                disabled={!newHub.name || !newHub.state || !newHub.address || !newHub.manager}
              >
                <Plus className="size-4 mr-2" />
                Create Hub
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assignment Modal */}
      {selectedItem && (
        <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assign Rider to Delivery</DialogTitle>
              <DialogDescription>
                Assign a rider to deliver {selectedItem.itemNumber}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Card className="p-4 bg-gray-50">
                <p className="text-gray-600 mb-2">Item Details</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Applicant</p>
                    <p>{selectedItem.applicantName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p>
                      {selectedItem.deliveryAddress}, {selectedItem.state}
                    </p>
                  </div>
                </div>
              </Card>

              <div>
                <p className="mb-3">Select Rider</p>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {availableRiders.map((rider) => (
                    <Card
                      key={rider.id}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedRider === rider.id
                          ? "border-blue-500 bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedRider(rider.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-100 p-2 rounded-lg">
                            <Truck className="size-5 text-orange-600" />
                          </div>
                          <div>
                            <p>{rider.name}</p>
                            <p className="text-gray-600">
                              {rider.vehicleNumber} • {rider.region}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="size-4 text-yellow-500" />
                            <span>{rider.rating}</span>
                          </div>
                          <p className="text-gray-600">
                            {rider.totalDeliveries} deliveries
                          </p>
                          <p className="text-green-600">
                            {rider.successRate}% success
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setAssignModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmAssignment}
                  disabled={!selectedRider}
                >
                  Confirm Assignment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}