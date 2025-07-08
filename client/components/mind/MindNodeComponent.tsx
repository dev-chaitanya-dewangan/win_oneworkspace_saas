import * as React from "react";
import { cn } from "@/lib/utils";
import { MindNode } from "./types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ExternalLink,
  MoreHorizontal,
  Users,
  Brain,
  Hash,
  FileText,
  Zap,
  Heart,
  Globe,
  Plus,
} from "lucide-react";

interface MindNodeComponentProps {
  node: MindNode;
  onSelect: () => void;
  onOpenSidebar: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  isDragging: boolean;
  onConnectionStart?: (
    nodeId: string,
    position: { x: number; y: number },
  ) => void;
  onConnectionEnd?: (nodeId: string) => void;
  isConnecting?: boolean;
  connectionStart?: {
    nodeId: string;
    position: { x: number; y: number };
  } | null;
}

const getIconForNode = (node: MindNode) => {
  if (node.title.toLowerCase().includes("mind")) return Brain;
  if (node.title.toLowerCase().includes("demo")) return Globe;
  if (node.title.toLowerCase().includes("visualization")) return Zap;
  if (node.title.toLowerCase().includes("journey")) return Heart;
  if (node.tags.length > 0) return Hash;
  return FileText;
};

export const MindNodeComponent: React.FC<MindNodeComponentProps> = ({
  node,
  onSelect,
  onOpenSidebar,
  onDragStart,
  onContextMenu,
  isDragging,
  onConnectionStart,
  onConnectionEnd,
  isConnecting: globalIsConnecting,
  connectionStart: globalConnectionStart,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [showBreadcrumb, setShowBreadcrumb] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const IconComponent = getIconForNode(node);

  const handleConnectionStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsConnecting(true);

    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect && onConnectionStart) {
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      onConnectionStart(node.id, position);
    }
  };

  const handleConnectionEnd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (globalIsConnecting && onConnectionEnd) {
      onConnectionEnd(node.id);
    }
    setIsConnecting(false);
  };

  React.useEffect(() => {
    if (isConnecting) {
      const handleMouseUp = () => setIsConnecting(false);
      document.addEventListener("mouseup", handleMouseUp);
      return () => document.removeEventListener("mouseup", handleMouseUp);
    }
  }, [isConnecting]);

  return (
    <TooltipProvider>
      <div
        ref={nodeRef}
        className={cn(
          "absolute cursor-move select-none transition-all duration-200 group",
          isDragging && "opacity-75 scale-105",
          isHovered && "z-10",
          globalIsConnecting && "cursor-crosshair",
        )}
        style={{
          left: node.position.x,
          top: node.position.y,
          width: node.size.width,
          minHeight: node.size.height,
        }}
        onMouseDown={onDragStart}
        onMouseEnter={() => {
          setIsHovered(true);
          setShowBreadcrumb(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowBreadcrumb(false);
        }}
        onClick={onSelect}
        onContextMenu={onContextMenu}
        onMouseUp={handleConnectionEnd}
      >
        {/* Breadcrumb Trail - appears on hover */}
        {showBreadcrumb && (
          <div
            className="absolute -top-8 left-0 bg-secondary text-primary text-xs px-2 py-1 rounded-md border border-border whitespace-nowrap z-20 animate-fade-in backdrop-blur-sm"
          >
            {node.breadcrumb}
          </div>
        )}

        {/* Main Node Card */}
        <div
          className={cn(
            "metallic-base relative rounded-lg transition-all duration-200 p-3",
            isHovered && "transform -translate-y-1",
            node.title === "No title makes no sense" && "border-dashed",
            globalIsConnecting && "glow-blue",
          )}
        >
          {/* Header with Icon and Title */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <IconComponent className="h-4 w-4 text-gray-300" />
              </div>
              <h3
                className="font-medium text-primary text-sm leading-tight truncate whitespace-pre-wrap"
              >
                {node.title}
              </h3>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 ml-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-accent/50 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSidebar();
                    }}
                  >
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open in sidebar</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-accent/50 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onContextMenu(e);
                    }}
                  >
                    <MoreHorizontal className="h-3 w-3 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>More options</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Content */}
          {node.content && (
            <p className="text-gray-300 text-xs leading-relaxed mb-3 line-clamp-3">
              {node.content}
            </p>
          )}

          {/* Tags */}
          {node.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {node.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs px-1.5 py-0.5 bg-secondary/50 border-border/50 text-primary"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Footer with Collaborators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {node.collaborators.slice(0, 3).map((collaborator) => (
                <Tooltip key={collaborator.id}>
                  <TooltipTrigger asChild>
                    <Avatar className="h-5 w-5 border border-gray-600/50">
                      <AvatarFallback
                        className={cn(
                          "text-xs font-medium",
                          collaborator.isActive
                            ? "bg-green-600 text-white"
                            : "bg-secondary text-primary",
                        )}
                      >
                        {collaborator.avatar}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex items-center space-x-2">
                      <span>{collaborator.name}</span>
                      {collaborator.isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}

              {node.collaborators.length > 3 && (
                <div className="h-5 w-5 bg-secondary border border-border/50 rounded-full flex items-center justify-center">
                  <span className="text-xs text-primary font-medium">
                    +{node.collaborators.length - 3}
                  </span>
                </div>
              )}
            </div>

            {/* Collaborator Count */}
            {node.collaborators.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Users className="h-3 w-3" />
                    <span className="text-xs">{node.collaborators.length}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <div className="font-medium">
                      👥 {node.collaborators.length} collaborator
                      {node.collaborators.length !== 1 ? "s" : ""}
                    </div>
                    {node.collaborators.map((collab) => (
                      <div
                        key={collab.id}
                        className="flex items-center space-x-2"
                      >
                        <span>{collab.name}</span>
                        {collab.isActive && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Connection Plus Icon - appears on hover */}
          {isHovered && !globalIsConnecting && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="metallic-button absolute -top-2 -right-2 h-6 w-6 p-0 text-white hover:glow-blue transition-all duration-200 z-10"
                  onMouseDown={handleConnectionStart}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Click and hold to connect to another node
              </TooltipContent>
            </Tooltip>
          )}

          {/* Connection Border Handles */}
          {isHovered && (
            <>
              <div
                className="absolute -top-1 left-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-crosshair z-10 hover:bg-blue-400"
                onMouseDown={handleConnectionStart}
                title="Drag to connect"
              />
              <div
                className="absolute -bottom-1 left-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-crosshair z-10 hover:bg-blue-400"
                onMouseDown={handleConnectionStart}
                title="Drag to connect"
              />
              <div
                className="absolute top-1/2 -left-1 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-crosshair z-10 hover:bg-blue-400"
                onMouseDown={handleConnectionStart}
                title="Drag to connect"
              />
              <div
                className="absolute top-1/2 -right-1 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-crosshair z-10 hover:bg-blue-400"
                onMouseDown={handleConnectionStart}
                title="Drag to connect"
              />
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
