import { useState } from "react";
import { Truck, MapPin, User, Star, Package } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
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
} from "./ui/dialog";
import { Item, Rider, Hub } from "../types";
import { ItemStatusBadge } from "./ItemStatusBadge";

interface DispatchManagementProps {
  items: Item[];
  riders: Rider[];
  hubs: Hub[];
}

export function DispatchManagement({ items, riders, hubs }: DispatchManagementProps) {
  const [selectedHub, setSelectedHub] = useState<string>("all");
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedRider, setSelectedRider] = useState<string>("");

  const pendingItems = items.filter(
    (item) => item.status === "stored" || item.status === "received"
  );

  const filteredItems =
    selectedHub === "all"
      ? pendingItems
      : pendingItems.filter((item) => item.hubId === selectedHub);

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
      <div>
        <h2 className="text-2xl mb-1">Dispatch Management</h2>
        <p className="text-gray-600">
          Assign items to hubs and riders for delivery
        </p>
      </div>

      {/* Hub Overview */}
      <div className="grid md:grid-cols-3 gap-4">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {riders.map((rider) => (
            <Card key={rider.id} className="p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Truck className="size-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm">{rider.name}</p>
                    <p className="text-gray-600">{rider.vehicleNumber}</p>
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
        <div className="flex items-center justify-between mb-4">
          <h3>Pending Assignment</h3>
          <Select value={selectedHub} onValueChange={setSelectedHub}>
            <SelectTrigger className="w-[200px]">
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

        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <Package className="size-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No pending items</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className="p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p>{item.itemNumber}</p>
                      <ItemStatusBadge status={item.status} />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
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
                  >
                    Assign Rider
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

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
