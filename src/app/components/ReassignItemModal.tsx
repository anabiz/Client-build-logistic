import { useState } from "react";
import { X, UserCheck, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Item, Rider, ReassignmentRecord } from "../types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ReassignItemModalProps {
  item: Item;
  currentRider: Rider;
  availableRiders: Rider[];
  onClose: () => void;
  onReassign: (
    itemId: string,
    newRiderId: string,
    reason: string,
    reasonCategory: ReassignmentRecord["reasonCategory"],
    notes?: string
  ) => void;
}

export function ReassignItemModal({
  item,
  currentRider,
  availableRiders,
  onClose,
  onReassign,
}: ReassignItemModalProps) {
  const [selectedRiderId, setSelectedRiderId] = useState("");
  const [reasonCategory, setReasonCategory] = useState<ReassignmentRecord["reasonCategory"]>("other");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const reasonCategories = [
    { value: "rider-unavailable", label: "Rider Unavailable" },
    { value: "vehicle-breakdown", label: "Vehicle Breakdown" },
    { value: "recipient-relocated", label: "Recipient Relocated to Different Area" },
    { value: "performance-issue", label: "Performance Issue" },
    { value: "address-correction", label: "Address Correction Required" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRiderId || !reason.trim()) {
      alert("Please select a rider and provide a reason for reassignment");
      return;
    }
    onReassign(item.id, selectedRiderId, reason, reasonCategory, notes);
    onClose();
  };

  // Filter out current rider from available riders
  const selectableRiders = availableRiders.filter(
    (r) => r.id !== currentRider.id && r.status !== "offline"
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <UserCheck className="size-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl">Reassign Item to New Rider</h2>
              <p className="text-gray-600">Item: {item.itemNumber}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Assignment */}
          <Card className="p-4 bg-gray-50">
            <p className="text-gray-600 mb-2">Currently Assigned To</p>
            <div className="flex items-center justify-between">
              <div>
                <p>{currentRider.name}</p>
                <p className="text-gray-500">{currentRider.email}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Vehicle: {currentRider.vehicleNumber}</p>
                <p className="text-gray-600">Region: {currentRider.region}</p>
              </div>
            </div>
          </Card>

          {/* Reason Category */}
          <div className="space-y-2">
            <Label htmlFor="reasonCategory">Reason Category *</Label>
            <select
              id="reasonCategory"
              className="w-full px-3 py-2 border rounded-md bg-input-background"
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value as ReassignmentRecord["reasonCategory"])}
              required
            >
              {reasonCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Detailed Reason *</Label>
            <Input
              id="reason"
              placeholder="Provide a specific reason for reassignment"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          {/* Select New Rider */}
          <div className="space-y-2">
            <Label htmlFor="newRider">Reassign To *</Label>
            {selectableRiders.length === 0 ? (
              <Card className="p-4 bg-yellow-50 border-yellow-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="size-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-yellow-900">No Available Riders</p>
                    <p className="text-yellow-700">
                      There are no other riders currently available for reassignment.
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <select
                id="newRider"
                className="w-full px-3 py-2 border rounded-md bg-input-background"
                value={selectedRiderId}
                onChange={(e) => setSelectedRiderId(e.target.value)}
                required
              >
                <option value="">Select a rider</option>
                {selectableRiders.map((rider) => (
                  <option key={rider.id} value={rider.id}>
                    {rider.name} - {rider.region} (Success: {rider.successRate}%) -{" "}
                    {rider.status === "available" ? "Available" : "On Delivery"}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <textarea
              id="notes"
              className="w-full px-3 py-2 border rounded-md bg-input-background min-h-[80px]"
              placeholder="Any additional context or instructions for the new rider..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Warning */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="size-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-blue-900">Reassignment Notice</p>
                <p className="text-blue-700">
                  This reassignment will be logged in the audit trail and the new rider will be
                  notified via SMS and email. The previous rider will also be notified of the change.
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedRiderId || !reason.trim() || selectableRiders.length === 0}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <UserCheck className="size-4" />
              Confirm Reassignment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
