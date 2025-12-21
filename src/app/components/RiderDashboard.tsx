import { useState } from "react";
import { MapPin, Package, Navigation, Camera, CheckCircle, Phone } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { StatCard } from "./StatCard";
import { ItemStatusBadge } from "./ItemStatusBadge";
import { Item, Rider } from "../types";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface RiderDashboardProps {
  rider: Rider;
  assignedItems: Item[];
}

export function RiderDashboard({ rider, assignedItems }: RiderDashboardProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const pendingDeliveries = assignedItems.filter(
    (item) => item.status === "dispatched" || item.status === "in-transit"
  );
  const completedToday = assignedItems.filter(
    (item) => item.status === "delivered"
  ).length;

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

      {/* Assigned Deliveries */}
      <div>
        <h3 className="text-xl mb-4">Assigned Deliveries</h3>
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
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4>{item.itemNumber}</h4>
                      <ItemStatusBadge status={item.status} />
                    </div>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-center gap-2">
                        <Package className="size-4" />
                        <span className="font-mono text-sm">{item.qrCode}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="size-4" />
                        {item.deliveryAddress}, {item.lga}, {item.state}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleStartDelivery(item)}
                    className="flex items-center gap-2"
                  >
                    <Navigation className="size-4" />
                    Start Delivery
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div>
                    <p className="text-gray-600">Recipient</p>
                    <p>{item.applicantName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Contact</p>
                    <p className="flex items-center gap-1">
                      <Phone className="size-3" />
                      {item.applicantPhone}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

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
