import * as React from "react";
import { cn } from "@/lib/utils";
import { MindNode } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import {
  X,
  Save,
  Share,
  Link,
  Users,
  Hash,
  Palette,
  Clock,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

interface MindSidebarProps {
  node: MindNode;
  isOpen: boolean;
  onClose: () => void;
  onNodeUpdate: (updates: Partial<MindNode>) => void;
}

export const MindSidebar: React.FC<MindSidebarProps> = ({
  node,
  isOpen,
  onClose,
  onNodeUpdate,
}) => {
  const [title, setTitle] = React.useState(node.title);
  const [content, setContent] = React.useState(node.content);
  const [newTag, setNewTag] = React.useState("");
  const [customColor, setCustomColor] = React.useState("#3b82f6");
  const [isColorPickerOpen, setIsColorPickerOpen] = React.useState(false);

  React.useEffect(() => {
    setTitle(node.title);
    setContent(node.content);
    // Update custom color if node has a hex color
    if (node.color.startsWith('#')) {
      setCustomColor(node.color);
    }
  }, [node]);

  const handleSave = () => {
    onNodeUpdate({
      title: title.trim(), // Only trim leading/trailing spaces, preserve internal spaces
      content,
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow all characters including spaces - no filtering
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Allow all characters including spaces - no filtering
    setContent(e.target.value);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !node.tags.includes(newTag.trim())) {
      onNodeUpdate({
        tags: [...node.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onNodeUpdate({
      tags: node.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleColorChange = (newColor: string) => {
    onNodeUpdate({ color: newColor });
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    onNodeUpdate({ color });
  };

  const colors = [
    { name: "Blue", value: "blue", class: "bg-blue-500", hex: "#3b82f6" },
    { name: "Purple", value: "purple", class: "bg-purple-500", hex: "#8b5cf6" },
    { name: "Pink", value: "pink", class: "bg-pink-500", hex: "#ec4899" },
    { name: "Teal", value: "teal", class: "bg-teal-500", hex: "#14b8a6" },
    { name: "Red", value: "red", class: "bg-red-500", hex: "#ef4444" },
    { name: "Green", value: "green", class: "bg-green-500", hex: "#10b981" },
    { name: "Orange", value: "orange", class: "bg-orange-500", hex: "#f97316" },
    { name: "Gray", value: "gray", class: "bg-muted", hex: "#6b7280" },
  ];

  return (
    <TooltipProvider>
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-96 metallic-base border-l border-border/30 shadow-2xl z-50 transform transition-all duration-300 ease-in-out backdrop-blur-xl",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        style={{
          background: "linear-gradient(145deg, #0f0f0f 0%, #000000 100%)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/20 bg-secondary/20 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-visible">Edit Node</h2>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                    className="metallic-button h-8 w-8 p-0 text-muted-foreground hover:text-visible"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save changes</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log("Share node")}
                    className="metallic-button h-8 w-8 p-0 text-muted-foreground hover:text-visible"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share</TooltipContent>
              </Tooltip>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="metallic-button h-8 w-8 p-0 text-muted-foreground hover:text-visible"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar">
            {/* Breadcrumb */}
            <div className="text-sm text-muted-visible bg-secondary/30 rounded-lg p-2 border border-border/20">
              <span>{node.breadcrumb}</span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-visible">Title</label>
              <Input
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter node title..."
                className="metallic-base bg-secondary/50 border-border/30 text-visible focus:border-accent placeholder:text-muted-foreground"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-visible">
                Content
              </label>
              <Textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Enter node content..."
                rows={6}
                className="metallic-base bg-secondary/50 border-border/30 text-visible focus:border-accent placeholder:text-muted-foreground resize-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-secondary-visible flex items-center">
                <Hash className="h-4 w-4 mr-1" />
                Tags
              </label>

              <div className="flex flex-wrap gap-2 mb-3">
                {node.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="metallic-base bg-secondary/70 border-border/50 text-visible pr-1"
                  >
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTag(tag)}
                      className="h-4 w-4 p-0 ml-1 hover:bg-accent/50 text-muted-foreground hover:text-visible"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  className="metallic-base bg-secondary/50 border-border/30 text-visible focus:border-accent placeholder:text-muted-foreground"
                />
                <Button
                  onClick={handleAddTag}
                  size="sm"
                  className="metallic-button bg-accent hover:bg-accent/80 text-accent-foreground"
                >
                  Add
                </Button>
              </div>
            </div>

            <Separator className="bg-border/30" />

            {/* Collaborators */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-secondary-visible flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Collaborators ({node.collaborators.length})
              </label>

              <div className="space-y-2">
                {node.collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between p-3 metallic-base bg-secondary/30 rounded-lg border border-border/20"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback
                          className={cn(
                            "text-xs",
                            collaborator.isActive
                              ? "bg-green-600 text-white"
                              : "bg-secondary text-visible",
                          )}
                        >
                          {collaborator.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-secondary-visible">
                        {collaborator.name}
                      </span>
                      {collaborator.isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full glow-green" />
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-accent/50 text-muted-foreground hover:text-visible"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full metallic-button border-border/30 text-visible hover:bg-accent/20"
              >
                <Users className="h-4 w-4 mr-2" />
                Invite Collaborator
              </Button>
            </div>

            <Separator className="bg-border/30" />

            {/* Metadata */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-secondary-visible flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Details
              </label>

              <div className="space-y-2 text-sm text-muted-visible bg-secondary/20 rounded-lg p-3 border border-border/20">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>2 days ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Modified:</span>
                  <span>1 hour ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Connections:</span>
                  <span>3 links</span>
                </div>
              </div>
            </div>

            <Separator className="bg-border/30" />

            {/* Enhanced Color Selection */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-secondary-visible flex items-center">
                <Palette className="h-4 w-4 mr-1" />
                Color Theme
              </label>

              {/* Preset Colors */}
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <Tooltip key={color.value}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleColorChange(color.value)}
                        className={cn(
                          "h-10 rounded-lg border-2 transition-all metallic-base",
                          color.class,
                          node.color === color.value
                            ? "border-white shadow-lg scale-105 glow-blue"
                            : "border-border/50 hover:border-border",
                        )}
                        style={{ backgroundColor: color.hex }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>{color.name}</TooltipContent>
                  </Tooltip>
                ))}
              </div>

              {/* Custom Color Picker */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-visible">Custom Color</label>
                <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-10 metallic-base border-border/30 justify-between text-visible hover:bg-accent/20"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded border border-border/50"
                          style={{ backgroundColor: customColor }}
                        />
                        <span className="text-sm">{customColor.toUpperCase()}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 metallic-base border-border/30" side="left">
                    <div className="p-4 space-y-4">
                      <HexColorPicker
                        color={customColor}
                        onChange={setCustomColor}
                        style={{
                          width: "200px",
                          height: "150px"
                        }}
                      />
                      <div className="flex space-x-2">
                        <Input
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                          className="metallic-base bg-secondary/50 border-border/30 text-visible text-xs"
                          placeholder="#000000"
                        />
                        <Button
                          onClick={() => {
                            handleCustomColorChange(customColor);
                            setIsColorPickerOpen(false);
                          }}
                          size="sm"
                          className="metallic-button bg-accent hover:bg-accent/80 text-accent-foreground"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/20 bg-secondary/10 backdrop-blur-sm">
            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                className="flex-1 metallic-button bg-blue-600 hover:bg-blue-700 text-white glow-blue"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="metallic-button border-border/30 text-visible hover:bg-accent/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
