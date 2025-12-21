import { useState } from "react";
import { Package, LogOut, Menu, BarChart3, FileText, Truck, Users, Shield } from "lucide-react";
import { UserRole, Item, Batch } from "./types";
import { mockUsers, mockBatches, mockItems, mockRiders, mockHubs, mockAuditLogs } from "./data/mockData";
import { RoleSelector } from "./components/RoleSelector";
import { StatCard } from "./components/StatCard";
import { BatchManagement } from "./components/BatchManagement";
import { ItemsTable } from "./components/ItemsTable";
import { ItemDetailModal } from "./components/ItemDetailModal";
import { RiderDashboard } from "./components/RiderDashboard";
import { ApplicantTracking } from "./components/ApplicantTracking";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { AuditLogs } from "./components/AuditLogs";
import { DispatchManagement } from "./components/DispatchManagement";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card } from "./components/ui/card";

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>("super-admin");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const currentUser = mockUsers.find((u) => u.role === currentRole)!;

  // Filter items based on role
  const getItemsForRole = () => {
    if (currentRole === "rider") {
      return mockItems.filter((item) => item.riderId === "R001"); // Assume current rider is R001
    }
    if (currentRole === "applicant") {
      return mockItems.filter((item) => item.applicantEmail === currentUser.email);
    }
    return mockItems;
  };

  const items = getItemsForRole();

  // Calculate statistics
  const stats = {
    total: items.length,
    delivered: items.filter((i) => i.status === "delivered").length,
    inTransit: items.filter((i) => i.status === "in-transit").length,
    pending: items.filter(
      (i) => i.status === "received" || i.status === "stored" || i.status === "dispatched"
    ).length,
    failed: items.filter((i) => i.status === "failed").length,
  };

  // Render content based on role
  const renderDashboard = () => {
    if (currentRole === "applicant") {
      return <ApplicantTracking items={mockItems} />;
    }

    if (currentRole === "rider") {
      const rider = mockRiders.find((r) => r.id === "R001")!;
      return <RiderDashboard rider={rider} assignedItems={items} />;
    }

    return (
      <div className="space-y-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Items"
            value={stats.total}
            icon={Package}
            color="text-blue-600"
            bgColor="bg-blue-50"
            trend="+12% this week"
            trendUp={true}
          />
          <StatCard
            title="Delivered"
            value={stats.delivered}
            icon={Package}
            color="text-green-600"
            bgColor="bg-green-50"
            trend={`${((stats.delivered / stats.total) * 100).toFixed(1)}% rate`}
            trendUp={true}
          />
          <StatCard
            title="In Transit"
            value={stats.inTransit}
            icon={Truck}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={FileText}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Recent Items */}
        <Card className="p-6">
          <h3 className="mb-4">Recent Items</h3>
          <ItemsTable
            items={items.slice(0, 5)}
            onItemSelect={setSelectedItem}
            showActions={true}
          />
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Package className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl">CLIENT BUILD</h1>
                <p className="text-gray-600">Logistics Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p>{currentUser.name}</p>
                <p className="text-gray-600">
                  {currentUser.role.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                </p>
              </div>
              <Button variant="outline" size="icon">
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Role Selector */}
        <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />

        {/* Content based on role */}
        {currentRole === "applicant" ? (
          renderDashboard()
        ) : currentRole === "rider" ? (
          renderDashboard()
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="size-4" />
                Dashboard
              </TabsTrigger>
              {(currentRole === "super-admin" || currentRole === "client-admin") && (
                <TabsTrigger value="batches" className="flex items-center gap-2">
                  <FileText className="size-4" />
                  Batches
                </TabsTrigger>
              )}
              <TabsTrigger value="items" className="flex items-center gap-2">
                <Package className="size-4" />
                Items
              </TabsTrigger>
              {(currentRole === "super-admin" || currentRole === "operations-manager") && (
                <TabsTrigger value="dispatch" className="flex items-center gap-2">
                  <Truck className="size-4" />
                  Dispatch
                </TabsTrigger>
              )}
              {(currentRole === "super-admin" || currentRole === "operations-manager") && (
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="size-4" />
                  Analytics
                </TabsTrigger>
              )}
              {currentRole === "super-admin" && (
                <TabsTrigger value="audit" className="flex items-center gap-2">
                  <Shield className="size-4" />
                  Audit Logs
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="dashboard">{renderDashboard()}</TabsContent>

            {(currentRole === "super-admin" || currentRole === "client-admin") && (
              <TabsContent value="batches">
                {selectedBatch ? (
                  <div>
                    <Button
                      variant="outline"
                      className="mb-4"
                      onClick={() => setSelectedBatch(null)}
                    >
                      ← Back to Batches
                    </Button>
                    <Card className="p-6 mb-6">
                      <h2 className="text-2xl mb-4">{selectedBatch.batchNumber}</h2>
                      <p className="text-gray-600 mb-4">{selectedBatch.description}</p>
                      <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <p className="text-gray-600">Total Items</p>
                          <p className="text-xl">{selectedBatch.totalItems}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Uploaded By</p>
                          <p className="text-xl">{selectedBatch.uploadedBy}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Status</p>
                          <p className="text-xl">{selectedBatch.status}</p>
                        </div>
                      </div>
                    </Card>
                    <ItemsTable
                      items={mockItems.filter((i) => i.batchId === selectedBatch.id)}
                      onItemSelect={setSelectedItem}
                    />
                  </div>
                ) : (
                  <BatchManagement
                    batches={mockBatches}
                    onBatchSelect={setSelectedBatch}
                  />
                )}
              </TabsContent>
            )}

            <TabsContent value="items">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl mb-1">All Items</h2>
                    <p className="text-gray-600">
                      Manage and track all items in the system
                    </p>
                  </div>
                </div>
                <ItemsTable items={items} onItemSelect={setSelectedItem} />
              </div>
            </TabsContent>

            {(currentRole === "super-admin" || currentRole === "operations-manager") && (
              <TabsContent value="dispatch">
                <DispatchManagement
                  items={mockItems}
                  riders={mockRiders}
                  hubs={mockHubs}
                />
              </TabsContent>
            )}

            {(currentRole === "super-admin" || currentRole === "operations-manager") && (
              <TabsContent value="analytics">
                <AnalyticsDashboard items={mockItems} />
              </TabsContent>
            )}

            {currentRole === "super-admin" && (
              <TabsContent value="audit">
                <AuditLogs logs={mockAuditLogs} />
              </TabsContent>
            )}
          </Tabs>
        )}
      </main>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
