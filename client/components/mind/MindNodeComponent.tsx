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
    side: "top" | "bottom" | "left" | "right",
    position: { x: number; y: number },
  ) => void;
  onConnectionEnd?: (nodeId: string, side: "top" | "bottom" | "left" | "right") => void;
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

// Add function to get color styles
const getColorStyles = (color: string) => {
  // If it's a hex color, use it directly
  if (color.startsWith('#')) {
    return {
      backgroundColor: `${color}20`, // 20% opacity for background
      borderColor: color,
      boxShadow: `0 0 20px ${color}30`, // Subtle glow effect
    };
  }
  
  // Predefined color themes
  const colorMap: Record<string, { bg: string; border: string; shadow: string }> = {
    blue: { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', shadow: 'rgba(59, 130, 246, 0.3)' },
    purple: { bg: 'rgba(139, 92, 246, 0.15)', border: '#8b5cf6', shadow: 'rgba(139, 92, 246, 0.3)' },
    pink: { bg: 'rgba(236, 72, 153, 0.15)', border: '#ec4899', shadow: 'rgba(236, 72, 153, 0.3)' },
    teal: { bg: 'rgba(20, 184, 166, 0.15)', border: '#14b8a6', shadow: 'rgba(20, 184, 166, 0.3)' },
    red: { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', shadow: 'rgba(239, 68, 68, 0.3)' },
    green: { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', shadow: 'rgba(16, 185, 129, 0.3)' },
    orange: { bg: 'rgba(249, 115, 22, 0.15)', border: '#f97316', shadow: 'rgba(249, 115, 22, 0.3)' },
    gray: { bg: 'rgba(107, 114, 128, 0.15)', border: '#6b7280', shadow: 'rgba(107, 114, 128, 0.3)' },
  };
  
  const colorTheme = colorMap[color] || colorMap.blue;
  return {
    backgroundColor: colorTheme.bg,
    borderColor: colorTheme.border,
    boxShadow: `0 0 20px ${colorTheme.shadow}`,
  };
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

  const handleConnectionStart = (e: React.MouseEvent, side: "top" | "bottom" | "left" | "right") => {
    e.stopPropagation();
    e.preventDefault();
    setIsConnecting(true);

    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect && onConnectionStart) {
      // Calculate exact position based on side
      let position;
      switch (side) {
        case "top":
          position = {
            x: node.position.x + node.size.width / 2,
            y: node.position.y,
          };
          break;
        case "bottom":
          position = {
            x: node.position.x + node.size.width / 2,
            y: node.position.y + node.size.height,
          };
          break;
        case "left":
          position = {
            x: node.position.x,
            y: node.position.y + node.size.height / 2,
          };
          break;
        case "right":
          position = {
            x: node.position.x + node.size.width,
            y: node.position.y + node.size.height / 2,
          };
          break;
      }
      onConnectionStart(node.id, side, position);
    }
  };

  const handleConnectionEnd = (e: React.MouseEvent, side: "top" | "bottom" | "left" | "right") => {
    e.stopPropagation();
    if (globalIsConnecting && globalConnectionStart?.nodeId !== node.id && onConnectionEnd) {
      onConnectionEnd(node.id, side);
    }
    setIsConnecting(false);
  };

  // Handle mouse enter for connection targets
  const handleMouseEnterForConnection = (e: React.MouseEvent, side: "top" | "bottom" | "left" | "right") => {
    if (globalIsConnecting && globalConnectionStart?.nodeId !== node.id) {
      e.stopPropagation();
      const rect = nodeRef.current?.getBoundingClientRect();
      if (rect && onConnectionEnd) {
        onConnectionEnd(node.id, side);
      }
    }
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
        onMouseUp={(e) => handleConnectionEnd(e, "bottom")}
      >
        {/* Breadcrumb Trail - appears on hover */}
        {showBreadcrumb && (
          <div
            className="absolute -top-8 left-0 bg-secondary/90 text-visible text-xs px-2 py-1 rounded-md border border-border whitespace-nowrap z-20 animate-fade-in backdrop-blur-md"
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
          style={getColorStyles(node.color)}
        >
          {/* Header with Icon and Title */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3
                className="font-medium text-visible text-sm leading-tight truncate whitespace-pre-wrap"
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
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
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
                    <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>More options</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Content */}
          {node.content && (
            <p className="text-secondary-visible text-xs leading-relaxed mb-3 line-clamp-3">
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
                  className="text-xs px-1.5 py-0.5 bg-secondary/70 border-border text-visible"
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
                    <Avatar className="h-5 w-5 border border-border">
                      <AvatarFallback
                        className={cn(
                          "text-xs font-medium",
                          collaborator.isActive
                            ? "bg-green-600 text-white"
                            : "bg-secondary text-visible",
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
                <div className="h-5 w-5 bg-secondary border border-border rounded-full flex items-center justify-center">
                  <span className="text-xs text-visible font-medium">
                    +{node.collaborators.length - 3}
                  </span>
                </div>
              )}
            </div>

            {/* Collaborator Count */}
            {node.collaborators.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1 text-muted-foreground">
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
                    onMouseDown={(e) => handleConnectionStart(e, "right")}
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
          {(isHovered || globalIsConnecting) && (
            <>
              {/* Top Connection Point */}
              <div
                className={cn(
                  "absolute -top-1.5 left-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 transition-all duration-200 cursor-crosshair z-20 border-2 border-white shadow-lg",
                  isHovered ? "opacity-80 scale-100" : "opacity-60 scale-75",
                  globalIsConnecting && globalConnectionStart?.nodeId !== node.id ? "opacity-100 scale-110 glow-blue animate-pulse" : "",
                )}
                onMouseDown={(e) => handleConnectionStart(e, "top")}
                onMouseEnter={(e) => handleMouseEnterForConnection(e, "top")}
                title="Click and drag to connect"
              />
              
              {/* Bottom Connection Point */}
              <div
                className={cn(
                  "absolute -bottom-1.5 left-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 transition-all duration-200 cursor-crosshair z-20 border-2 border-white shadow-lg",
                  isHovered ? "opacity-80 scale-100" : "opacity-60 scale-75",
                  globalIsConnecting && globalConnectionStart?.nodeId !== node.id ? "opacity-100 scale-110 glow-blue animate-pulse" : "",
                )}
                onMouseDown={(e) => handleConnectionStart(e, "bottom")}
                onMouseEnter={(e) => handleMouseEnterForConnection(e, "bottom")}
                title="Click and drag to connect"
              />
              
              {/* Left Connection Point */}
              <div
                className={cn(
                  "absolute top-1/2 -left-1.5 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2 transition-all duration-200 cursor-crosshair z-20 border-2 border-white shadow-lg",
                  isHovered ? "opacity-80 scale-100" : "opacity-60 scale-75",
                  globalIsConnecting && globalConnectionStart?.nodeId !== node.id ? "opacity-100 scale-110 glow-blue animate-pulse" : "",
                )}
                onMouseDown={(e) => handleConnectionStart(e, "left")}
                onMouseEnter={(e) => handleMouseEnterForConnection(e, "left")}
                title="Click and drag to connect"
              />
              
              {/* Right Connection Point */}
              <div
                className={cn(
                  "absolute top-1/2 -right-1.5 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2 transition-all duration-200 cursor-crosshair z-20 border-2 border-white shadow-lg",
                  isHovered ? "opacity-80 scale-100" : "opacity-60 scale-75",
                  globalIsConnecting && globalConnectionStart?.nodeId !== node.id ? "opacity-100 scale-110 glow-blue animate-pulse" : "",
                )}
                onMouseDown={(e) => handleConnectionStart(e, "right")}
                onMouseEnter={(e) => handleMouseEnterForConnection(e, "right")}
                title="Click and drag to connect"
              />
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
