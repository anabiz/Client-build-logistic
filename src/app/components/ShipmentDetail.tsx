import { X, Package, MapPin, Calendar, Weight, User, Phone, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { StatusBadge, ShipmentStatus } from "./StatusBadge";
import { Separator } from "./ui/separator";

interface TimelineEvent {
  date: string;
  time: string;
  location: string;
  description: string;
  status: "completed" | "current" | "pending";
}

interface ShipmentDetailProps {
  shipment: {
    id: string;
    trackingNumber: string;
    origin: string;
    destination: string;
    status: ShipmentStatus;
    estimatedDelivery: string;
    customer: string;
    weight: string;
    dimensions?: string;
    customerEmail?: string;
    customerPhone?: string;
    notes?: string;
  };
  onClose: () => void;
}

export function ShipmentDetail({ shipment, onClose }: ShipmentDetailProps) {
  // Mock timeline data
  const timeline: TimelineEvent[] = [
    {
      date: "Dec 18, 2024",
      time: "09:00 AM",
      location: shipment.origin,
      description: "Package picked up",
      status: "completed",
    },
    {
      date: "Dec 19, 2024",
      time: "02:30 PM",
      location: "Distribution Center - Chicago",
      description: "In transit to distribution center",
      status: "completed",
    },
    {
      date: "Dec 20, 2024",
      time: "11:15 AM",
      location: "Regional Hub - Boston",
      description: "Arrived at regional hub",
      status: shipment.status === "delivered" ? "completed" : "current",
    },
    {
      date: "Dec 21, 2024",
      time: "Expected",
      location: shipment.destination,
      description: "Out for delivery",
      status: shipment.status === "delivered" ? "completed" : "pending",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-1">Shipment Details</h2>
            <p className="text-gray-600">{shipment.trackingNumber}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Card */}
          <Card className="p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Current Status</p>
                <StatusBadge status={shipment.status} />
              </div>
              <div className="text-right">
                <p className="text-gray-600 mb-1">Estimated Delivery</p>
                <p>{shipment.estimatedDelivery}</p>
              </div>
            </div>
          </Card>

          {/* Shipment Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2">
                <Package className="size-5 text-gray-600" />
                Package Information
              </h3>
              <div className="space-y-3 pl-7">
                <div>
                  <p className="text-gray-600">Weight</p>
                  <p>{shipment.weight}</p>
                </div>
                {shipment.dimensions && (
                  <div>
                    <p className="text-gray-600">Dimensions</p>
                    <p>{shipment.dimensions}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="flex items-center gap-2">
                <User className="size-5 text-gray-600" />
                Customer Information
              </h3>
              <div className="space-y-3 pl-7">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p>{shipment.customer}</p>
                </div>
                {shipment.customerEmail && (
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="flex items-center gap-2">
                      <Mail className="size-4 text-gray-400" />
                      {shipment.customerEmail}
                    </p>
                  </div>
                )}
                {shipment.customerPhone && (
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="flex items-center gap-2">
                      <Phone className="size-4 text-gray-400" />
                      {shipment.customerPhone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Route Information */}
          <div>
            <h3 className="flex items-center gap-2 mb-4">
              <MapPin className="size-5 text-gray-600" />
              Route
            </h3>
            <div className="grid md:grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-gray-600">Origin</p>
                <p>{shipment.origin}</p>
              </div>
              <div>
                <p className="text-gray-600">Destination</p>
                <p>{shipment.destination}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div>
            <h3 className="flex items-center gap-2 mb-4">
              <Calendar className="size-5 text-gray-600" />
              Tracking Timeline
            </h3>
            <div className="pl-7 space-y-4">
              {timeline.map((event, index) => (
                <div key={index} className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`size-3 rounded-full ${
                        event.status === "completed"
                          ? "bg-green-500"
                          : event.status === "current"
                          ? "bg-orange-500"
                          : "bg-gray-300"
                      }`}
                    />
                    {index < timeline.length - 1 && (
                      <div
                        className={`w-0.5 h-16 ${
                          event.status === "completed" ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-start justify-between mb-1">
                      <p className={event.status === "pending" ? "text-gray-400" : ""}>
                        {event.description}
                      </p>
                      <span className="text-gray-600 whitespace-nowrap ml-4">
                        {event.time}
                      </span>
                    </div>
                    <p className="text-gray-600">{event.location}</p>
                    <p className="text-gray-500">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {shipment.notes && (
            <>
              <Separator />
              <div>
                <h3 className="mb-2">Notes</h3>
                <p className="text-gray-600">{shipment.notes}</p>
              </div>
            </>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>Print Label</Button>
        </div>
      </Card>
    </div>
  );
}
