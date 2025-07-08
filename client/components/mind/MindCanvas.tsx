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
  onNodeUpdate: (nodeId: string, updates: Partial<MindNode>) => void;
  onNodeSelect: (nodeId: string) => void;
  onNodeOpenSidebar: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onCreateNode: (title: string, position?: { x: number; y: number }) => void;
}

export const MindCanvas: React.FC<MindCanvasProps> = ({
  nodes,
  connections,
  onNodeUpdate,
  onNodeSelect,
  onNodeOpenSidebar,
  onDeleteNode,
  onDuplicateNode,
  onCreateNode,
}) => {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = React.useState<CanvasViewport>({
    x: 0,
    y: 0,
    zoom: 1,
  });
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
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [connectionStart, setConnectionStart] = React.useState<{
    nodeId: string;
    position: { x: number; y: number };
  } | null>(null);

  // Keyboard event handlers
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
        setIsPanning(false);
        setPanStart(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Handle canvas panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (isSpacePressed) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && panStart && isSpacePressed) {
      setViewport((prev) => ({
        ...prev,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      }));
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

  const handleMouseUp = () => {
    setIsPanning(false);
    setPanStart(null);
    setDragState({ isDragging: false });
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

        setViewport((prev) => ({
          ...prev,
          zoom: newZoom,
          x: mouseX - (mouseX - prev.x) * (newZoom / prev.zoom),
          y: mouseY - (mouseY - prev.y) * (newZoom / prev.zoom),
        }));
      }
    } else if (!isSpacePressed) {
      // Normal scroll - pan the viewport
      setViewport((prev) => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
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
      if (dragState.isDragging && dragState.nodeId && dragState.offset) {
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
      setIsPanning(false);
      setPanStart(null);
    };

    if (dragState.isDragging) {
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
    viewport,
    onNodeUpdate,
  ]);

  // Close context menu when clicking elsewhere
  React.useEffect(() => {
    const handleClick = () =>
      setContextMenu({ isOpen: false, position: { x: 0, y: 0 } });
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-950">
      {/* Canvas Toolbar */}
      <CanvasToolbar
        viewport={viewport}
        onZoomIn={() =>
          setViewport((prev) => ({
            ...prev,
            zoom: Math.min(3, prev.zoom * 1.2),
          }))
        }
        onZoomOut={() =>
          setViewport((prev) => ({
            ...prev,
            zoom: Math.max(0.1, prev.zoom / 1.2),
          }))
        }
        onResetView={() => setViewport({ x: 0, y: 0, zoom: 1 })}
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

              setViewport({
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
          cursor: isPanning ? "grabbing" : isSpacePressed ? "grab" : "default",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
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
          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                radial-gradient(circle, #374151 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0",
              width: "5000px",
              height: "5000px",
              left: "-2500px",
              top: "-2500px",
            }}
          />

          {/* Connections */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{
              width: "5000px",
              height: "5000px",
              left: "-2500px",
              top: "-2500px",
            }}
          >
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
              onConnectionStart={(nodeId, position) => {
                setIsConnecting(true);
                setConnectionStart({ nodeId, position });
              }}
              onConnectionEnd={(nodeId) => {
                if (connectionStart && connectionStart.nodeId !== nodeId) {
                  // Create new connection
                  console.log(`Connect ${connectionStart.nodeId} to ${nodeId}`);
                  // Here you would call a function to create the actual connection
                }
                setIsConnecting(false);
                setConnectionStart(null);
              }}
              isConnecting={isConnecting}
              connectionStart={connectionStart}
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
