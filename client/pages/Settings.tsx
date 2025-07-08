import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Settings as SettingsIcon,
  Upload,
  Palette,
  Bell,
  Calendar,
  Zap,
  Shield,
  Users,
} from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = React.useState({
    brandName: "OneWorkspace",
    primaryColor: "#7c3aed",
    secondaryColor: "#f59e0b",
    notifications: true,
    calendarSync: true,
    aiSuggestions: true,
    teamCollaboration: false,
  });

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleColorChange = (
    colorType: "primaryColor" | "secondaryColor",
    value: string,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [colorType]: value,
    }));
  };

  const handleToggle = (setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your workspace preferences and integrations.
          </p>
        </div>

        <Tabs defaultValue="brand" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="brand" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Brand</span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center space-x-2"
            >
              <SettingsIcon className="h-4 w-4" />
              <span>Preferences</span>
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="flex items-center space-x-2"
            >
              <Zap className="h-4 w-4" />
              <span>Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Team</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="brand" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Brand Identity
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name</Label>
                  <Input
                    id="brandName"
                    value={settings.brandName}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        brandName: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-4">
                  <Label>Logo Upload</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        SVG, PNG, or JPG. Max 2MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) =>
                          handleColorChange("primaryColor", e.target.value)
                        }
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={(e) =>
                          handleColorChange("primaryColor", e.target.value)
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) =>
                          handleColorChange("secondaryColor", e.target.value)
                        }
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={settings.secondaryColor}
                        onChange={(e) =>
                          handleColorChange("secondaryColor", e.target.value)
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="font-medium mb-3">Preview</h3>
                  <div
                    className="p-4 rounded-lg border border-border/50 metallic-base"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary"
                      >
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-semibold">
                        {settings.brandName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2" />
                Workspace Preferences
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <Label>Notifications</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for important updates
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={() => handleToggle("notifications")}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <Label>Calendar Sync</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sync with your external calendar apps
                    </p>
                  </div>
                  <Switch
                    checked={settings.calendarSync}
                    onCheckedChange={() => handleToggle("calendarSync")}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <Label>AI Suggestions</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get intelligent suggestions for your content
                    </p>
                  </div>
                  <Switch
                    checked={settings.aiSuggestions}
                    onCheckedChange={() => handleToggle("aiSuggestions")}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <Label>Team Collaboration</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enable collaborative features for your team
                    </p>
                  </div>
                  <Switch
                    checked={settings.teamCollaboration}
                    onCheckedChange={() => handleToggle("teamCollaboration")}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Connected Apps
              </h2>

              <div className="space-y-4">
                {[
                  {
                    name: "Google Calendar",
                    description: "Sync your calendar events",
                    connected: true,
                    icon: Calendar,
                  },
                  {
                    name: "Slack",
                    description: "Team notifications and updates",
                    connected: false,
                    icon: Users,
                  },
                  {
                    name: "Notion",
                    description: "Sync with your workspace docs",
                    connected: true,
                    icon: Shield,
                  },
                ].map((app) => (
                  <div
                    key={app.name}
                    className="flex items-center justify-between p-4 border border-border/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <app.icon className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{app.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {app.description}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={app.connected ? "outline" : "default"}
                      size="sm"
                    >
                      {app.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Team Management
              </h2>

              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Team management features coming soon!</p>
                <p className="text-sm mt-1">
                  Invite team members and manage permissions.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="neon-gradient text-white">
            Save Changes
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
