import * as React from "react";
import { cn } from "@/lib/utils";

interface Block {
  id: string;
  type: "writing" | "ai";
  content: string;
  isGenerating?: boolean;
}

interface Command {
  label: string;
  description: string;
  action: () => void;
}

export const TextEditor: React.FC = () => {
  const [blocks, setBlocks] = React.useState<Block[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [showMenu, setShowMenu] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 });
  const [isGlobalMenu, setIsGlobalMenu] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      label: "/writing",
      description: "Insert a new editable text section",
      action: () => insertBlock("writing"),
    },
    {
      label: "/ai",
      description: "Generate content with AI",
      action: () => insertBlock("ai"),
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  // Global keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault();
        showGlobalMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showGlobalMenu = () => {
    setIsGlobalMenu(true);
    setShowMenu(true);
    setInputValue("");
    setMenuPosition({
      x: window.innerWidth / 2 - 150,
      y: window.innerHeight / 2 - 100,
    });
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const insertBlock = (type: "writing" | "ai") => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: type === "ai" ? "Generating with AI..." : "",
      isGenerating: type === "ai",
    };

    setBlocks((prev) => [...prev, newBlock]);
    setShowMenu(false);
    setInputValue("");
    setIsGlobalMenu(false);

    // Handle AI generation delay
    if (type === "ai") {
      setTimeout(() => {
        setBlocks((prev) =>
          prev.map((block) =>
            block.id === newBlock.id
              ? {
                  ...block,
                  content: "Here is your AI-generated content.",
                  isGenerating: false,
                }
              : block,
          ),
        );
      }, 1500);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.startsWith("/")) {
      if (!showMenu && !isGlobalMenu) {
        const rect = e.target.getBoundingClientRect();
        setMenuPosition({ x: rect.left, y: rect.bottom + 5 });
        setShowMenu(true);
      }
    } else {
      if (!isGlobalMenu) {
        setShowMenu(false);
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredCommands.length > 0) {
      e.preventDefault();
      filteredCommands[0].action();
    }
    if (e.key === "Escape") {
      setShowMenu(false);
      setIsGlobalMenu(false);
      setInputValue("");
    }
  };

  const handleCommandSelect = (command: Command) => {
    command.action();
  };

  const handleBlockChange = (blockId: string, newContent: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, content: newContent } : block,
      ),
    );
  };

  const handleInputBlur = () => {
    // Delay hiding menu to allow command selection
    setTimeout(() => {
      if (!isGlobalMenu) {
        setShowMenu(false);
      }
    }, 200);
  };

  const handleGlobalMenuClose = () => {
    setShowMenu(false);
    setIsGlobalMenu(false);
    setInputValue("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            📝 New Note
          </h1>
          <div className="text-sm text-muted-foreground">
            Type "/" to insert blocks or press Ctrl+/ for command menu
          </div>
        </div>

        {/* Blocks */}
        <div className="space-y-4 mb-6">
          {blocks.map((block) => (
            <div
              key={block.id}
              className={cn("relative", block.isGenerating && "animate-pulse")}
            >
              <textarea
                value={block.content}
                onChange={(e) => handleBlockChange(block.id, e.target.value)}
                placeholder={
                  block.type === "writing"
                    ? "Start writing..."
                    : "AI content will appear here..."
                }
                disabled={block.isGenerating}
                className={cn(
                  "w-full min-h-32 p-4 rounded-lg border border-border bg-card text-card-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-all",
                  block.isGenerating &&
                    "bg-muted text-muted-foreground cursor-not-allowed",
                )}
              />
              {block.type === "ai" && (
                <div className="absolute top-2 right-2">
                  <div className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                    AI
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Field */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            onFocus={() => {
              if (inputValue.startsWith("/")) {
                setShowMenu(true);
              }
            }}
            placeholder="Type '/' for commands..."
            className="w-full p-4 rounded-lg border border-border bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Command Menu */}
        {showMenu && (
          <>
            {/* Backdrop for global menu */}
            {isGlobalMenu && (
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={handleGlobalMenuClose}
              />
            )}
            <div
              className={cn(
                "absolute bg-popover border border-border rounded-lg shadow-lg py-2 min-w-64 z-50",
                isGlobalMenu ? "fixed" : "absolute",
              )}
              style={{
                left: menuPosition.x,
                top: menuPosition.y,
              }}
            >
              {filteredCommands.length > 0 ? (
                filteredCommands.map((command) => (
                  <button
                    key={command.label}
                    onClick={() => handleCommandSelect(command)}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex flex-col text-popover-foreground"
                  >
                    <div className="font-medium">{command.label}</div>
                    <div className="text-sm opacity-70">
                      {command.description}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm opacity-70 text-muted-foreground">
                  No commands found
                </div>
              )}

              {/* Keyboard hint */}
              <div className="border-t border-border mt-2 pt-2 px-4 py-2">
                <div className="text-xs opacity-60 text-muted-foreground">
                  Press Enter to select, Esc to close
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
