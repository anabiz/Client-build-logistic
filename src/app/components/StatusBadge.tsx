import { Badge } from "./ui/badge";

export type ShipmentStatus = "pending" | "in-transit" | "delivered" | "delayed" | "cancelled";

interface StatusBadgeProps {
  status: ShipmentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<ShipmentStatus, { label: string; className: string }> = {
    "pending": {
      label: "Pending",
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    },
    "in-transit": {
      label: "In Transit",
      className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    },
    "delivered": {
      label: "Delivered",
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    "delayed": {
      label: "Delayed",
      className: "bg-red-100 text-red-800 hover:bg-red-100",
    },
    "cancelled": {
      label: "Cancelled",
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    },
  };

  const variant = variants[status];

  return (
    <Badge className={variant.className}>
      {variant.label}
    </Badge>
  );
}
