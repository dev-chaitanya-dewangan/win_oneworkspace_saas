import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { MindCanvas } from "@/components/mind/MindCanvas";
import { MindSidebar } from "@/components/mind/MindSidebar";
import { QuickCreateDialog } from "@/components/mind/QuickCreateDialog";
import { MindNode, Connection } from "@/components/mind/types";

const Mind = () => {
  const [nodes, setNodes] = React.useState<MindNode[]>([
    {
      id: "1",
      title: "What is Mind Palace?",
      content:
        "A method for organizing and storing information in spatial memory",
      tags: ["#text", "#start"],
      position: { x: 300, y: 150 },
      size: { width: 280, height: 120 },
      collaborators: [
        { id: "1", name: "Alex", avatar: "A", isActive: true },
        { id: "2", name: "Sam", avatar: "S", isActive: false },
      ],
      breadcrumb: "Alex's Mind > Mind Models",
      color: "blue",
    },
    {
      id: "2",
      title: "Why these notes are connected?",
      content: "Understanding the relationships between concepts",
      tags: ["#text"],
      position: { x: 150, y: 320 },
      size: { width: 240, height: 100 },
      collaborators: [{ id: "1", name: "Alex", avatar: "A", isActive: true }],
      breadcrumb: "Alex's Mind > Connections",
      color: "purple",
    },
    {
      id: "3",
      title: "Mind Visualization",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas malesuada ex mauris",
      tags: ["#text", "#text"],
      position: { x: 100, y: 480 },
      size: { width: 260, height: 140 },
      collaborators: [
        { id: "1", name: "Alex", avatar: "A", isActive: true },
        { id: "3", name: "Jordan", avatar: "J", isActive: true },
        { id: "4", name: "Casey", avatar: "C", isActive: false },
      ],
      breadcrumb: "Alex's Mind > Visualization",
      color: "pink",
    },
    {
      id: "4",
      title: "Semantic Network",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas malesuada ex mauris",
      tags: ["#text", "#text"],
      position: { x: 50, y: 650 },
      size: { width: 240, height: 120 },
      collaborators: [
        { id: "2", name: "Sam", avatar: "S", isActive: true },
        { id: "3", name: "Jordan", avatar: "J", isActive: false },
      ],
      breadcrumb: "Alex's Mind > Networks",
      color: "blue",
    },
    {
      id: "5",
      title: "No title makes no sense",
      content: "",
      tags: [],
      position: { x: 600, y: 200 },
      size: { width: 200, height: 80 },
      collaborators: [],
      breadcrumb: "Alex's Mind > Untitled",
      color: "gray",
    },
    {
      id: "6",
      title: "Mind Journey Map",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas malesuada ex mauris",
      tags: ["#text", "#text"],
      position: { x: 550, y: 450 },
      size: { width: 240, height: 120 },
      collaborators: [
        { id: "1", name: "Alex", avatar: "A", isActive: true },
        { id: "2", name: "Sam", avatar: "S", isActive: true },
        { id: "3", name: "Jordan", avatar: "J", isActive: false },
      ],
      breadcrumb: "Alex's Mind > Journey",
      color: "teal",
    },
    {
      id: "7",
      title: "Demo Page",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas malesuada ex mauris",
      tags: ["#text", "#text"],
      position: { x: 200, y: 750 },
      size: { width: 220, height: 120 },
      collaborators: [
        { id: "1", name: "Alex", avatar: "A", isActive: true },
        { id: "4", name: "Casey", avatar: "C", isActive: true },
      ],
      breadcrumb: "Alex's Mind > Demo",
      color: "red",
    },
  ]);

  const [connections, setConnections] = React.useState<Connection[]>([
    {
      id: "c1",
      fromNodeId: "1",
      toNodeId: "2",
      fromSide: "bottom",
      toSide: "top",
    },
    {
      id: "c2",
      fromNodeId: "2",
      toNodeId: "3",
      fromSide: "bottom",
      toSide: "top",
    },
    {
      id: "c3",
      fromNodeId: "3",
      toNodeId: "4",
      fromSide: "bottom",
      toSide: "top",
    },
    {
      id: "c4",
      fromNodeId: "1",
      toNodeId: "5",
      fromSide: "right",
      toSide: "left",
    },
    {
      id: "c5",
      fromNodeId: "5",
      toNodeId: "6",
      fromSide: "bottom",
      toSide: "top",
    },
    {
      id: "c6",
      fromNodeId: "3",
      toNodeId: "7",
      fromSide: "right",
      toSide: "left",
    },
  ]);

  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(
    null,
  );
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = React.useState(false);

  // Global keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "K") {
        e.preventDefault();
        setQuickCreateOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNodeUpdate = (nodeId: string, updates: Partial<MindNode>) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, ...updates } : node)),
    );
  };

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleNodeOpenSidebar = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setSidebarOpen(true);
  };

  const handleCreateNode = (
    title: string,
    position?: { x: number; y: number },
  ) => {
    const newNode: MindNode = {
      id: `node-${Date.now()}`,
      title,
      content: "",
      tags: [],
      position: position || { x: 400, y: 300 },
      size: { width: 240, height: 100 },
      collaborators: [{ id: "1", name: "Alex", avatar: "A", isActive: true }],
      breadcrumb: "Alex's Mind > New",
      color: "blue",
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId));
    setConnections((prev) =>
      prev.filter(
        (conn) => conn.fromNodeId !== nodeId && conn.toNodeId !== nodeId,
      ),
    );
  };

  const handleDuplicateNode = (nodeId: string) => {
    const original = nodes.find((n) => n.id === nodeId);
    if (original) {
      const duplicate: MindNode = {
        ...original,
        id: `node-${Date.now()}`,
        position: {
          x: original.position.x + 20,
          y: original.position.y + 20,
        },
      };
      setNodes((prev) => [...prev, duplicate]);
    }
  };

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId)
    : null;

  return (
    <MainLayout>
      <div
        className="relative h-full w-full bg-primary overflow-hidden grid-pattern"
      >
        {/* Main Canvas */}
        <MindCanvas
          nodes={nodes}
          connections={connections}
          onNodeUpdate={handleNodeUpdate}
          onNodeSelect={handleNodeSelect}
          onNodeOpenSidebar={handleNodeOpenSidebar}
          onDeleteNode={handleDeleteNode}
          onDuplicateNode={handleDuplicateNode}
          onCreateNode={handleCreateNode}
        />

        {/* Mind Node Sidebar */}
        {sidebarOpen && selectedNode && (
          <MindSidebar
            node={selectedNode}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onNodeUpdate={(updates) =>
              handleNodeUpdate(selectedNode.id, updates)
            }
          />
        )}

        {/* Quick Create Dialog */}
        <QuickCreateDialog
          isOpen={quickCreateOpen}
          onClose={() => setQuickCreateOpen(false)}
          onCreateNode={handleCreateNode}
        />
      </div>
    </MainLayout>
  );
};

export default Mind;
