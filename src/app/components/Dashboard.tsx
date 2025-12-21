import { Package, TruckIcon, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "./ui/card";

interface DashboardProps {
  stats: {
    total: number;
    inTransit: number;
    delivered: number;
    delayed: number;
  };
}

export function Dashboard({ stats }: DashboardProps) {
  const cards = [
    {
      title: "Total Shipments",
      value: stats.total,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "In Transit",
      value: stats.inTransit,
      icon: TruckIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Delivered",
      value: stats.delivered,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Delayed",
      value: stats.delayed,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 mb-2">{card.title}</p>
                <p className="text-3xl">{card.value}</p>
              </div>
              <div className={`${card.bgColor} ${card.color} p-3 rounded-lg`}>
                <Icon className="size-6" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
