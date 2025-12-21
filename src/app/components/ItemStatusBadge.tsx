import { ItemStatus } from "../types";
import { Badge } from "./ui/badge";

interface ItemStatusBadgeProps {
  status: ItemStatus;
}

export function ItemStatusBadge({ status }: ItemStatusBadgeProps) {
  const variants: Record<ItemStatus, { label: string; className: string }> = {
    received: {
      label: "Received",
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    },
    stored: {
      label: "Stored",
      className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    },
    dispatched: {
      label: "Dispatched",
      className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    },
    "in-transit": {
      label: "In Transit",
      className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    },
    delivered: {
      label: "Delivered",
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    failed: {
      label: "Failed",
      className: "bg-red-100 text-red-800 hover:bg-red-100",
    },
  };

  const variant = variants[status];

  return <Badge className={variant.className}>{variant.label}</Badge>;
}
