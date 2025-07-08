export interface MindNode {
  id: string;
  title: string;
  content: string;
  tags: string[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  collaborators: Collaborator[];
  breadcrumb: string;
  color: string;
}

export interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  isActive: boolean;
}

export interface Connection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  fromSide: "top" | "bottom" | "left" | "right";
  toSide: "top" | "bottom" | "left" | "right";
}

export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface DragState {
  isDragging: boolean;
  nodeId?: string;
  offset?: { x: number; y: number };
  startPosition?: { x: number; y: number };
}

export interface ContextMenuState {
  isOpen: boolean;
  position: { x: number; y: number };
  nodeId?: string;
}
