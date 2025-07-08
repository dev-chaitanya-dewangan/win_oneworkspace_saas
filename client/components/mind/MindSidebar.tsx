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
  X,
  Save,
  Share,
  Link,
  Users,
  Hash,
  Palette,
  Clock,
  ExternalLink,
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

  React.useEffect(() => {
    setTitle(node.title);
    setContent(node.content);
  }, [node]);

  const handleSave = () => {
    onNodeUpdate({
      title: title.trim(), // Only trim leading/trailing spaces, preserve internal spaces
      content,
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Preserve all internal spaces
    setTitle(e.target.value);
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

  const colors = [
    { name: "Blue", value: "blue", class: "bg-blue-500" },
    { name: "Purple", value: "purple", class: "bg-purple-500" },
    { name: "Pink", value: "pink", class: "bg-pink-500" },
    { name: "Teal", value: "teal", class: "bg-teal-500" },
    { name: "Red", value: "red", class: "bg-red-500" },
    { name: "Gray", value: "gray", class: "bg-muted" },
  ];

  return (
    <TooltipProvider>
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-96 bg-secondary border-l border-border shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-gray-100">Edit Node</h2>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                    className="h-8 w-8 p-0 hover:bg-accent/50 text-muted-foreground"
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
                    className="h-8 w-8 p-0 hover:bg-accent/50 text-muted-foreground"
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
                className="h-8 w-8 p-0 hover:bg-accent/50 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Breadcrumb */}
            <div className="text-sm text-muted-foreground">
              <span>{node.breadcrumb}</span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Title</label>
              <Input
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter node title..."
                className="bg-secondary border-border text-primary focus:border-primary"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Content
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter node content..."
                rows={6}
                className="bg-secondary border-border text-primary focus:border-primary resize-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300 flex items-center">
                <Hash className="h-4 w-4 mr-1" />
                Tags
              </label>

              <div className="flex flex-wrap gap-2 mb-3">
                {node.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-secondary/50 border-border/50 text-primary pr-1"
                  >
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTag(tag)}
                      className="h-4 w-4 p-0 ml-1 hover:bg-accent/50"
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
                  className="bg-secondary border-border text-primary focus:border-primary"
                />
                <Button
                  onClick={handleAddTag}
                  size="sm"
                  className="bg-secondary hover:bg-accent text-primary"
                >
                  Add
                </Button>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Color Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300 flex items-center">
                <Palette className="h-4 w-4 mr-1" />
                Color Theme
              </label>

              <div className="grid grid-cols-3 gap-2">
                {colors.map((color) => (
                  <Tooltip key={color.value}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleColorChange(color.value)}
                        className={cn(
                          "h-10 rounded-lg border-2 transition-all",
                          color.class,
                          node.color === color.value
                            ? "border-white shadow-lg scale-105"
                            : "border-gray-600 hover:border-gray-500",
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent>{color.name}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Collaborators */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300 flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Collaborators ({node.collaborators.length})
              </label>

              <div className="space-y-2">
                {node.collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback
                          className={cn(
                            "text-xs",
                            collaborator.isActive
                              ? "bg-green-600 text-white"
                              : "bg-secondary text-primary",
                          )}
                        >
                          {collaborator.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-300">
                        {collaborator.name}
                      </span>
                      {collaborator.isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-accent/50 text-muted-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full bg-secondary border-border text-primary hover:bg-accent"
              >
                <Users className="h-4 w-4 mr-2" />
                Invite Collaborator
              </Button>
            </div>

            <Separator className="bg-border" />

            {/* Metadata */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Details
              </label>

              <div className="space-y-2 text-sm text-gray-400">
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
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-secondary border-border text-primary hover:bg-accent"
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
