import { useState } from "react";
import { Search, QrCode, Package, MapPin, Calendar, Truck, Phone, Mail } from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ItemStatusBadge } from "./ItemStatusBadge";
import { Item } from "../types";
import { Separator } from "./ui/separator";

interface ApplicantTrackingProps {
  items: Item[];
}

export function ApplicantTracking({ items }: ApplicantTrackingProps) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackedItem, setTrackedItem] = useState<Item | null>(null);

  const handleTrack = () => {
    const item = items.find(
      (i) =>
        i.itemNumber.toLowerCase() === trackingNumber.toLowerCase() ||
        i.qrCode.toLowerCase() === trackingNumber.toLowerCase()
    );
    setTrackedItem(item || null);
  };

  const timeline = trackedItem
    ? [
        {
          label: "Item Received",
          completed: true,
          date: trackedItem.createdAt,
        },
        {
          label: "Stored at Hub",
          completed: trackedItem.status !== "received",
          date: trackedItem.createdAt,
        },
        {
          label: "Dispatched",
          completed: ["dispatched", "in-transit", "delivered"].includes(
            trackedItem.status
          ),
          date: trackedItem.dispatchedAt,
        },
        {
          label: "Out for Delivery",
          completed: ["in-transit", "delivered"].includes(trackedItem.status),
          date: trackedItem.dispatchedAt,
        },
        {
          label: "Delivered",
          completed: trackedItem.status === "delivered",
          date: trackedItem.deliveredAt,
        },
      ]
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Section */}
      <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-3xl mb-3">Track Your Delivery</h1>
          <p className="text-gray-600 mb-6">
            Enter your tracking number or QR code to view your delivery status
          </p>
          <div className="flex gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                placeholder="Enter tracking number (e.g., CB-2024-000001)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                className="pl-10 h-12"
              />
            </div>
            <Button onClick={handleTrack} size="lg">
              Track Item
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {trackedItem ? (
        <div className="space-y-6">
          {/* Status Overview */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl mb-2">Tracking Information</h2>
                <p className="text-gray-600">{trackedItem.itemNumber}</p>
              </div>
              <ItemStatusBadge status={trackedItem.status} />
            </div>

            {trackedItem.estimatedDelivery && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-3">
                  <Calendar className="size-5 text-blue-600" />
                  <div>
                    <p className="text-blue-900">Estimated Delivery</p>
                    <p className="text-blue-700">
                      {new Date(trackedItem.estimatedDelivery).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </Card>

          {/* QR Code */}
          <Card className="p-6">
            <h3 className="mb-4">Your QR Code</h3>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-gray-600 mb-1">Show this code to the rider</p>
                <p className="text-2xl font-mono">{trackedItem.qrCode}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <QrCode className="size-24 text-gray-800" />
              </div>
            </div>
          </Card>

          {/* Delivery Details */}
          <Card className="p-6">
            <h3 className="mb-4">Delivery Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-2">Delivery Address</p>
                <p className="flex items-start gap-2">
                  <MapPin className="size-4 text-gray-400 mt-1" />
                  <span>
                    {trackedItem.deliveryAddress}
                    <br />
                    {trackedItem.lga}, {trackedItem.state}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Recipient</p>
                <p>{trackedItem.applicantName}</p>
                <p className="text-gray-500 flex items-center gap-1 mt-1">
                  <Phone className="size-3" />
                  {trackedItem.applicantPhone}
                </p>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h3 className="mb-6">Tracking Timeline</h3>
            <div className="space-y-4">
              {timeline.map((event, index) => (
                <div key={index} className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`size-4 rounded-full ${
                        event.completed ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    {index < timeline.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 min-h-12 ${
                          event.completed ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p
                      className={`mb-1 ${
                        !event.completed ? "text-gray-400" : ""
                      }`}
                    >
                      {event.label}
                    </p>
                    {event.date && event.completed && (
                      <p className="text-gray-500">
                        {new Date(event.date).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Support */}
          <Card className="p-6 bg-gray-50">
            <h3 className="mb-3">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Contact our support team for assistance with your delivery
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="size-4" />
                Call Support: +234 800 CLIENT BUILD
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="size-4" />
                Email: support@clientbuild.ng
              </Button>
            </div>
          </Card>
        </div>
      ) : trackingNumber && !trackedItem ? (
        <Card className="p-8 text-center">
          <Package className="size-16 text-gray-400 mx-auto mb-4" />
          <h3 className="mb-2">Item Not Found</h3>
          <p className="text-gray-600">
            We couldn't find an item with tracking number "{trackingNumber}".
            <br />
            Please check the number and try again.
          </p>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <Package className="size-16 text-gray-400 mx-auto mb-4" />
          <h3 className="mb-2">Start Tracking</h3>
          <p className="text-gray-600">
            Enter your tracking number above to view your delivery status
          </p>
        </Card>
      )}
    </div>
  );
}
