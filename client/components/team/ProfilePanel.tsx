import * as React from "react";
import { cn } from "@/lib/utils";
import { TeamMember } from "./types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  MapPin,
  Cake,
  ExternalLink,
  Linkedin,
  Twitter,
  Github,
  Building,
  User,
  Star,
  Clock,
  Video,
  Users,
  Settings,
} from "lucide-react";

interface ProfilePanelProps {
  member: TeamMember | null;
  onNavigateToNode?: (
    nodeId: string,
    position?: { x: number; y: number },
  ) => void;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({
  member,
  onNavigateToNode,
}) => {
  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
        <User className="h-12 w-12 mb-4 opacity-50" />
        <p>Select a team member to view their profile</p>
      </div>
    );
  }

  const handleContactAction = (action: string) => {
    switch (action) {
      case "call":
        if (member.phone) {
          window.open(`tel:${member.phone}`);
        }
        break;
      case "email":
        window.open(`mailto:${member.email}`);
        break;
      case "chat":
        console.log("Open chat with", member.name);
        break;
      case "schedule":
        console.log("Schedule call with", member.name);
        break;
    }
  };

  const handleSocialLink = (platform: string, url?: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const getLastSeenText = () => {
    if (member.isOnline) return "Online now";
    if (member.lastSeen) {
      const minutesAgo = Math.floor(
        (Date.now() - member.lastSeen.getTime()) / (1000 * 60),
      );
      if (minutesAgo < 1) return "Just now";
      if (minutesAgo < 60) return `${minutesAgo}m ago`;
      const hoursAgo = Math.floor(minutesAgo / 60);
      if (hoursAgo < 24) return `${hoursAgo}h ago`;
      const daysAgo = Math.floor(hoursAgo / 24);
      return `${daysAgo}d ago`;
    }
    return "Last seen unknown";
  };

  const handleTagClick = (tag: string) => {
    // Simulate navigation to related work/mind map
    if (tag === "design" && onNavigateToNode) {
      onNavigateToNode("design-node-123", { x: 400, y: 300 });
    } else if (tag === "engineering" && onNavigateToNode) {
      onNavigateToNode("eng-node-456", { x: 600, y: 200 });
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Profile Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-secondary text-primary text-xl">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {/* Status Indicator */}
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 w-5 h-5 border-2 border-gray-900 rounded-full",
                  member.isOnline ? "bg-green-500" : "bg-gray-500",
                )}
              />
              {member.isFavorite && (
                <div className="absolute -top-1 -right-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold text-primary">
                {member.name}
              </h2>
              <p className="text-muted-foreground mb-1">{member.title}</p>
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <Building className="h-4 w-4 mr-1" />
                {member.company}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {getLastSeenText()}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {member.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50 transition-colors"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
                {(tag === "design" || tag === "engineering") && (
                  <ExternalLink className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-b border-gray-700">
          <div className="grid grid-cols-2 gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => handleContactAction("call")}
                  className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                  disabled={!member.phone}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {member.phone ? `Call ${member.phone}` : "No phone number"}
              </TooltipContent>
            </Tooltip>

            <Button
              variant="outline"
              onClick={() => handleContactAction("email")}
              className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>

            <Button
              variant="outline"
              onClick={() => handleContactAction("chat")}
              className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>

            <Button
              onClick={() => handleContactAction("schedule")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-primary mb-3">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                {member.email}
                <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                {member.phone}
                <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Social Links */}
          {member.socialLinks && (
            <>
              <Separator className="bg-gray-700" />
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  Social Links
                </h3>
                <div className="space-y-2">
                  {member.socialLinks.linkedin && (
                    <button
                      onClick={() =>
                        handleSocialLink(
                          "linkedin",
                          member.socialLinks?.linkedin,
                        )
                      }
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center text-sm text-gray-300">
                        <Linkedin className="h-4 w-4 mr-2 text-blue-400" />
                        LinkedIn
                      </div>
                      <ExternalLink className="h-3 w-3 text-gray-500" />
                    </button>
                  )}

                  {member.socialLinks.twitter && (
                    <button
                      onClick={() =>
                        handleSocialLink("twitter", member.socialLinks?.twitter)
                      }
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center text-sm text-gray-300">
                        <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                        Twitter
                      </div>
                      <ExternalLink className="h-3 w-3 text-gray-500" />
                    </button>
                  )}

                  {member.socialLinks.github && (
                    <button
                      onClick={() =>
                        handleSocialLink("github", member.socialLinks?.github)
                      }
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center text-sm text-gray-300">
                        <Github className="h-4 w-4 mr-2 text-gray-300" />
                        GitHub
                      </div>
                      <ExternalLink className="h-3 w-3 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Quick Actions */}
          <Separator className="bg-gray-700" />
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => console.log("View shared files")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Shared Files
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => console.log("View project history")}
              >
                <Clock className="h-4 w-4 mr-2" />
                Project History
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
