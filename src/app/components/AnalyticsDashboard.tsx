import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, Package, CheckCircle, Clock, XCircle } from "lucide-react";
import { StatCard } from "./StatCard";
import { Item } from "../types";

interface AnalyticsDashboardProps {
  items: Item[];
}

export function AnalyticsDashboard({ items }: AnalyticsDashboardProps) {
  // Calculate statistics
  const totalItems = items.length;
  const delivered = items.filter((i) => i.status === "delivered").length;
  const inTransit = items.filter((i) => i.status === "in-transit").length;
  const pending = items.filter(
    (i) => i.status === "received" || i.status === "stored" || i.status === "dispatched"
  ).length;
  const failed = items.filter((i) => i.status === "failed").length;
  const deliveryRate = totalItems > 0 ? ((delivered / totalItems) * 100).toFixed(1) : "0";

  // Status distribution data
  const statusData = [
    { name: "Delivered", value: delivered, color: "#10b981" },
    { name: "In Transit", value: inTransit, color: "#f97316" },
    { name: "Pending", value: pending, color: "#3b82f6" },
    { name: "Failed", value: failed, color: "#ef4444" },
  ];

  // State-wise distribution
  const stateStats = items.reduce((acc, item) => {
    acc[item.state] = (acc[item.state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stateData = Object.entries(stateStats).map(([state, count]) => ({
    state,
    count,
  }));

  // Daily delivery trend (mock data for demonstration)
  const trendData = [
    { date: "Dec 15", deliveries: 45, failed: 2 },
    { date: "Dec 16", deliveries: 52, failed: 3 },
    { date: "Dec 17", deliveries: 48, failed: 1 },
    { date: "Dec 18", deliveries: 61, failed: 4 },
    { date: "Dec 19", deliveries: 55, failed: 2 },
    { date: "Dec 20", deliveries: 58, failed: 1 },
    { date: "Dec 21", deliveries: 42, failed: 3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">Analytics & Reports</h2>
        <p className="text-gray-600">
          Comprehensive insights into delivery performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Items"
          value={totalItems}
          icon={Package}
          color="text-blue-600"
          bgColor="bg-blue-50"
          trend="+12% from last week"
          trendUp={true}
        />
        <StatCard
          title="Delivered"
          value={delivered}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-50"
          trend={`${deliveryRate}% success rate`}
          trendUp={true}
        />
        <StatCard
          title="In Transit"
          value={inTransit}
          icon={Clock}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
        <StatCard
          title="Failed"
          value={failed}
          icon={XCircle}
          color="text-red-600"
          bgColor="bg-red-50"
          trend="-5% from last week"
          trendUp={true}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Delivery Trend */}
        <Card className="p-6">
          <h3 className="mb-4">Daily Delivery Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="deliveries"
                stroke="#10b981"
                strokeWidth={2}
                name="Successful"
              />
              <Line
                type="monotone"
                dataKey="failed"
                stroke="#ef4444"
                strokeWidth={2}
                name="Failed"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Status Distribution */}
        <Card className="p-6">
          <h3 className="mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* State-wise Performance */}
      <Card className="p-6">
        <h3 className="mb-4">State-wise Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stateData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="state" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" name="Total Items" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Performance Summary */}
      <Card className="p-6">
        <h3 className="mb-4">Performance Summary</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="size-5 text-green-600" />
              <p className="text-green-900">Average Delivery Time</p>
            </div>
            <p className="text-2xl text-green-900">2.3 days</p>
            <p className="text-green-700">12% faster than target</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="size-5 text-blue-600" />
              <p className="text-blue-900">First Attempt Success</p>
            </div>
            <p className="text-2xl text-blue-900">94.2%</p>
            <p className="text-blue-700">Above 90% target</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Package className="size-5 text-purple-600" />
              <p className="text-purple-900">Items Per Day</p>
            </div>
            <p className="text-2xl text-purple-900">52</p>
            <p className="text-purple-700">Optimal capacity</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
