import { useState } from "react";
import { X, Star, MapPin, Phone, Mail, Truck, Calendar, Award, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Rider } from "../types";

interface RiderDetailModalProps {
  rider: Rider;
  onClose: () => void;
  onUpdateStatus: (riderId: string, status: string) => void;
}

export function RiderDetailModal({ rider, onClose, onUpdateStatus }: RiderDetailModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

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

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 hover:bg-green-100",
      inactive: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      suspended: "bg-red-100 text-red-800 hover:bg-red-100",
    };
    return <Badge className={variants[status as keyof typeof variants] || variants.inactive}>{status.toUpperCase()}</Badge>;
  };

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    const newStatus = rider.status === "active" ? "inactive" : "active";
    onUpdateStatus(rider.id, newStatus);
    setIsUpdating(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{rider.name}</DialogTitle>
              <DialogDescription>Rider Details and Performance</DialogDescription>
            </div>
            {getStatusBadge(rider.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Truck className="size-4" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{rider.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{rider.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="size-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Vehicle Number</p>
                  <p className="font-medium">{rider.vehicleNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Region</p>
                  <p className="font-medium">{rider.region}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card className="p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Award className="size-4" />
              Performance Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {getRatingStars(rider.rating)}
                </div>
                <p className="text-2xl font-bold text-blue-600">{rider.rating.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <TrendingUp className="size-6 text-green-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-green-600">{rider.totalDeliveries}</p>
                <p className="text-sm text-gray-600">Total Deliveries</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Award className="size-6 text-purple-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-purple-600">{rider.successRate.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Calendar className="size-4" />
              Recent Activity
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b">
                <span>Last delivery completed</span>
                <span className="text-gray-600">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Items delivered today</span>
                <span className="text-gray-600">8 items</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Average delivery time</span>
                <span className="text-gray-600">45 minutes</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Status since</span>
                <span className="text-gray-600">Jan 15, 2024</span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button
                variant={rider.status === "active" ? "destructive" : "default"}
                onClick={handleStatusToggle}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : rider.status === "active" ? "Disable Rider" : "Enable Rider"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}