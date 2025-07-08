import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Mic, Send } from "lucide-react";

interface CommandInputProps {
  onCommand?: (command: string) => void;
  onVoiceInput?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const CommandInput = React.forwardRef<HTMLDivElement, CommandInputProps>(
  (
    {
      onCommand,
      onVoiceInput,
      placeholder = "Type or say your command…",
      className,
      disabled = false,
    },
    ref,
  ) => {
    const [value, setValue] = React.useState("");
    const [isRecording, setIsRecording] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (value.trim() && onCommand) {
        onCommand(value.trim());
        setValue("");
      }
    };

    const handleVoiceInput = () => {
      if (disabled) return;

      setIsRecording(true);
      onVoiceInput?.();

      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false);
        setValue("Create a 5-slide carousel for the new product launch");
      }, 2000);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center space-x-2 p-1 rounded-xl bg-muted/50 border border-border/50 backdrop-blur-sm",
          className,
        )}
      >
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex items-center space-x-2"
        >
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || isRecording}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          />
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            disabled={!value.trim() || disabled}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleVoiceInput}
          disabled={disabled}
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/10",
            isRecording && "bg-primary/20 text-primary animate-pulse",
          )}
        >
          <Mic className="h-4 w-4" />
        </Button>
      </div>
    );
  },
);

CommandInput.displayName = "CommandInput";

export { CommandInput };
