import * as React from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Input } from "./input";
import { Command, Hash, User, ChevronRight } from "lucide-react";

interface ActionSearchBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Suggestion {
  id: string;
  type: "user" | "file" | "action";
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

const ActionSearchBar: React.FC<ActionSearchBarProps> = ({
  open,
  onOpenChange,
}) => {
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // Mock data - replace with real suggestions
  const suggestions: Suggestion[] = React.useMemo(() => {
    const allSuggestions: Suggestion[] = [
      // Users (@ trigger)
      {
        id: "user-1",
        type: "user",
        title: "@john.doe",
        subtitle: "John Doe - Product Manager",
        icon: <User className="h-4 w-4" />,
        action: () => console.log("Select user john.doe"),
      },
      {
        id: "user-2",
        type: "user",
        title: "@sarah.wilson",
        subtitle: "Sarah Wilson - Designer",
        icon: <User className="h-4 w-4" />,
        action: () => console.log("Select user sarah.wilson"),
      },
      // Files (# trigger)
      {
        id: "file-1",
        type: "file",
        title: "#brand-guidelines.pdf",
        subtitle: "Updated 2 days ago",
        icon: <Hash className="h-4 w-4" />,
        action: () => console.log("Open brand guidelines"),
      },
      {
        id: "file-2",
        type: "file",
        title: "#product-roadmap.md",
        subtitle: "Updated yesterday",
        icon: <Hash className="h-4 w-4" />,
        action: () => console.log("Open product roadmap"),
      },
      // Actions (> trigger)
      {
        id: "action-1",
        type: "action",
        title: ">Go to Dashboard",
        subtitle: "Navigate to main dashboard",
        icon: <ChevronRight className="h-4 w-4" />,
        action: () => {
          window.location.href = "/dashboard";
          onOpenChange(false);
        },
      },
      {
        id: "action-2",
        type: "action",
        title: ">Create New Design",
        subtitle: "Start a new design project",
        icon: <ChevronRight className="h-4 w-4" />,
        action: () => {
          window.location.href = "/design";
          onOpenChange(false);
        },
      },
      {
        id: "action-3",
        type: "action",
        title: ">Open Text Editor",
        subtitle: "Start writing with Notion-style editor",
        icon: <ChevronRight className="h-4 w-4" />,
        action: () => {
          window.location.href = "/editor";
          onOpenChange(false);
        },
      },
    ];

    if (!query) return allSuggestions.slice(0, 6);

    return allSuggestions.filter(
      (suggestion) =>
        suggestion.title.toLowerCase().includes(query.toLowerCase()) ||
        suggestion.subtitle?.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, onOpenChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          suggestions[selectedIndex].action();
          onOpenChange(false);
        }
        break;
      case "Escape":
        onOpenChange(false);
        break;
    }
  };

  const handleSelect = (suggestion: Suggestion) => {
    suggestion.action();
    onOpenChange(false);
  };

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="flex items-center space-x-2 text-lg">
            <Command className="h-5 w-5 text-primary" />
            <span>Action Search</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 pt-0">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for users (@), files (#), or actions (>)..."
            className="w-full"
            autoFocus
          />
        </div>

        {suggestions.length > 0 && (
          <div className="max-h-80 overflow-y-auto border-t">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => handleSelect(suggestion)}
                className={cn(
                  "w-full flex items-center space-x-3 p-3 text-left hover:bg-muted/50 transition-colors",
                  index === selectedIndex && "bg-muted/70",
                )}
              >
                <div className="flex-shrink-0 text-muted-foreground">
                  {suggestion.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">
                    {suggestion.title}
                  </div>
                  {suggestion.subtitle && (
                    <div className="text-sm text-muted-foreground truncate">
                      {suggestion.subtitle}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {query && suggestions.length === 0 && (
          <div className="p-8 text-center text-muted-foreground border-t">
            <p>No results found for "{query}"</p>
            <p className="text-sm mt-1">
              Try searching for users (@), files (#), or actions (&gt;)
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { ActionSearchBar };
