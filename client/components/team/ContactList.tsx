import * as React from "react";
import { cn } from "@/lib/utils";
import { TeamMember } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Star,
  Briefcase,
  Users,
  Heart,
  Home,
  AlertCircle,
} from "lucide-react";

interface ContactListProps {
  members: TeamMember[];
  filter: {
    category: "all" | "work" | "friends" | "family" | "important";
    searchQuery: string;
    showFavoritesOnly: boolean;
  };
  selectedMemberId: string | null;
  onMemberSelect: (memberId: string) => void;
  onFilterChange: (filter: Partial<ContactListProps["filter"]>) => void;
  onToggleFavorite: (memberId: string) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  members,
  filter,
  selectedMemberId,
  onMemberSelect,
  onFilterChange,
  onToggleFavorite,
}) => {
  const filteredMembers = React.useMemo(() => {
    let filtered = members;

    // Filter by category
    if (filter.category !== "all") {
      filtered = filtered.filter((member) =>
        member.tags.includes(filter.category),
      );
    }

    // Filter by search query
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.title.toLowerCase().includes(query) ||
          member.company.toLowerCase().includes(query) ||
          member.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Filter by favorites
    if (filter.showFavoritesOnly) {
      filtered = filtered.filter((member) => member.isFavorite);
    }

    return filtered;
  }, [members, filter]);

  const filterButtons = [
    { key: "all", label: "All", icon: Users },
    { key: "work", label: "Work", icon: Briefcase },
    { key: "friends", label: "Friends", icon: Users },
    { key: "family", label: "Family", icon: Home },
    { key: "important", label: "Important", icon: AlertCircle },
  ] as const;

  const getStatusIndicator = (member: TeamMember) => {
    if (member.isOnline) {
      return (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full" />
      );
    } else if (member.lastSeen) {
      const minutesAgo = Math.floor(
        (Date.now() - member.lastSeen.getTime()) / (1000 * 60),
      );
      if (minutesAgo < 60) {
        return (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-yellow-500 border-2 border-gray-900 rounded-full" />
        );
      }
    }
    return (
      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-500 border-2 border-gray-900 rounded-full" />
    );
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Search Bar */}
        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={filter.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              className="pl-10 bg-secondary border-border text-primary focus:border-primary"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((filterBtn) => {
              const IconComponent = filterBtn.icon;
              return (
                <Button
                  key={filterBtn.key}
                  variant={
                    filter.category === filterBtn.key ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => onFilterChange({ category: filterBtn.key })}
                  className={cn(
                    "text-xs",
                    filter.category === filterBtn.key
                      ? "bg-secondary border-border text-primary hover:bg-accent"
                      : "bg-secondary border-border text-primary hover:bg-accent",
                  )}
                >
                  <IconComponent className="h-3 w-3 mr-1" />
                  {filterBtn.label}
                </Button>
              );
            })}
          </div>

          {/* Favorites Toggle */}
          <Button
            variant={filter.showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={() =>
              onFilterChange({ showFavoritesOnly: !filter.showFavoritesOnly })
            }
            className={cn(
              "w-full text-xs",
              filter.showFavoritesOnly
                ? "bg-yellow-600 text-white"
                : "bg-secondary border-border text-primary hover:bg-accent",
            )}
          >
            <Star
              className={cn(
                "h-3 w-3 mr-2",
                filter.showFavoritesOnly && "fill-current",
              )}
            />
            {filter.showFavoritesOnly ? "Show All" : "Favorites Only"}
          </Button>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No contacts found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => onMemberSelect(member.id)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-700/50",
                  selectedMemberId === member.id
                    ? "bg-blue-600/20 border-blue-500/50"
                    : "bg-gray-800/50 border-gray-700 hover:border-gray-600",
                )}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar with Status */}
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-secondary text-primary text-sm">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {getStatusIndicator(member)}
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-primary truncate">
                        {member.name}
                      </h4>
                      {member.isFavorite && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.title} • {member.company}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs px-1 py-0 bg-secondary/50 border-border/50 text-primary"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {member.tags.length > 2 && (
                        <Badge
                          variant="outline"
                          className="text-xs px-1 py-0 bg-secondary/50 border-border/50 text-primary"
                        >
                          +{member.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Favorite Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(member.id);
                        }}
                        className="h-8 w-8 p-0 hover:bg-accent/50"
                      >
                        <Star
                          className={cn(
                            "h-4 w-4",
                            member.isFavorite
                              ? "text-yellow-500 fill-current"
                              : "text-muted-foreground",
                          )}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {member.isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
