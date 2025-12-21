import { UserRole } from "../types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Shield, Building, Users, Bike, User } from "lucide-react";

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function RoleSelector({ currentRole, onRoleChange }: RoleSelectorProps) {
  const roles: { role: UserRole; label: string; icon: any; color: string }[] = [
    {
      role: "super-admin",
      label: "Super Admin",
      icon: Shield,
      color: "text-purple-600 bg-purple-50",
    },
    {
      role: "client-admin",
      label: "Client Admin",
      icon: Building,
      color: "text-blue-600 bg-blue-50",
    },
    {
      role: "operations-manager",
      label: "Operations Manager",
      icon: Users,
      color: "text-green-600 bg-green-50",
    },
    {
      role: "rider",
      label: "Rider",
      icon: Bike,
      color: "text-orange-600 bg-orange-50",
    },
    {
      role: "applicant",
      label: "Applicant",
      icon: User,
      color: "text-teal-600 bg-teal-50",
    },
  ];

  return (
    <Card className="p-4 mb-6">
      <p className="text-gray-600 mb-3">Switch Role (Demo Mode)</p>
      <div className="flex flex-wrap gap-2">
        {roles.map((r) => {
          const Icon = r.icon;
          return (
            <Button
              key={r.role}
              variant={currentRole === r.role ? "default" : "outline"}
              size="sm"
              onClick={() => onRoleChange(r.role)}
              className="flex items-center gap-2"
            >
              <Icon className="size-4" />
              {r.label}
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
