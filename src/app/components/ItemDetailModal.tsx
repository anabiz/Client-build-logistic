import { X, Package, MapPin, User, Phone, Mail, Calendar, QrCode as QrCodeIcon, Truck, CheckCircle, AlertCircle, Camera, FileSignature, UserCheck, History, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ItemStatusBadge } from "./ItemStatusBadge";
import { Separator } from "./ui/separator";
import { Item } from "../types";
import { mockRiders, mockDeliveries } from "../data/mockData";
import { useState } from "react";
import { ReassignItemModal } from "./ReassignItemModal";

interface ItemDetailModalProps {
  item: Item;
  onClose: () => void;
  onReassign?: (
    itemId: string,
    newRiderId: string,
    reason: string,
    reasonCategory: any,
    notes?: string
  ) => void;
  currentUserRole?: string;
}

export function ItemDetailModal({ item, onClose, onReassign, currentUserRole }: ItemDetailModalProps) {
  const rider = item.riderId ? mockRiders.find((r) => r.id === item.riderId) : null;
  const delivery = mockDeliveries.find((d) => d.itemId === item.id);

  const timeline = [
    {
      status: "received",
      label: "Item Received",
      date: item.createdAt,
      completed: true,
    },
    {
      status: "stored",
      label: "Stored at Hub",
      date: item.createdAt,
      completed: item.status !== "received",
    },
    {
      status: "dispatched",
      label: "Dispatched",
      date: item.dispatchedAt,
      completed: ["dispatched", "in-transit", "delivered"].includes(item.status),
    },
    {
      status: "in-transit",
      label: "In Transit",
      date: item.dispatchedAt,
      completed: ["in-transit", "delivered"].includes(item.status),
    },
    {
      status: "delivered",
      label: "Delivered",
      date: item.deliveredAt,
      completed: item.status === "delivered",
    },
  ];

  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-1">Item Details</h2>
            <p className="text-gray-600">{item.itemNumber}</p>
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
                <ItemStatusBadge status={item.status} />
              </div>
              {item.estimatedDelivery && (
                <div className="text-right">
                  <p className="text-gray-600 mb-1">Estimated Delivery</p>
                  <p>{new Date(item.estimatedDelivery).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </Card>

          {/* QR Code Display */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">QR Code</p>
                <p className="text-2xl font-mono">{item.qrCode}</p>
                <p className="text-gray-500 mt-2">Scan this code for verification</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <QrCodeIcon className="size-24 text-gray-800" />
              </div>
            </div>
          </Card>

          {/* Item Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2">
                <User className="size-5 text-gray-600" />
                Applicant Information
              </h3>
              <div className="space-y-3 pl-7">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p>{item.applicantName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="flex items-center gap-2">
                    <Phone className="size-4 text-gray-400" />
                    {item.applicantPhone}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="flex items-center gap-2">
                    <Mail className="size-4 text-gray-400" />
                    {item.applicantEmail}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="flex items-center gap-2">
                <MapPin className="size-5 text-gray-600" />
                Delivery Address
              </h3>
              <div className="space-y-3 pl-7">
                <div>
                  <p className="text-gray-600">Address</p>
                  <p>{item.deliveryAddress}</p>
                </div>
                <div>
                  <p className="text-gray-600">LGA</p>
                  <p>{item.lga}</p>
                </div>
                <div>
                  <p className="text-gray-600">State</p>
                  <p>{item.state}</p>
                </div>
              </div>
            </div>
          </div>

          {rider && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="flex items-center gap-2">
                  <Truck className="size-5 text-gray-600" />
                  Assigned Rider
                </h3>
                <Card className="p-4 bg-gray-50">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p>{rider.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p>{rider.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Vehicle</p>
                      <p>{rider.vehicleNumber}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}

          <Separator />

          {/* Timeline */}
          <div>
            <h3 className="flex items-center gap-2 mb-4">
              <Calendar className="size-5 text-gray-600" />
              Delivery Timeline
            </h3>
            <div className="pl-7 space-y-4">
              {timeline.map((event, index) => (
                <div key={index} className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`size-3 rounded-full ${
                        event.completed
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    {index < timeline.length - 1 && (
                      <div
                        className={`w-0.5 h-16 ${
                          event.completed ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <p className={!event.completed ? "text-gray-400" : ""}>
                      {event.label}
                    </p>
                    {event.date && (
                      <p className="text-gray-500">
                        {new Date(event.date).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {item.status === "failed" && (
            <>
              <Separator />
              <Card className="p-4 bg-red-50 border-red-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-red-900 mb-1">Delivery Failed</p>
                    <p className="text-red-700">
                      Recipient not available - incorrect address
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* Proof of Delivery - Only show for delivered items */}
          {item.status === "delivered" && delivery?.proofOfDelivery && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="flex items-center gap-2">
                  <CheckCircle className="size-5 text-green-600" />
                  Proof of Delivery (POD)
                </h3>
                <Card className="p-6 bg-green-50 border-green-200">
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-600 mb-1">Delivered To</p>
                        <p className="text-lg">{delivery.proofOfDelivery.recipientName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Delivery Time</p>
                        <p className="text-lg">
                          {new Date(delivery.proofOfDelivery.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-green-200" />

                    <div>
                      <p className="text-gray-600 mb-2 flex items-center gap-2">
                        <MapPin className="size-4" />
                        GPS Coordinates
                      </p>
                      <p className="font-mono bg-white px-3 py-2 rounded border border-green-200">
                        {delivery.proofOfDelivery.gpsLocation}
                      </p>
                      <p className="text-gray-500 mt-1">
                        Location verified and logged for audit trail
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 mb-2 flex items-center gap-2">
                          <FileSignature className="size-4" />
                          Digital Signature
                        </p>
                        <Card className="p-4 bg-white border border-green-200">
                          <div className="h-24 flex items-center justify-center bg-gray-50 rounded">
                            <p className="text-gray-400 italic">Signature captured</p>
                          </div>
                        </Card>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-2 flex items-center gap-2">
                          <Camera className="size-4" />
                          Delivery Photo
                        </p>
                        <Card className="p-4 bg-white border border-green-200">
                          <div className="h-24 flex items-center justify-center bg-gray-50 rounded">
                            <Camera className="size-8 text-gray-400" />
                          </div>
                        </Card>
                      </div>
                    </div>

                    <Card className="p-3 bg-white border-green-200">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="size-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-green-900">Verified Delivery</p>
                          <p className="text-green-700">
                            All proof of delivery requirements met. Delivery record is immutable and stored securely.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </Card>
              </div>
            </>
          )}

          {/* Reassignment History */}
          {delivery?.reassignmentHistory && delivery.reassignmentHistory.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="flex items-center gap-2">
                  <History className="size-5 text-orange-600" />
                  Reassignment History
                </h3>
                <Card className="p-4 bg-orange-50 border-orange-200">
                  <div className="space-y-4">
                    {delivery.reassignmentHistory.map((record, index) => (
                      <div key={record.id}>
                        {index > 0 && <Separator className="my-4" />}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="bg-orange-100 px-3 py-1 rounded">
                                <p className="text-orange-900">Reassignment #{index + 1}</p>
                              </div>
                              <p className="text-gray-500">
                                {new Date(record.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-gray-600 mb-1">From Rider</p>
                              <div className="bg-white px-3 py-2 rounded border">
                                <p>{record.fromRiderName}</p>
                                <p className="text-gray-500">ID: {record.fromRiderId}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-center">
                              <ArrowRight className="size-6 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-gray-600 mb-1">To Rider</p>
                              <div className="bg-white px-3 py-2 rounded border border-green-500">
                                <p>{record.toRiderName}</p>
                                <p className="text-gray-500">ID: {record.toRiderId}</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded border">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-600 mb-1">Reason Category</p>
                                <div className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                  {record.reasonCategory.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-600 mb-1">Reassigned By</p>
                                <p>{record.reassignedByName}</p>
                              </div>
                            </div>

                            <div className="mt-3">
                              <p className="text-gray-600 mb-1">Reason</p>
                              <p>{record.reason}</p>
                            </div>

                            {record.notes && (
                              <div className="mt-3 p-2 bg-gray-50 rounded">
                                <p className="text-gray-600 mb-1">Additional Notes</p>
                                <p className="text-gray-700 italic">{record.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            <QrCodeIcon className="size-4" />
            Print QR Label
          </Button>
          {(currentUserRole === "super-admin" || currentUserRole === "operations-manager") && rider && !["delivered", "failed"].includes(item.status) && (
            <Button
              variant="outline"
              className="border-orange-500 text-orange-600 hover:bg-orange-50"
              onClick={() => setIsReassignModalOpen(true)}
            >
              <UserCheck className="size-4" />
              Reassign Rider
            </Button>
          )}
        </div>
      </Card>

      {isReassignModalOpen && rider && onReassign && (
        <ReassignItemModal
          item={item}
          currentRider={rider}
          availableRiders={mockRiders}
          onClose={() => setIsReassignModalOpen(false)}
          onReassign={onReassign}
        />
      )}
    </div>
  );
}