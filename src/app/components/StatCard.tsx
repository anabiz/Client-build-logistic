import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: string;
  bgColor?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = "text-blue-600",
  bgColor = "bg-blue-50",
}: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-600 mb-1">{title}</p>
          <p className="text-3xl">{value}</p>
          {trend && (
            <p
              className={`mt-2 ${
                trendUp ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend}
            </p>
          )}
        </div>
        <div className={`${bgColor} ${color} p-3 rounded-lg`}>
          <Icon className="size-6" />
        </div>
      </div>
    </Card>
  );
}
