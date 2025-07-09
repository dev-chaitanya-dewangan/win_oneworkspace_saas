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
    const offset = Math.min(distance * 0.4, 120); // Slightly tighter curves

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
      <defs>
        {/* Metallic White Gradient for main line */}
        <linearGradient id={`metallic-gradient-${connection.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
          <stop offset="25%" stopColor="rgba(240, 240, 240, 1)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 1)" />
          <stop offset="75%" stopColor="rgba(220, 220, 220, 0.9)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.8)" />
        </linearGradient>

        {/* Flowing metallic effect */}
        <linearGradient id={`flowing-metallic-${connection.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
          <stop offset="30%" stopColor="rgba(255, 255, 255, 0.3)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.9)" />
          <stop offset="70%" stopColor="rgba(255, 255, 255, 0.3)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </linearGradient>

        {/* Enhanced Arrow Marker - Metallic White */}
        <marker
          id={`arrowhead-${connection.id}`}
          markerWidth="12"
          markerHeight="10"
          refX="11"
          refY="5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M 0 0 L 12 5 L 0 10 z"
            fill="url(#metallic-gradient-arrow)"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="0.5"
          />
        </marker>

        {/* Arrow gradient */}
        <linearGradient id="metallic-gradient-arrow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
          <stop offset="50%" stopColor="rgba(240, 240, 240, 1)" />
          <stop offset="100%" stopColor="rgba(220, 220, 220, 0.9)" />
        </linearGradient>

        {/* Drop shadow filter for metallic effect */}
        <filter id={`metallic-shadow-${connection.id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(255, 255, 255, 0.3)" />
          <feDropShadow dx="0" dy="-1" stdDeviation="0.5" floodColor="rgba(0, 0, 0, 0.2)" />
        </filter>
      </defs>

      {/* Outer glow effect */}
      <path
        d={pathData}
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="8"
        fill="none"
        className="connection-glow"
        filter="blur(3px)"
        opacity="0.6"
      />
      
      {/* Main metallic connection line */}
      <path
        d={pathData}
        stroke={`url(#metallic-gradient-${connection.id})`}
        strokeWidth="3"
        fill="none"
        className="connection-main"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#metallic-shadow-${connection.id})`}
        markerEnd={`url(#arrowhead-${connection.id})`}
      />
      
      {/* Animated flowing metallic effect */}
      <path
        d={pathData}
        stroke={`url(#flowing-metallic-${connection.id})`}
        strokeWidth="2"
        fill="none"
        strokeDasharray="8 12"
        strokeLinecap="round"
        className="connection-flow"
        opacity="0.8"
        style={{
          animation: `${animationId} 4s linear infinite`,
        }}
      />

      {/* Connection start point - metallic */}
      <circle
        cx={fromPoint.x}
        cy={fromPoint.y}
        r="4"
        fill="url(#metallic-gradient-arrow)"
        stroke="rgba(255, 255, 255, 0.8)"
        strokeWidth="1"
        className="connection-point from-point"
        filter={`url(#metallic-shadow-${connection.id})`}
      />

      {/* Connection end point - metallic */}
      <circle
        cx={toPoint.x}
        cy={toPoint.y}
        r="3"
        fill="url(#metallic-gradient-arrow)"
        stroke="rgba(255, 255, 255, 0.6)"
        strokeWidth="1"
        className="connection-point to-point"
        filter={`url(#metallic-shadow-${connection.id})`}
      />

      {/* Dynamic styles for animations */}
      <style>{`
        @keyframes ${animationId} {
          0% {
            stroke-dashoffset: 20;
            opacity: 0.4;
          }
          50% {
            opacity: 0.9;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0.4;
          }
        }
      `}</style>
    </g>
  );
};
