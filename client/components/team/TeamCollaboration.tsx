import * as React from "react";
import { cn } from "@/lib/utils";
import { TeamMember, Activity, TeamCollaborationState } from "./types";
import { ContactList } from "./ContactList";
import { ProfilePanel } from "./ProfilePanel";
import { ActivityPanel } from "./ActivityPanel";
import { Button } from "@/components/ui/button";
import { X, Users, User, Calendar } from "lucide-react";

interface TeamCollaborationProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToNode?: (
    nodeId: string,
    position?: { x: number; y: number },
  ) => void;
}

export const TeamCollaboration: React.FC<TeamCollaborationProps> = ({
  isOpen,
  onClose,
  onNavigateToNode,
}) => {
  const [state, setState] = React.useState<TeamCollaborationState>({
    isOpen,
    selectedMemberId: null,
    activePanel: "contacts",
    filter: {
      category: "all",
      searchQuery: "",
      showFavoritesOnly: false,
    },
  });

  // Mock data - in real app this would come from API/database
  const [teamMembers] = React.useState<TeamMember[]>([
    {
      id: "1",
      name: "Alex Rodriguez",
      title: "Product Designer",
      company: "OneWorkspace",
      avatar: "AR",
      email: "alex@oneworkspace.com",
      phone: "+1 (555) 123-4567",
      birthday: "1990-03-15",
      tags: ["work", "design", "important"],
      socialLinks: {
        linkedin: "https://linkedin.com/in/alexrodriguez",
        twitter: "@alexdesigns",
      },
      isFavorite: true,
      isOnline: true,
    },
    {
      id: "2",
      name: "Sarah Chen",
      title: "Frontend Engineer",
      company: "OneWorkspace",
      avatar: "SC",
      email: "sarah@oneworkspace.com",
      tags: ["work", "engineering"],
      isFavorite: false,
      isOnline: true,
    },
    {
      id: "3",
      name: "Marcus Johnson",
      title: "UX Researcher",
      company: "Design Studio",
      avatar: "MJ",
      email: "marcus@designstudio.com",
      tags: ["work", "research"],
      isFavorite: true,
      isOnline: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: "4",
      name: "Emily Davis",
      title: "Project Manager",
      company: "OneWorkspace",
      avatar: "ED",
      email: "emily@oneworkspace.com",
      phone: "+1 (555) 987-6543",
      tags: ["work", "management", "important"],
      isFavorite: false,
      isOnline: true,
    },
    {
      id: "5",
      name: "Jordan Kim",
      title: "Data Scientist",
      company: "Analytics Corp",
      avatar: "JK",
      email: "jordan@analytics.com",
      tags: ["work", "data"],
      isFavorite: false,
      isOnline: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
  ]);

  const [activities] = React.useState<Activity[]>([
    {
      id: "1",
      title: "Design Review Meeting",
      description: "Review wireframes for new dashboard",
      type: "meeting",
      date: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
      participants: [teamMembers[0], teamMembers[1]],
      category: "Design",
      relatedNode: {
        id: "node-123",
        title: "Dashboard Wireframes",
        canvasPosition: { x: 400, y: 300 },
      },
      status: "upcoming",
    },
    {
      id: "2",
      title: "Bug Fix: Login Issue",
      description: "Fix authentication flow bug",
      type: "bug_fix",
      date: new Date(Date.now() + 1000 * 60 * 60 * 4), // 4 hours from now
      participants: [teamMembers[1]],
      category: "Engineering",
      relatedNode: {
        id: "node-456",
        title: "Auth Flow Map",
        canvasPosition: { x: 600, y: 200 },
      },
      status: "in_progress",
    },
    {
      id: "3",
      title: "User Research Session",
      description: "Interview users about new features",
      type: "event",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
      participants: [teamMembers[2], teamMembers[3]],
      category: "Research",
      status: "upcoming",
    },
    {
      id: "4",
      title: "Sprint Planning",
      description: "Plan next sprint objectives",
      type: "meeting",
      date: new Date(Date.now() + 1000 * 60 * 60 * 48), // 2 days from now
      participants: [teamMembers[0], teamMembers[1], teamMembers[3]],
      category: "Planning",
      status: "upcoming",
    },
  ]);

  const selectedMember = state.selectedMemberId
    ? teamMembers.find((m) => m.id === state.selectedMemberId)
    : null;

  const memberActivities = activities.filter((activity) =>
    activity.participants.some((p) => p.id === state.selectedMemberId),
  );

  const handleMemberSelect = (memberId: string) => {
    setState((prev) => ({ ...prev, selectedMemberId: memberId }));
  };

  const handleFilterChange = (newFilter: Partial<typeof state.filter>) => {
    setState((prev) => ({
      ...prev,
      filter: { ...prev.filter, ...newFilter },
    }));
  };

  const handleToggleFavorite = (memberId: string) => {
    // In real app, this would update the database
    console.log("Toggle favorite for member:", memberId);
  };

  const handleNavigateToRelatedNode = (
    nodeId: string,
    position?: { x: number; y: number },
  ) => {
    if (onNavigateToNode) {
      onNavigateToNode(nodeId, position);
      onClose(); // Close the collaboration panel
    }
  };

  // Mobile panel switching
  const handleMobilePanelChange = (panel: typeof state.activePanel) => {
    setState((prev) => ({ ...prev, activePanel: panel }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex h-full">
        {/* Main Collaboration Panel */}
        <div className="bg-gray-900 border-r border-gray-700 flex flex-col w-full max-w-6xl mx-auto shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-100">
                Team Collaboration
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation Tabs */}
          <div className="md:hidden border-b border-gray-700">
            <div className="flex">
              <button
                onClick={() => handleMobilePanelChange("contacts")}
                className={cn(
                  "flex-1 flex items-center justify-center py-3 text-sm font-medium",
                  state.activePanel === "contacts"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400",
                )}
              >
                <Users className="h-4 w-4 mr-2" />
                Contacts
              </button>
              <button
                onClick={() => handleMobilePanelChange("profile")}
                className={cn(
                  "flex-1 flex items-center justify-center py-3 text-sm font-medium",
                  state.activePanel === "profile"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400",
                )}
                disabled={!selectedMember}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </button>
              <button
                onClick={() => handleMobilePanelChange("activity")}
                className={cn(
                  "flex-1 flex items-center justify-center py-3 text-sm font-medium",
                  state.activePanel === "activity"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400",
                )}
                disabled={!selectedMember}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Activity
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Desktop 3-column layout */}
            <div className="hidden md:flex flex-1">
              {/* Left Panel - Contact List */}
              <div className="w-80 border-r border-gray-700 flex flex-col">
                <ContactList
                  members={teamMembers}
                  filter={state.filter}
                  selectedMemberId={state.selectedMemberId}
                  onMemberSelect={handleMemberSelect}
                  onFilterChange={handleFilterChange}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>

              {/* Middle Panel - Profile */}
              <div className="flex-1 border-r border-gray-700">
                <ProfilePanel
                  member={selectedMember}
                  onNavigateToNode={handleNavigateToRelatedNode}
                />
              </div>

              {/* Right Panel - Activity */}
              <div className="w-80">
                <ActivityPanel
                  activities={memberActivities}
                  onNavigateToNode={handleNavigateToRelatedNode}
                />
              </div>
            </div>

            {/* Mobile single panel view */}
            <div className="md:hidden flex-1">
              {state.activePanel === "contacts" && (
                <ContactList
                  members={teamMembers}
                  filter={state.filter}
                  selectedMemberId={state.selectedMemberId}
                  onMemberSelect={(memberId) => {
                    handleMemberSelect(memberId);
                    handleMobilePanelChange("profile");
                  }}
                  onFilterChange={handleFilterChange}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
              {state.activePanel === "profile" && (
                <ProfilePanel
                  member={selectedMember}
                  onNavigateToNode={handleNavigateToRelatedNode}
                />
              )}
              {state.activePanel === "activity" && (
                <ActivityPanel
                  activities={memberActivities}
                  onNavigateToNode={handleNavigateToRelatedNode}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
