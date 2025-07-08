import * as React from "react";
import { cn } from "@/lib/utils";
import { User, CalendarEvent, Notification } from "./types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  Calendar,
  Clock,
  Bell,
  Users,
  AlertCircle,
  UserMinus,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

interface ProfilePanelProps {
  user: User | null;
  events: CalendarEvent[];
  notifications: Notification[];
  onScheduleEvent: () => void;
  onUnsubscribe: (userId: string) => void;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({
  user,
  events,
  notifications,
  onScheduleEvent,
  onUnsubscribe,
}) => {
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
        <Users className="h-16 w-16 mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No User Selected</h3>
        <p className="text-sm text-center">
          Select a conversation to view user profile and scheduling options.
        </p>
      </div>
    );
  }

  const upcomingEvents = events.filter(
    (event) => event.status === "upcoming" && event.start > new Date(),
  );

  const unreadNotifications = notifications.filter((notif) => !notif.isRead);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
      {/* Profile Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gray-600 text-gray-200 text-lg">
                {user.avatar}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4 border-2 border-gray-900 rounded-full",
                getStatusColor(user.status),
              )}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-100">{user.name}</h2>
            {user.role && <p className="text-sm text-gray-400">{user.role}</p>}
            {user.profileUrl && (
              <a
                href={user.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center mt-1"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                {user.profileUrl}
              </a>
            )}
          </div>
        </div>

        {/* Status Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Status:</span>
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                user.status === "active"
                  ? "text-green-400 border-green-500/30 bg-green-500/10"
                  : user.status === "away"
                    ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
                    : "text-gray-400 border-gray-500/30 bg-gray-500/10",
              )}
            >
              {user.status}
            </Badge>
          </div>

          {user.lastContact && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Last Contact:</span>
              <span className="text-gray-300 text-xs">
                {formatDate(user.lastContact)}
              </span>
            </div>
          )}

          {user.subscribedDaysAgo && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Subscribed:</span>
              <span className="text-gray-300 text-xs">
                {user.subscribedDaysAgo} days ago
              </span>
            </div>
          )}
        </div>

        {/* Unsubscribe Toggle */}
        {user.subscribed && (
          <div className="flex items-center justify-between mt-4 p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <UserMinus className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">Subscribed</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUnsubscribe(user.id)}
              className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              Unsubscribe
            </Button>
          </div>
        )}
      </div>

      {/* Contact Actions */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {user.phone && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`tel:${user.phone}`)}
              className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`mailto:${user.email}`)}
            className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Mail className="h-3 w-3 mr-1" />
            Email
          </Button>
          <Button
            onClick={onScheduleEvent}
            size="sm"
            className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Schedule Call
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {unreadNotifications.length > 0 && (
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </h3>
          <div className="space-y-2">
            {unreadNotifications.slice(0, 3).map((notification) => (
              <div
                key={notification.id}
                className="p-2 bg-gray-800 rounded-lg border border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-200">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.description}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(notification.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Upcoming Events
        </h3>
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No upcoming events</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onScheduleEvent}
              className="mt-2 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Schedule Event
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="p-3 bg-gray-800 rounded-lg border border-gray-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-200">
                    {event.summary}
                  </h4>
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-400"
                  >
                    {event.platform}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-gray-400 mb-2">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(event.start)}
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex -space-x-1">
                    {event.attendees.slice(0, 3).map((attendee) => (
                      <Avatar
                        key={attendee.id}
                        className="h-5 w-5 border-2 border-gray-800"
                      >
                        <AvatarFallback className="text-xs bg-gray-600 text-gray-200">
                          {attendee.avatar}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  {event.attendees.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{event.attendees.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              View All Events
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
