import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Sidebar,
  Copy,
  Plus,
  Trash2,
  Eye,
  MapPin,
} from "lucide-react";

interface ContextMenuProps {
  position: { x: number; y: number };
  nodeId?: string;
  onClose: () => void;
  onOpen: (nodeId?: string) => void;
  onOpenSidebar: (nodeId?: string) => void;
  onDuplicate: (nodeId?: string) => void;
  onCreateNote: () => void;
  onDelete: (nodeId?: string) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  position,
  nodeId,
  onClose,
  onOpen,
  onOpenSidebar,
  onDuplicate,
  onCreateNote,
  onDelete,
}) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Adjust position to keep menu in viewport
  const adjustedPosition = React.useMemo(() => {
    const menuWidth = 200;
    const menuHeight = nodeId ? 240 : 80;
    const padding = 10;

    let x = position.x;
    let y = position.y;

    if (x + menuWidth > window.innerWidth - padding) {
      x = window.innerWidth - menuWidth - padding;
    }
    if (y + menuHeight > window.innerHeight - padding) {
      y = window.innerHeight - menuHeight - padding;
    }

    return { x: Math.max(padding, x), y: Math.max(padding, y) };
  }, [position, nodeId]);

  const menuItems = nodeId
    ? [
        {
          icon: Eye,
          label: "Open",
          action: () => onOpen(nodeId),
          shortcut: "",
        },
        {
          icon: Sidebar,
          label: "Open in Sidebar",
          action: () => onOpenSidebar(nodeId),
          shortcut: "",
        },
        {
          icon: Copy,
          label: "Duplicate",
          action: () => onDuplicate(nodeId),
          shortcut: "⌘D",
        },
        {
          icon: Plus,
          label: "Create New Note",
          action: () => onCreateNote(),
          shortcut: "⌘K",
        },
        {
          icon: MapPin,
          label: "Remove from Map",
          action: () => console.log("Remove from map:", nodeId),
          shortcut: "",
        },
        {
          icon: Trash2,
          label: "Delete",
          action: () => onDelete(nodeId),
          shortcut: "⌫",
          danger: true,
        },
      ]
    : [
        {
          icon: Plus,
          label: "Create New Note",
          action: () => onCreateNote(),
          shortcut: "⌘K",
        },
      ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl backdrop-blur-sm"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        minWidth: "200px",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 text-sm transition-colors",
              item.danger
                ? "text-red-400 hover:bg-red-950/50 hover:text-red-300"
                : "text-gray-300 hover:bg-gray-700/50 hover:text-white",
            )}
            onClick={() => {
              item.action();
              onClose();
            }}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </div>
            {item.shortcut && (
              <span className="text-xs text-gray-500">{item.shortcut}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
