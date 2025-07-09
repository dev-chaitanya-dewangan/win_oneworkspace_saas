import * as React from "react";
import { cn } from "@/lib/utils";
import { CommandInput } from "@/components/ui/command-input";
import { DynamicIslandInput } from "@/components/ui/dynamic-island-input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ActionSearchBar } from "@/components/ui/action-search-bar";
import { CommandPalette } from "@/components/ui/command-palette";
import { TeamCollaboration } from "@/components/team/TeamCollaboration";
import { MessagingInterface } from "@/components/messaging/MessagingInterface";
import { NeonCard } from "@/components/ui/neon-card";
import { toast } from "sonner";
import {
  Settings,
  LogOut,
  Keyboard,
  Command,
  Search,
  Mic,
  MessageCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolbarProps {
  className?: string;
  onCommand?: (command: string) => void;
  aiFeed?: Array<{ title: string; details: string[] }>;
  setAiFeed?: React.Dispatch<
    React.SetStateAction<Array<{ title: string; details: string[] }>>
  >;
  onOpenSearch?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  className,
  onCommand,
  aiFeed = [],
  setAiFeed,
  onOpenSearch,
}) => {
  const [actionSearchOpen, setActionSearchOpen] = React.useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);
  const [teamCollaborationOpen, setTeamCollaborationOpen] =
    React.useState(false);
  const [messagingInterfaceOpen, setMessagingInterfaceOpen] =
    React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const [showMobileCommandInput, setShowMobileCommandInput] =
    React.useState(false);

  // Global keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      // Note: Ctrl+> is handled directly in DynamicIslandInput component
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCommand = async (command: string) => {
    setIsProcessing(true);
    onCommand?.(command);

    // Simulate AI processing
    setTimeout(() => {
      const newItem = {
        title: `Created: ${command}`,
        details: [
          `Processed at ${new Date().toLocaleTimeString()}`,
          "AI analysis complete",
          "Ready for review",
        ],
      };

      setAiFeed?.((prev) => [newItem, ...prev]);
      setIsProcessing(false);

      toast.success("AI Command Completed", {
        description: `Successfully processed: ${command.slice(0, 50)}${
          command.length > 50 ? "..." : ""
        }`,
      });
    }, 1200);
  };

  // Recording timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleVoiceInput = () => {
    toast.info("Voice Recording", {
      description: "Listening... Speak your command now.",
    });
  };

  const handleMobileVoiceStart = () => {
    // Request microphone permission
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        setIsRecording(true);
        toast.info("Recording started", {
          description: "Speak your command...",
        });
      })
      .catch(() => {
        toast.error("Microphone permission denied");
      });
  };

  const handleMobileVoiceEnd = () => {
    setIsRecording(false);
    toast.success("Recording completed", {
      description: "Analyzing your command...",
    });

    // Simulate AI processing
    setTimeout(() => {
      toast.success("Command processed successfully!");
      setShowMobileCommandInput(false);
    }, 2000);
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOpenTeamCollaboration = (memberId?: string) => {
    setTeamCollaborationOpen(true);
    // If a specific member is selected, we could pass that to the component
    if (memberId) {
      console.log("Open team collaboration for member:", memberId);
    }
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background/60 backdrop-blur-sm px-4",
          className,
        )}
      >
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
        </div>

        {/* Center - Dynamic Island Input integrated in toolbar */}
        <div className="flex-1 flex justify-center items-center px-4">
          <DynamicIslandInput
            onCommand={handleCommand}
            onVoiceInput={handleVoiceInput}
            disabled={isProcessing}
          />
        </div>

        <div className="flex items-center space-x-2">

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMessagingInterfaceOpen(true)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Messages & Scheduling</p>
              <p className="text-xs text-muted-foreground">
                Gmail integration and calendar
              </p>
            </TooltipContent>
          </Tooltip>

          

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Processing indicator */}
      {isProcessing && (
        <div className="fixed top-20 right-4 z-50">
          <NeonCard loading variant="outline" className="w-64" />
        </div>
      )}

      <ActionSearchBar
        open={actionSearchOpen}
        onOpenChange={setActionSearchOpen}
      />

      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onOpenTeamCollaboration={handleOpenTeamCollaboration}
      />

      <TeamCollaboration
        isOpen={teamCollaborationOpen}
        onClose={() => setTeamCollaborationOpen(false)}
        onNavigateToNode={(nodeId, position) => {
          // Handle navigation to mind map nodes
          console.log("Navigate to node:", nodeId, position);
          // In a real app, this would navigate to the mind map and highlight the node
        }}
      />

      <MessagingInterface
        isOpen={messagingInterfaceOpen}
        onClose={() => setMessagingInterfaceOpen(false)}
      />
    </TooltipProvider>
  );
};

export { Toolbar };
