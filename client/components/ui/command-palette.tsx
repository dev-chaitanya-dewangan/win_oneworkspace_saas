import * as React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Calendar,
  Camera,
  MessageCircle,
  Settings,
  Search,
  FileText,
  Users,
  Zap,
  Plus,
  Heart,
  TrendingUp,
  User,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenTeamCollaboration?: (memberId?: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
  onOpenTeamCollaboration,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");

  // Team members data - in real app this would come from API
  const teamMembers = [
    {
      id: "1",
      name: "Alex Rodriguez",
      title: "Product Designer",
      team: "Design",
    },
    {
      id: "2",
      name: "Sarah Chen",
      title: "Frontend Engineer",
      team: "Engineering",
    },
    {
      id: "3",
      name: "Marcus Johnson",
      title: "UX Researcher",
      team: "Research",
    },
    {
      id: "4",
      name: "Emily Davis",
      title: "Project Manager",
      team: "Management",
    },
    { id: "5", name: "Jordan Kim", title: "Data Scientist", team: "Analytics" },
  ];

  const runCommand = React.useCallback(
    (command: () => void) => {
      onOpenChange(false);
      command();
    },
    [onOpenChange],
  );

  // Check if query is a team member search
  const isTeamMemberQuery = React.useMemo(() => {
    return teamMembers.some(
      (member) =>
        member.name.toLowerCase().includes(query.toLowerCase()) ||
        member.team.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, teamMembers]);

  const filteredTeamMembers = React.useMemo(() => {
    if (!query) return [];
    return teamMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(query.toLowerCase()) ||
        member.title.toLowerCase().includes(query.toLowerCase()) ||
        member.team.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, teamMembers]);

  const navigationCommands = [
    {
      name: "Dashboard",
      description: "Go to AI command center",
      icon: MessageCircle,
      action: () => navigate("/dashboard"),
    },
    {
      name: "Design Studio",
      description: "Create carousels and content",
      icon: Camera,
      action: () => navigate("/design"),
    },
    {
      name: "Calendar",
      description: "Manage schedule and bookings",
      icon: Calendar,
      action: () => navigate("/calendar"),
    },
    {
      name: "Posts",
      description: "View scheduled posts",
      icon: FileText,
      action: () => navigate("/posts"),
    },
    {
      name: "Settings",
      description: "Configure workspace preferences",
      icon: Settings,
      action: () => navigate("/settings"),
    },
    {
      name: "Editor",
      description: "Open Notion-style text editor",
      icon: FileText,
      action: () => navigate("/editor"),
    },
  ];

  const aiCommands = [
    {
      name: "Generate Content",
      description: "Create AI-powered content",
      icon: Zap,
      action: () => console.log("Generate content command"),
    },
    {
      name: "Analyze Performance",
      description: "Get insights on your content",
      icon: TrendingUp,
      action: () => console.log("Analyze performance command"),
    },
    {
      name: "Schedule Post",
      description: "Plan your content calendar",
      icon: Calendar,
      action: () => console.log("Schedule post command"),
    },
    {
      name: "Create Meeting",
      description: "Schedule a new meeting",
      icon: Users,
      action: () => console.log("Create meeting command"),
    },
  ];

  const quickActions = [
    {
      name: "New Project",
      description: "Start a new workspace project",
      icon: Plus,
      action: () => console.log("New project command"),
    },
    {
      name: "Search Files",
      description: "Find documents and assets",
      icon: Search,
      action: () => console.log("Search files command"),
    },
    {
      name: "View Favorites",
      description: "Access your favorite items",
      icon: Heart,
      action: () => navigate("/favorites"),
    },
  ];

  React.useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Type a command, team name, or person's name..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Team Member Results */}
        {filteredTeamMembers.length > 0 && (
          <>
            <CommandGroup heading="Team Members">
              {filteredTeamMembers.map((member) => (
                <CommandItem
                  key={member.id}
                  value={`team-${member.name}`}
                  onSelect={() =>
                    runCommand(() => {
                      if (onOpenTeamCollaboration) {
                        onOpenTeamCollaboration(member.id);
                      }
                    })
                  }
                  className="flex items-center space-x-3"
                >
                  <User className="h-4 w-4 text-blue-400" />
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {member.title} • {member.team}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Navigation">
          {navigationCommands.map((command) => (
            <CommandItem
              key={command.name}
              value={command.name}
              onSelect={() => runCommand(command.action)}
              className="flex items-center space-x-3"
            >
              <command.icon className="h-4 w-4" />
              <div>
                <div className="font-medium">{command.name}</div>
                <div className="text-xs text-muted-foreground">
                  {command.description}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="AI Commands">
          {aiCommands.map((command) => (
            <CommandItem
              key={command.name}
              value={command.name}
              onSelect={() => runCommand(command.action)}
              className="flex items-center space-x-3"
            >
              <command.icon className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium">{command.name}</div>
                <div className="text-xs text-muted-foreground">
                  {command.description}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          {quickActions.map((command) => (
            <CommandItem
              key={command.name}
              value={command.name}
              onSelect={() => runCommand(command.action)}
              className="flex items-center space-x-3"
            >
              <command.icon className="h-4 w-4" />
              <div>
                <div className="font-medium">{command.name}</div>
                <div className="text-xs text-muted-foreground">
                  {command.description}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export { CommandPalette };
