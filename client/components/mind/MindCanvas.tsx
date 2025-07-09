import * as React from "react";
import { cn } from "@/lib/utils";
import {
  MindNode,
  Connection,
  CanvasViewport,
  DragState,
  ContextMenuState,
} from "./types";
import { MindNodeComponent } from "./MindNodeComponent";
import { ConnectionLine } from "./ConnectionLine";
import { ContextMenu } from "./ContextMenu";
import { CanvasToolbar } from "./CanvasToolbar";

interface MindCanvasProps {
  nodes: MindNode[];
  connections: Connection[];
  viewport: CanvasViewport;
  connectionState: {
    isConnecting: boolean;
    fromNodeId: string | null;
    fromSide: "top" | "bottom" | "left" | "right" | null;
    fromPosition: { x: number; y: number } | null;
  };
  failedConnection?: {
    isAnimating: boolean;
    fromPosition: { x: number; y: number } | null;
    toPosition: { x: number; y: number } | null;
  };
  onNodeUpdate: (nodeId: string, updates: Partial<MindNode>) => void;
  onNodeSelect: (nodeId: string) => void;
  onNodeOpenSidebar: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onCreateNode: (title: string, position?: { x: number; y: number }) => void;
  onConnectionStart: (nodeId: string, side: "top" | "bottom" | "left" | "right", position: { x: number; y: number }) => void;
  onConnectionEnd: (nodeId: string, side: "top" | "bottom" | "left" | "right") => void;
  onConnectionCancel?: (mousePosition: { x: number; y: number }) => void;
  onViewportChange: (viewport: CanvasViewport) => void;
}

export const MindCanvas: React.FC<MindCanvasProps> = ({
  nodes,
  connections,
  viewport,
  connectionState,
  failedConnection,
  onNodeUpdate,
  onNodeSelect,
  onNodeOpenSidebar,
  onDeleteNode,
  onDuplicateNode,
  onCreateNode,
  onConnectionStart,
  onConnectionEnd,
  onConnectionCancel,
  onViewportChange,
}) => {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = React.useState<DragState>({
    isDragging: false,
  });
  const [contextMenu, setContextMenu] = React.useState<ContextMenuState>({
    isOpen: false,
    position: { x: 0, y: 0 },
  });
  const [isPanning, setIsPanning] = React.useState(false);
  const [panStart, setPanStart] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isSpacePressed, setIsSpacePressed] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Keyboard event handlers
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
        document.body.style.cursor = "grab";
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsSpacePressed(false);
        setIsPanning(false);
        setPanStart(null);
        document.body.style.cursor = "default";
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.body.style.cursor = "default";
    };
  }, []);

  // Handle canvas panning and double-click to create nodes
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (connectionState.isConnecting && onConnectionCancel) {
        // Cancel connection attempt with snap-back animation
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const mousePos = {
            x: (e.clientX - rect.left - viewport.x) / viewport.zoom,
            y: (e.clientY - rect.top - viewport.y) / viewport.zoom,
          };
          onConnectionCancel(mousePos);
        }
      } else if (isSpacePressed) {
        e.preventDefault();
        setIsPanning(true);
        setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
        document.body.style.cursor = "grabbing";
      }
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const canvasX = (e.clientX - rect.left - viewport.x) / viewport.zoom;
        const canvasY = (e.clientY - rect.top - viewport.y) / viewport.zoom;
        onCreateNode("New Node", { x: canvasX, y: canvasY });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Update mouse position for connection preview
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({
        x: (e.clientX - rect.left - viewport.x) / viewport.zoom,
        y: (e.clientY - rect.top - viewport.y) / viewport.zoom,
      });
    }

    if (isPanning && panStart && isSpacePressed) {
      e.preventDefault();
      onViewportChange({
        ...viewport,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    } else if (dragState.isDragging && dragState.nodeId && dragState.offset) {
      e.preventDefault();
      if (rect) {
        const newPosition = {
          x:
            (e.clientX - rect.left - viewport.x) / viewport.zoom -
            dragState.offset.x,
          y:
            (e.clientY - rect.top - viewport.y) / viewport.zoom -
            dragState.offset.y,
        };
        onNodeUpdate(dragState.nodeId, { position: newPosition });
      }
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      setPanStart(null);
      document.body.style.cursor = isSpacePressed ? "grab" : "default";
    }
    if (dragState.isDragging) {
      setDragState({ isDragging: false });
    }
  };

  // Handle zoom (trackpad pinch and wheel)
  const handleWheel = (e: React.WheelEvent) => {
    // Check if it's a zoom gesture (Ctrl+wheel or trackpad pinch)
    if (e.ctrlKey || Math.abs(e.deltaY) > 50) {
      e.preventDefault();

      // Determine zoom direction and amount
      let delta;
      if (e.ctrlKey) {
        // Ctrl+wheel: use deltaY
        delta = e.deltaY > 0 ? 0.9 : 1.1;
      } else {
        // Trackpad pinch: more sensitive
        delta = e.deltaY > 0 ? 0.95 : 1.05;
      }

      const newZoom = Math.max(0.1, Math.min(3, viewport.zoom * delta));

      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        onViewportChange({
          ...viewport,
          zoom: newZoom,
          x: mouseX - (mouseX - viewport.x) * (newZoom / viewport.zoom),
          y: mouseY - (mouseY - viewport.y) * (newZoom / viewport.zoom),
        });
      }
    } else if (!isSpacePressed) {
      // Normal scroll - pan the viewport
      onViewportChange({
        ...viewport,
        x: viewport.x - e.deltaX,
        y: viewport.y - e.deltaY,
      });
    }
  };

  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent, nodeId?: string) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      nodeId,
    });
  };

  // Handle node drag start
  const handleNodeDragStart = (nodeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (canvasRect) {
        const canvasX =
          (e.clientX - canvasRect.left - viewport.x) / viewport.zoom;
        const canvasY =
          (e.clientY - canvasRect.top - viewport.y) / viewport.zoom;

        setDragState({
          isDragging: true,
          nodeId,
          offset: {
            x: canvasX - node.position.x,
            y: canvasY - node.position.y,
          },
        });
      }
    }
  };

  // Global mouse handlers for proper drag behavior
  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isPanning && panStart && isSpacePressed) {
        e.preventDefault();
        onViewportChange({
          ...viewport,
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      } else if (dragState.isDragging && dragState.nodeId && dragState.offset) {
        e.preventDefault();
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const newPosition = {
            x:
              (e.clientX - rect.left - viewport.x) / viewport.zoom -
              dragState.offset.x,
            y:
              (e.clientY - rect.top - viewport.y) / viewport.zoom -
              dragState.offset.y,
          };
          onNodeUpdate(dragState.nodeId, { position: newPosition });
        }
      }
    };

    const handleGlobalMouseUp = () => {
      if (dragState.isDragging) {
        setDragState({ isDragging: false });
      }
      if (isPanning) {
        setIsPanning(false);
        setPanStart(null);
        document.body.style.cursor = isSpacePressed ? "grab" : "default";
      }
    };

    if (dragState.isDragging || isPanning) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [
    dragState.isDragging,
    dragState.nodeId,
    dragState.offset,
    isPanning,
    panStart,
    isSpacePressed,
    viewport,
    onNodeUpdate,
    onViewportChange,
  ]);

  // Close context menu when clicking elsewhere
  React.useEffect(() => {
    const handleClick = () =>
      setContextMenu({ isOpen: false, position: { x: 0, y: 0 } });
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Canvas Toolbar */}
      <CanvasToolbar
        viewport={viewport}
        onZoomIn={() =>
          onViewportChange({
            ...viewport,
            zoom: Math.min(3, viewport.zoom * 1.2),
          })
        }
        onZoomOut={() =>
          onViewportChange({
            ...viewport,
            zoom: Math.max(0.1, viewport.zoom / 1.2),
          })
        }
        onResetView={() => onViewportChange({ x: 0, y: 0, zoom: 1 })}
        onFitToScreen={() => {
          // Calculate bounds of all nodes and fit them in view
          if (nodes.length > 0) {
            const bounds = nodes.reduce(
              (acc, node) => ({
                minX: Math.min(acc.minX, node.position.x),
                minY: Math.min(acc.minY, node.position.y),
                maxX: Math.max(acc.maxX, node.position.x + node.size.width),
                maxY: Math.max(acc.maxY, node.position.y + node.size.height),
              }),
              {
                minX: Infinity,
                minY: Infinity,
                maxX: -Infinity,
                maxY: -Infinity,
              },
            );

            const padding = 100;
            const boundsWidth = bounds.maxX - bounds.minX + padding * 2;
            const boundsHeight = bounds.maxY - bounds.minY + padding * 2;

            const canvasRect = canvasRef.current?.getBoundingClientRect();
            if (canvasRect) {
              const scaleX = canvasRect.width / boundsWidth;
              const scaleY = canvasRect.height / boundsHeight;
              const zoom = Math.min(scaleX, scaleY, 1);

              onViewportChange({
                x:
                  canvasRect.width / 2 - (bounds.minX + boundsWidth / 2) * zoom,
                y:
                  canvasRect.height / 2 -
                  (bounds.minY + boundsHeight / 2) * zoom,
                zoom,
              });
            }
          }
        }}
      />

      {/* Main Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full"
        style={{
          cursor: connectionState.isConnecting 
            ? "crosshair" 
            : isPanning 
            ? "grabbing" 
            : isSpacePressed 
            ? "grab" 
            : "default",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        onContextMenu={(e) => handleContextMenu(e)}
      >
        {/* Canvas Transform Container */}
        <div
          className="relative origin-top-left"
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          }}
        >
          {/* Enhanced Grid Background - Black with tinted transparent dots */}
          <div
            className="absolute inset-0"
            style={{
              width: "10000px",
              height: "10000px",
              left: "-5000px",
              top: "-5000px",
              backgroundColor: "#000000",
              backgroundImage: `
                radial-gradient(circle, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                radial-gradient(circle, rgba(147, 51, 234, 0.2) 1px, transparent 1px),
                radial-gradient(circle, rgba(236, 72, 153, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px, 100px 100px, 75px 75px",
              backgroundPosition: "0 0, 25px 25px, 37.5px 37.5px",
              opacity: 0.4,
            }}
          />
          
          {/* Major grid lines */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              width: "10000px",
              height: "10000px",
              left: "-5000px",
              top: "-5000px",
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "200px 200px",
            }}
          />

          {/* Connections */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{
              width: "10000px",
              height: "10000px",
              left: "-5000px",
              top: "-5000px",
            }}
          >
            <defs>
              {/* Main arrow marker - White Metallic */}
              <marker
                id="arrowhead"
                markerWidth="12"
                markerHeight="10"
                refX="11"
                refY="5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path
                  d="M 0 0 L 12 5 L 0 10 z"
                  fill="rgba(255, 255, 255, 0.9)"
                  stroke="rgba(255, 255, 255, 0.6)"
                  strokeWidth="0.5"
                />
              </marker>
              
              {/* Preview arrow marker - White Metallic with glow */}
              <marker
                id="arrowhead-preview"
                markerWidth="12"
                markerHeight="10"
                refX="11"
                refY="5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path
                  d="M 0 0 L 12 5 L 0 10 z"
                  fill="rgba(255, 255, 255, 0.8)"
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="0.5"
                  filter="drop-shadow(0 0 3px rgba(255, 255, 255, 0.6))"
                />
              </marker>
              
              {/* Metallic gradient for arrows */}
              <linearGradient id="metallic-arrow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
                <stop offset="50%" stopColor="rgba(240, 240, 240, 1)" />
                <stop offset="100%" stopColor="rgba(220, 220, 220, 0.9)" />
              </linearGradient>
            </defs>

            {connections.map((connection) => {
              const fromNode = nodes.find(
                (n) => n.id === connection.fromNodeId,
              );
              const toNode = nodes.find((n) => n.id === connection.toNodeId);
              if (!fromNode || !toNode) return null;

              return (
                <ConnectionLine
                  key={connection.id}
                  connection={connection}
                  fromNode={fromNode}
                  toNode={toNode}
                />
              );
            })}

            {/* Active connection preview with arrow - White Metallic */}
            {connectionState.isConnecting && connectionState.fromPosition && (
              <line
                x1={connectionState.fromPosition.x}
                y1={connectionState.fromPosition.y}
                x2={mousePosition.x}
                y2={mousePosition.y}
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth="3"
                strokeDasharray="8,4"
                markerEnd="url(#arrowhead-preview)"
                className="animate-pulse"
                filter="drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))"
              />
            )}

            {/* Failed connection snap-back animation */}
            {failedConnection?.isAnimating && failedConnection.fromPosition && failedConnection.toPosition && (
              <line
                x1={failedConnection.fromPosition.x}
                y1={failedConnection.fromPosition.y}
                x2={failedConnection.toPosition.x}
                y2={failedConnection.toPosition.y}
                stroke="rgba(239, 68, 68, 0.8)"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-snap-back animate-wiggle"
              />
            )}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <MindNodeComponent
              key={node.id}
              node={node}
              onSelect={() => onNodeSelect(node.id)}
              onOpenSidebar={() => onNodeOpenSidebar(node.id)}
              onDragStart={(e) => handleNodeDragStart(node.id, e)}
              onContextMenu={(e) => handleContextMenu(e, node.id)}
              isDragging={dragState.nodeId === node.id}
              onConnectionStart={onConnectionStart}
              onConnectionEnd={onConnectionEnd}
              isConnecting={connectionState.isConnecting}
              connectionStart={connectionState.fromNodeId ? {
                nodeId: connectionState.fromNodeId,
                position: connectionState.fromPosition || { x: 0, y: 0 }
              } : null}
            />
          ))}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.isOpen && (
        <ContextMenu
          position={contextMenu.position}
          nodeId={contextMenu.nodeId}
          onClose={() =>
            setContextMenu({ isOpen: false, position: { x: 0, y: 0 } })
          }
          onOpen={(nodeId) => nodeId && onNodeOpenSidebar(nodeId)}
          onOpenSidebar={(nodeId) => nodeId && onNodeOpenSidebar(nodeId)}
          onDuplicate={(nodeId) => nodeId && onDuplicateNode(nodeId)}
          onCreateNote={() =>
            onCreateNode("New Note", {
              x: (contextMenu.position.x - viewport.x) / viewport.zoom,
              y: (contextMenu.position.y - viewport.y) / viewport.zoom,
            })
          }
          onDelete={(nodeId) => nodeId && onDeleteNode(nodeId)}
        />
      )}
    </div>
  );
};
