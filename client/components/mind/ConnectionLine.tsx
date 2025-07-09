import * as React from "react";
import { Connection, MindNode } from "./types";

interface ConnectionLineProps {
  connection: Connection;
  fromNode: MindNode;
  toNode: MindNode;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  fromNode,
  toNode,
}) => {
  // Calculate connection points based on sides
  const getConnectionPoint = (node: MindNode, side: string) => {
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

  const fromPoint = getConnectionPoint(fromNode, connection.fromSide);
  const toPoint = getConnectionPoint(toNode, connection.toSide);

  // Calculate control points for smooth curves
  const getControlPoints = (from: { x: number; y: number }, to: { x: number; y: number }, fromSide: string, toSide: string) => {
    const distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
    const offset = Math.min(distance * 0.4, 150); // Adaptive curve intensity

    let cp1 = { x: from.x, y: from.y };
    let cp2 = { x: to.x, y: to.y };

    // From side control point
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

    // To side control point
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

    return { cp1, cp2 };
  };

  const { cp1, cp2 } = getControlPoints(fromPoint, toPoint, connection.fromSide, connection.toSide);

  // Create smooth cubic bezier path
  const pathData = `M ${fromPoint.x} ${fromPoint.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${toPoint.x} ${toPoint.y}`;

  // Animation ID for unique keyframes
  const animationId = `flow-${connection.id}`;

  return (
    <g className="connection-group">
      {/* Glow effect background */}
      <path
        d={pathData}
        stroke="rgba(59, 130, 246, 0.3)"
        strokeWidth="6"
        fill="none"
        className="connection-glow"
        filter="blur(2px)"
      />
      
      {/* Main connection line */}
      <path
        d={pathData}
        stroke="rgba(255, 255, 255, 0.8)"
        strokeWidth="2"
        fill="none"
        className="connection-main"
        strokeLinecap="round"
      />
      
      {/* Animated flowing effect */}
      <path
        d={pathData}
        stroke="url(#flowing-gradient)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="10 10"
        strokeLinecap="round"
        className="connection-flow"
        style={{
          animation: `${animationId} 3s linear infinite`,
        }}
      />

      {/* Connection endpoints - small circles */}
      <circle
        cx={fromPoint.x}
        cy={fromPoint.y}
        r="3"
        fill="rgba(59, 130, 246, 0.8)"
        className="connection-point from-point"
      />
      <circle
        cx={toPoint.x}
        cy={toPoint.y}
        r="3"
        fill="rgba(59, 130, 246, 0.8)"
        className="connection-point to-point"
      />

      {/* Arrowhead */}
      <defs>
        <marker
          id={`arrowhead-${connection.id}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="rgba(255, 255, 255, 0.8)"
          />
        </marker>
        
        {/* Flowing gradient */}
        <linearGradient id="flowing-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
          <stop offset="50%" stopColor="rgba(59, 130, 246, 1)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
        </linearGradient>
      </defs>

      {/* Add arrowhead to main line */}
      <path
        d={pathData}
        stroke="transparent"
        strokeWidth="2"
        fill="none"
        markerEnd={`url(#arrowhead-${connection.id})`}
      />

      {/* Dynamic styles for animations */}
      <style>{`
        @keyframes ${animationId} {
          0% {
            stroke-dashoffset: 20;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </g>
  );
};
