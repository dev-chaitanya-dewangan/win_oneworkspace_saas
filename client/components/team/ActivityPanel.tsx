import * as React from "react";
import { cn } from "@/lib/utils";
import { Activity } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Calendar,
  Clock,
  Users,
  ExternalLink,
  MapPin,
  Play,
  CheckCircle,
  AlertCircle,
  XCircle,
  Bug,
  Briefcase,
  Zap,
} from "lucide-react";

interface ActivityPanelProps {
  activities: Activity[];
  onNavigateToNode?: (
    nodeId: string,
    position?: { x: number; y: number },
  ) => void;
}

export const ActivityPanel: React.FC<ActivityPanelProps> = ({
  activities,
  onNavigateToNode,
}) => {
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "meeting":
        return Users;
      case "task":
        return CheckCircle;
      case "event":
        return Calendar;
      case "bug_fix":
        return Bug;
      case "project":
        return Briefcase;
      default:
        return Calendar;
    }
  };

  const getStatusIcon = (status: Activity["status"]) => {
    switch (status) {
      case "upcoming":
        return Clock;
      case "in_progress":
        return Play;
      case "completed":
        return CheckCircle;
      case "cancelled":
        return XCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: Activity["status"]) => {
    switch (status) {
      case "upcoming":
        return "text-blue-400 bg-blue-500/20 border-blue-500/30";
      case "in_progress":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "completed":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "cancelled":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1 && diffHours >= 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `In ${diffMinutes}m`;
    } else if (diffHours < 24 && diffHours >= 0) {
      return `In ${diffHours}h`;
    } else if (diffDays < 7 && diffDays >= 0) {
      return `In ${diffDays}d`;
    } else if (diffHours < 0 && diffHours > -24) {
      return `${Math.abs(diffHours)}h ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const handleActivityClick = (activity: Activity) => {
    if (activity.relatedNode && onNavigateToNode) {
      onNavigateToNode(
        activity.relatedNode.id,
        activity.relatedNode.canvasPosition,
      );
    }
  };

  const sortedActivities = React.useMemo(() => {
    return [...activities].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [activities]);

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
        <Calendar className="h-16 w-16 mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No Activities</h3>
        <p className="text-sm text-center">
          No scheduled activities or tasks found for this team member.
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-100">
              Activity & Events
            </h3>
            <Badge
              variant="outline"
              className="bg-gray-700/50 border-gray-600/50 text-gray-300"
            >
              {activities.length} items
            </Badge>
          </div>
        </div>

        {/* Activity List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sortedActivities.map((activity) => {
            const ActivityIcon = getActivityIcon(activity.type);
            const StatusIcon = getStatusIcon(activity.status);

            return (
              <div
                key={activity.id}
                onClick={() => handleActivityClick(activity)}
                className={cn(
                  "p-4 rounded-lg border transition-all hover:bg-gray-700/30",
                  activity.relatedNode
                    ? "cursor-pointer bg-gray-800/50 border-gray-700 hover:border-gray-600"
                    : "bg-gray-800/30 border-gray-700/50",
                )}
              >
                {/* Activity Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-gray-700/50 rounded-lg">
                      <ActivityIcon className="h-4 w-4 text-gray-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-100">
                        {activity.title}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {activity.description}
                      </p>
                    </div>
                  </div>

                  {activity.relatedNode && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="p-1 bg-blue-600/20 rounded">
                          <ExternalLink className="h-3 w-3 text-blue-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <div className="font-medium">
                            Jump to: {activity.relatedNode.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Click to navigate to canvas
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                {/* Activity Details */}
                <div className="space-y-2">
                  {/* Date and Time */}
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(activity.date)}
                  </div>

                  {/* Status and Category */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          getStatusColor(activity.status),
                        )}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {activity.status.replace("_", " ")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs bg-gray-700/50 border-gray-600/50 text-gray-300"
                      >
                        {activity.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Participants */}
                  {activity.participants.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        {activity.participants
                          .slice(0, 4)
                          .map((participant) => (
                            <Tooltip key={participant.id}>
                              <TooltipTrigger asChild>
                                <Avatar className="h-6 w-6 border-2 border-gray-800">
                                  <AvatarFallback className="text-xs bg-gray-600 text-gray-200">
                                    {participant.avatar}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                {participant.name}
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        {activity.participants.length > 4 && (
                          <div className="h-6 w-6 bg-gray-700 border-2 border-gray-800 rounded-full flex items-center justify-center">
                            <span className="text-xs text-gray-300 font-medium">
                              +{activity.participants.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {activity.participants.length} participant
                        {activity.participants.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  {/* Related Node Link */}
                  {activity.relatedNode && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
                      <div className="flex items-center text-xs text-blue-400">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>Related: {activity.relatedNode.title}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivityClick(activity);
                        }}
                        className="h-6 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-600/10"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Go to Node
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => console.log("View all activities")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            View All Activities
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};
