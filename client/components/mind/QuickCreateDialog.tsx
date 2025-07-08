import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Plus, Zap } from "lucide-react";

interface QuickCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNode: (title: string, position?: { x: number; y: number }) => void;
}

export const QuickCreateDialog: React.FC<QuickCreateDialogProps> = ({
  isOpen,
  onClose,
  onCreateNode,
}) => {
  const [title, setTitle] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) {
      setTitle("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      // Create node in the center of the viewport - preserve internal spaces
      onCreateNode(title.trim(), { x: 400, y: 300 });
      onClose();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Preserve all internal spaces
    setTitle(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-auto p-0 bg-transparent border-0 shadow-none">
        <DialogTitle className="sr-only">Quick Create Node</DialogTitle>
        <div className="relative">
          {/* Backdrop blur overlay */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />

          {/* Quick Create Box */}
          <div className="relative bg-secondary/95 backdrop-blur-sm border border-border/50 rounded-xl shadow-2xl p-6 mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">
                  Quick Create
                </h2>
                <p className="text-sm text-muted-foreground">
                  Create a new node and drop it on the canvas
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                ref={inputRef}
                value={title}
                onChange={handleTitleChange}
                onKeyDown={handleKeyDown}
                placeholder="What's on your mind?"
                className="bg-secondary border-border text-primary focus:border-primary focus:ring-primary/20 text-lg h-12"
                autoComplete="off"
              />

              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  <kbd className="px-2 py-1 bg-secondary rounded text-primary">
                    Enter
                  </kbd>{" "}
                  to create •{" "}
                  <kbd className="px-2 py-1 bg-secondary rounded text-primary">
                    Esc
                  </kbd>{" "}
                  to cancel •{" "}
                  <kbd className="px-2 py-1 bg-secondary rounded text-primary">
                    Ctrl+Shift+K
                  </kbd>{" "}
                  to reopen
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="text-muted-foreground hover:text-primary hover:bg-accent/50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!title.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Node
                  </Button>
                </div>
              </div>
            </form>

            {/* Quick suggestions */}
            <div className="mt-4 pt-4 border-t border-gray-600/50">
              <div className="text-xs text-muted-foreground mb-2">
                Quick suggestions:
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "New Idea",
                  "Research Topic",
                  "Meeting Notes",
                  "Project Plan",
                  "Mind Map",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setTitle(suggestion)}
                    className="px-2 py-1 text-xs bg-secondary/50 hover:bg-secondary text-primary rounded transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
