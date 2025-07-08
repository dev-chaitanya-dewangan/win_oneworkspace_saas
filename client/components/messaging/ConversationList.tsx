import * as React from "react";
import { cn } from "@/lib/utils";
import { Conversation, User } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, MoreHorizontal, Archive, Filter } from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  users: User[];
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onConversationSelect,
  users,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "unread" | "archived">(
    "all",
  );

  const filteredConversations = React.useMemo(() => {
    let filtered = conversations;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((conversation) =>
        conversation.participants.some((participant) =>
          participant.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    }

    // Filter by status
    if (filter === "unread") {
      filtered = filtered.filter(
        (conversation) => conversation.unreadCount > 0,
      );
    }

    return filtered.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
    );
  }, [conversations, searchQuery, filter]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes < 1 ? "Just now" : `${diffMinutes}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
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
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Conversations</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log("New conversation")}
              className="h-8 w-8 p-0 hover:bg-gray-700"
            >
              <Plus className="h-4 w-4 text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log("More options")}
              className="h-8 w-8 p-0 hover:bg-gray-700"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by chats and people"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={cn(
              "text-xs h-8",
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700",
            )}
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
            className={cn(
              "text-xs h-8",
              filter === "unread"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700",
            )}
          >
            Unread
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Move to Closed")}
            className="text-xs h-8 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Archive className="h-3 w-3 mr-1" />
            Move to Closed
          </Button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Search className="h-12 w-12 mb-4 opacity-50" />
            <p>No conversations found</p>
            {searchQuery && (
              <p className="text-sm">Try adjusting your search</p>
            )}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => {
              const participant = conversation.participants[0];
              const isSelected = conversation.id === selectedConversationId;

              return (
                <div
                  key={conversation.id}
                  onClick={() => onConversationSelect(conversation.id)}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-700/50",
                    isSelected
                      ? "bg-blue-600/20 border border-blue-500/50"
                      : "hover:bg-gray-800/50",
                  )}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar with Status */}
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gray-600 text-gray-200">
                          {participant?.avatar || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {participant && (
                        <div
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-gray-900 rounded-full",
                            getStatusColor(participant.status),
                          )}
                        />
                      )}
                    </div>

                    {/* Conversation Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-100 truncate">
                          {participant?.name || "Unknown User"}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {conversation.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                          )}
                          {conversation.unreadCount > 0 && (
                            <Badge
                              variant="default"
                              className="h-5 min-w-5 bg-blue-600 text-white text-xs px-1.5"
                            >
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {conversation.lastMessage && (
                        <p className="text-xs text-gray-400 truncate">
                          {conversation.lastMessage.content}
                        </p>
                      )}

                      {/* Status and indicators */}
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        {participant?.role && (
                          <span className="truncate">{participant.role}</span>
                        )}
                        {conversation.lastMessage?.platform === "email" && (
                          <Badge
                            variant="outline"
                            className="ml-2 h-4 px-1 text-xs bg-gray-700/50 border-gray-600/50"
                          >
                            Email
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500 text-center">
          {filteredConversations.length} conversation
          {filteredConversations.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
};
