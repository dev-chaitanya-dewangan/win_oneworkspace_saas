import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  X,
  Filter,
  Plus,
  FileText,
  Users,
  Calendar,
  MessageCircle,
  Download,
  Share,
  File,
  Image,
  Archive,
  Video,
  Music,
  Zap,
  Heart,
  Reply,
  Clock,
  CheckCircle,
} from "lucide-react";

interface SearchResult {
  id: string;
  type: "person" | "file" | "collection" | "reaction" | "action";
  title: string;
  subtitle?: string;
  metadata?: string;
  icon?: React.ComponentType<{ className?: string }>;
  avatar?: string;
  count?: number;
  isPaid?: boolean;
  emoji?: string;
  fileType?: string;
}

interface SearchCommandDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockResults: SearchResult[] = [
  // People
  {
    id: "p1",
    type: "person",
    title: "Alice Johnson",
    subtitle: "alice@workspace.com",
    avatar: "AJ",
    count: 3,
  },
  {
    id: "p2",
    type: "person",
    title: "Bob Wilson",
    subtitle: "bob.wilson@company.com",
    avatar: "BW",
    count: 12,
  },
  {
    id: "p3",
    type: "person",
    title: "Carol Martinez",
    subtitle: "c.martinez@design.io",
    avatar: "CM",
  },

  // Files
  {
    id: "f1",
    type: "file",
    title: "Design System Guidelines 📊",
    subtitle: "Updated 2 hours ago",
    fileType: "PDF",
    emoji: "📊",
  },
  {
    id: "f2",
    type: "file",
    title: "Project Assets.zip 🎨",
    subtitle: "Shared by Alice Johnson",
    fileType: "ZIP",
    emoji: "🎨",
  },
  {
    id: "f3",
    type: "file",
    title: "Meeting Recording 🎥",
    subtitle: "Team standup - March 15",
    fileType: "MP4",
    emoji: "🎥",
  },

  // Collections
  {
    id: "c1",
    type: "collection",
    title: "UI Components",
    subtitle: "Design System",
    isPaid: false,
    count: 24,
  },
  {
    id: "c2",
    type: "collection",
    title: "Marketing Assets",
    subtitle: "Brand Guidelines",
    isPaid: true,
    count: 8,
  },

  // Reactions
  {
    id: "r1",
    type: "reaction",
    title: "Alice replied in #design-system",
    subtitle: "2 minutes ago",
    avatar: "AJ",
    count: 5,
  },
  {
    id: "r2",
    type: "reaction",
    title: "New comment on Project Brief",
    subtitle: "5 minutes ago",
    avatar: "BW",
    count: 2,
  },

  // Quick Actions
  {
    id: "a1",
    type: "action",
    title: "Create Task",
    subtitle: "Add new task to project",
    icon: CheckCircle,
  },
  {
    id: "a2",
    type: "action",
    title: "Create Note",
    subtitle: "Quick note or memo",
    icon: FileText,
  },
  {
    id: "a3",
    type: "action",
    title: "Add Member",
    subtitle: "Invite team member",
    icon: Users,
  },
];

const getFileIcon = (fileType: string) => {
  switch (fileType?.toLowerCase()) {
    case "pdf":
      return FileText;
    case "zip":
    case "rar":
      return Archive;
    case "jpg":
    case "png":
    case "gif":
      return Image;
    case "mp4":
    case "avi":
      return Video;
    case "mp3":
    case "wav":
      return Music;
    default:
      return File;
  }
};

const ResultItem: React.FC<{ result: SearchResult; onSelect: () => void }> = ({
  result,
  onSelect,
}) => {
  const IconComponent = result.icon || getFileIcon(result.fileType || "");

  return (
    <div
      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
      onClick={onSelect}
    >
      {/* Icon/Avatar */}
      <div className="flex-shrink-0">
        {result.type === "person" || result.type === "reaction" ? (
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-secondary text-primary">
              {result.avatar}
            </AvatarFallback>
          </Avatar>
        ) : result.type === "action" ? (
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <IconComponent className="h-4 w-4 text-accent-foreground" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <IconComponent className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-medium text-primary truncate-ellipsis">
            {result.title}
          </h4>
          {result.isPaid !== undefined && (
            <Badge
              variant={result.isPaid ? "default" : "secondary"}
              className="text-xs px-1.5 py-0.5"
            >
              {result.isPaid ? "PAID" : "FREE"}
            </Badge>
          )}
        </div>
        {result.subtitle && (
          <p className="text-xs text-secondary truncate-ellipsis">
            {result.subtitle}
          </p>
        )}
      </div>

      {/* Metadata */}
      <div className="flex-shrink-0 flex items-center space-x-2">
        {result.count !== undefined && result.count > 0 && (
          <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <span className="text-xs font-medium">{result.count}</span>
          </div>
        )}
        {result.type === "file" && (
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
              <Share className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
              <Download className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const SearchCommandDrawer: React.FC<SearchCommandDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredResults, setFilteredResults] = React.useState(mockResults);

  React.useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResults(mockResults);
    } else {
      const filtered = mockResults.filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredResults(filtered);
    }
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleResultSelect = (result: SearchResult) => {
    console.log("Selected:", result);
    // Handle result selection based on type
    onClose();
  };

  const groupedResults = React.useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};

    filteredResults.forEach((result) => {
      const key = result.type;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(result);
    });

    return groups;
  }, [filteredResults]);

  const getSectionTitle = (type: string) => {
    switch (type) {
      case "person":
        return "PEOPLE";
      case "file":
        return "FILES";
      case "collection":
        return "COLLECTIONS";
      case "reaction":
        return "RECENT ACTIVITY";
      case "action":
        return "QUICK ACTIONS";
      default:
        return type.toUpperCase();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="metallic-base w-[460px] max-w-[95vw] h-[600px] max-h-[90vh] p-0 rounded-[18px] overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Search and Commands</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-white/5 to-white/10 border-b border-white/10 px-5 py-4 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <Search className="h-5 w-5 text-secondary flex-shrink-0" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people, files, or type a command..."
              className="border-0 bg-transparent text-white placeholder-white/60 focus:ring-0 text-base font-medium px-0"
              autoFocus
            />
            <div className="flex items-center space-x-2 flex-shrink-0">
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="h-5 w-5 p-0 text-secondary hover:text-primary"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 text-secondary hover:text-primary"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions (when no search) */}
        {!searchQuery && (
          <div className="px-5 py-3 border-b border-muted">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-[10px] text-sm font-medium"
                onClick={() =>
                  handleResultSelect(mockResults.find((r) => r.id === "a1")!)
                }
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Create Task
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="rounded-[10px] text-sm font-medium"
                onClick={() =>
                  handleResultSelect(mockResults.find((r) => r.id === "a2")!)
                }
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Note
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="rounded-[10px] text-sm font-medium"
                onClick={() =>
                  handleResultSelect(mockResults.find((r) => r.id === "a3")!)
                }
              >
                <Users className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {Object.entries(groupedResults).map(([type, results]) => {
            if (results.length === 0) return null;

            return (
              <div key={type} className="px-5 py-3">
                <h3 className="text-xs font-medium text-secondary uppercase tracking-wider mb-3">
                  {getSectionTitle(type)}
                </h3>
                <div className="space-y-1">
                  {results.map((result) => (
                    <ResultItem
                      key={result.id}
                      result={result}
                      onSelect={() => handleResultSelect(result)}
                    />
                  ))}
                </div>
                {type !== "action" && <Separator className="mt-4 bg-muted" />}
              </div>
            );
          })}

          {filteredResults.length === 0 && (
            <div className="px-5 py-8 text-center">
              <Search className="h-8 w-8 text-secondary mx-auto mb-3" />
              <h3 className="text-sm font-medium text-primary mb-1">
                No results found
              </h3>
              <p className="text-xs text-secondary">
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-primary border-t border-muted px-5 py-3">
          <div className="flex items-center justify-between text-xs text-secondary">
            <div className="flex items-center space-x-4">
              <span>↑↓ Navigate</span>
              <span>⏎ Select</span>
              <span>⌘K Open</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3" />
              <span>Recent searches</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
