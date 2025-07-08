import * as React from "react";
import { Connection, MindNode } from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface ConnectionLineProps {
  connection: Connection;
  fromNode: MindNode;
  toNode: MindNode;
}

const getConnectionPoint = (
  node: MindNode,
  side: "top" | "bottom" | "left" | "right",
) => {
  const { x, y } = node.position;
  const { width, height } = node.size;

  switch (side) {
    case "top":
      return { x: x + width / 2, y: y };
    case "bottom":
      return { x: x + width / 2, y: y + height };
    case "left":
      return { x: x, y: y + height / 2 };
    case "right":
      return { x: x + width, y: y + height / 2 };
    default:
      return { x: x + width / 2, y: y + height / 2 };
  }
};

const createCurvedPath = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  fromSide: string,
  toSide: string,
) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Control point offset based on distance and direction
  const offset = Math.min(distance * 0.3, 100);

  let cp1 = { x: start.x, y: start.y };
  let cp2 = { x: end.x, y: end.y };

  // Adjust control points based on connection sides
  switch (fromSide) {
    case "top":
      cp1.y -= offset;
      break;
    case "bottom":
      cp1.y += offset;
      break;
    case "left":
      cp1.x -= offset;
      break;
    case "right":
      cp1.x += offset;
      break;
  }

  switch (toSide) {
    case "top":
      cp2.y -= offset;
      break;
    case "bottom":
      cp2.y += offset;
      break;
    case "left":
      cp2.x -= offset;
      break;
    case "right":
      cp2.x += offset;
      break;
  }

  return `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;
};

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  fromNode,
  toNode,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const startPoint = getConnectionPoint(fromNode, connection.fromSide);
  const endPoint = getConnectionPoint(toNode, connection.toSide);
  const pathData = createCurvedPath(
    startPoint,
    endPoint,
    connection.fromSide,
    connection.toSide,
  );

  // Calculate midpoint for the context button
  const midX = (startPoint.x + endPoint.x) / 2;
  const midY = (startPoint.y + endPoint.y) / 2;

  return (
    <TooltipProvider>
      <g>
        {/* Connection Path */}
        <path
          d={pathData}
          stroke="rgba(156, 163, 175, 0.6)"
          strokeWidth={isHovered ? "3" : "2"}
          fill="none"
          strokeDasharray={isHovered ? "none" : "5,5"}
          className="transition-all duration-200 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />

        {/* Connection Points */}
        <circle
          cx={startPoint.x}
          cy={startPoint.y}
          r="4"
          fill="rgba(75, 85, 99, 0.8)"
          stroke="rgba(156, 163, 175, 0.6)"
          strokeWidth="1"
          className={isHovered ? "opacity-100" : "opacity-0"}
        />
        <circle
          cx={endPoint.x}
          cy={endPoint.y}
          r="4"
          fill="rgba(75, 85, 99, 0.8)"
          stroke="rgba(156, 163, 175, 0.6)"
          strokeWidth="1"
          className={isHovered ? "opacity-100" : "opacity-0"}
        />

        {/* Midpoint Context Button */}
        {isHovered && (
          <foreignObject
            x={midX - 12}
            y={midY - 12}
            width="24"
            height="24"
            className="pointer-events-auto"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 w-6 p-0 bg-secondary border-border hover:bg-accent text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle connection context action
                    console.log("Connection context:", connection.id);
                  }}
                >
                  <HelpCircle className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <div className="font-medium text-sm">Connection Details</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Why are these linked?
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </foreignObject>
        )}

        {/* Directional Arrow */}
        <defs>
          <marker
            id={`arrowhead-${connection.id}`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="rgba(156, 163, 175, 0.6)"
            />
          </marker>
        </defs>
        <path
          d={pathData}
          stroke="transparent"
          strokeWidth="2"
          fill="none"
          markerEnd={`url(#arrowhead-${connection.id})`}
          className="pointer-events-none"
        />
      </g>
    </TooltipProvider>
  );
};
