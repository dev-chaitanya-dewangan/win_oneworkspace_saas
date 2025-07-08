import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Mic, Send, X } from "lucide-react";

interface DynamicIslandInputProps {
  onCommand?: (command: string) => void;
  onVoiceInput?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

interface ToastData {
  id: string;
  type: "image" | "weather" | "success";
  content: any;
}

const DynamicIslandInput = React.forwardRef<
  HTMLDivElement,
  DynamicIslandInputProps
>(
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
    const [isListening, setIsListening] = React.useState(false);
    const [timer, setTimer] = React.useState(0);
    const [voiceBars, setVoiceBars] = React.useState<number[]>(
      Array(8).fill(0.3),
    );
    const [toasts, setToasts] = React.useState<ToastData[]>([]);
    const intervalRef = React.useRef<NodeJS.Timeout>();
    const animationRef = React.useRef<number>();

    // Global keyboard shortcut for Ctrl+>
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === ">" && !disabled) {
          e.preventDefault();
          handleVoiceInput();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [disabled]);

    // Timer effect
    React.useEffect(() => {
      if (isRecording) {
        intervalRef.current = setInterval(() => {
          setTimer((prev) => prev + 1);
        }, 1000);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setTimer(0);
      }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [isRecording]);

    // Voice bars animation
    React.useEffect(() => {
      if (isListening || isRecording) {
        const animateBars = () => {
          setVoiceBars((prev) => prev.map(() => Math.random() * 0.8 + 0.2));
          animationRef.current = requestAnimationFrame(animateBars);
        };
        animateBars();
      } else {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        setVoiceBars(Array(12).fill(0.3));
      }

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [isListening, isRecording]);

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const addToast = (type: "image" | "weather" | "success", content: any) => {
      const id = Date.now().toString();
      const newToast: ToastData = { id, type, content };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    };

    const removeToast = (id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (value.trim() && onCommand) {
        const command = value.trim();
        onCommand(command);
        handleCommandResponse(command);
        setValue("");
      }
    };

    const handleVoiceInput = async () => {
      if (disabled) return;

      try {
        setIsRecording(true);
        setIsListening(true);
        onVoiceInput?.();

        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // Real microphone visualization
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        source.connect(analyser);
        analyser.fftSize = 32;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateBars = () => {
          if (isListening) {
            analyser.getByteFrequencyData(dataArray);
            const normalizedData = Array.from(dataArray.slice(0, 8)).map(
              (val) => val / 255,
            );
            setVoiceBars(normalizedData.map((val) => Math.max(val, 0.1)));
            requestAnimationFrame(updateBars);
          }
        };

        updateBars();

        // Simulate whisper API processing after 3 seconds
        setTimeout(async () => {
          setIsRecording(false);
          setIsListening(false);

          // Simulate whisper API call
          const whisperCommands = [
            "Create a mind map for project planning",
            "Show me the weather forecast",
            "Generate an image of a sunset",
            "Open the team collaboration tool",
            "Search for recent files",
            "Schedule a meeting for tomorrow",
          ];

          const randomCommand =
            whisperCommands[Math.floor(Math.random() * whisperCommands.length)];
          setValue(randomCommand);

          // Stop microphone
          stream.getTracks().forEach((track) => track.stop());
          audioContext.close();

          // Auto-submit the command after processing
          setTimeout(() => {
            if (onCommand) {
              onCommand(randomCommand);
              handleCommandResponse(randomCommand);
              setValue("");
            }
          }, 500);
        }, 3000);
      } catch (error) {
        console.error("Microphone access denied:", error);
        setIsRecording(false);
        setIsListening(false);

        // Fallback whisper simulation
        setTimeout(() => {
          const fallbackCommand = "Voice input processed via whisper";
          setValue(fallbackCommand);
          if (onCommand) {
            onCommand(fallbackCommand);
            handleCommandResponse(fallbackCommand);
            setValue("");
          }
        }, 1000);
      }
    };

    const handleCommandResponse = (command: string) => {
      // Simulate command responses based on content
      if (
        command.toLowerCase().includes("image") ||
        command.toLowerCase().includes("/image")
      ) {
        addToast("image", {
          title: "Image Generated",
          description: "AI has created your requested image",
          imageUrl:
            "https://via.placeholder.com/300x200/1a1a1a/ffffff?text=AI+Generated+Image",
        });
      } else if (command.toLowerCase().includes("weather")) {
        addToast("weather", {
          location: "Mumbai",
          temperature: 29,
          condition: "Partly Cloudy",
          high: 32,
          low: 26,
          hourly: [
            { time: "7PM", temp: 29, icon: "☀️" },
            { time: "8PM", temp: 28, icon: "⛅" },
            { time: "9PM", temp: 27, icon: "☁️" },
            { time: "10PM", temp: 26, icon: "🌙" },
          ],
        });
      } else {
        addToast("success", {
          title: "Command Executed",
          description: `Successfully processed via Whisper: ${command.slice(0, 30)}${command.length > 30 ? "..." : ""}`,
        });
      }
    };

    const stopRecording = () => {
      setIsRecording(false);
      setIsListening(false);
    };

    return (
      <>
        {/* Dynamic Island Container - Smaller size for header integration */}
        <div
          ref={ref}
          className={cn(
            "dynamic-island",
            "flex items-center gap-2 px-3 py-2",
            "min-w-[240px] max-w-[400px] w-full",
            className,
          )}
        >
          {/* Voice Visualizer - Smaller */}
          <div className="flex items-center gap-0.5 h-4">
            {voiceBars.map((height, index) => (
              <div
                key={index}
                className={cn(
                  "voice-bar",
                  height > 0.6 ? "bg-gradient-to-t from-pink-500 to-orange-400" : height > 0.3 ? "bg-gradient-to-t from-orange-400 to-yellow-400" : "bg-gradient-to-t from-red-500 to-orange-400"
                )}
                style={{
                  width: "2px",
                  height: `${4 + height * 8}px`,
                }}
              />
            ))}
          </div>

          {/* Record Button - Smaller */}
          <div className="relative">
            <Button
              type="button"
              onClick={isRecording ? stopRecording : handleVoiceInput}
              disabled={disabled}
              className={cn(
                "w-6 h-6 p-0 rounded-lg transition-all duration-200",
                isRecording
                  ? "bg-red-500 glow-red hover:bg-red-600"
                  : "metallic-button hover:scale-110",
              )}
            >
              {isRecording ? (
                <div className="w-2 h-2 bg-white rounded-sm" />
              ) : (
                <Mic className="h-3 w-3 text-white" />
              )}
            </Button>
          </div>

          {/* Timer - Smaller text */}
          {isRecording && (
            <div className="text-white/80 text-xs font-mono tabular-nums">
              {formatTime(timer)}
            </div>
          )}

          {/* Command Input - Smaller */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex items-center gap-1"
          >
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              disabled={disabled || isRecording}
              className={cn(
                "border-0 bg-transparent text-white placeholder:text-white/60",
                "focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none",
                "text-xs font-medium h-6",
              )}
            />

            <Button
              type="submit"
              size="sm"
              variant="ghost"
              disabled={!value.trim() || disabled}
              className={cn(
                "metallic-button h-6 w-6 p-0",
                value.trim() && "glow-blue",
              )}
            >
              <Send className="h-3 w-3 text-white" />
            </Button>
          </form>
        </div>

        {/* Toast Notifications */}
        <div className="fixed bottom-6 right-6 z-50 space-y-3">
          {toasts.map((toast) => (
            <div key={toast.id} className="metallic-toast p-4 w-80 relative">
              <Button
                onClick={() => removeToast(toast.id)}
                className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full bg-white/10 hover:bg-white/20"
                variant="ghost"
              >
                <X className="h-3 w-3 text-white" />
              </Button>

              {toast.type === "image" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <h3 className="text-white font-medium">
                      {toast.content.title}
                    </h3>
                  </div>
                  <img
                    src={toast.content.imageUrl}
                    alt="Generated"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <p className="text-white/70 text-sm">
                    {toast.content.description}
                  </p>
                </div>
              )}

              {toast.type === "weather" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <h3 className="text-white font-medium">
                        {toast.content.location}
                      </h3>
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {toast.content.temperature}°C
                    </span>
                  </div>

                  <div className="text-white/70 text-sm">
                    {toast.content.condition}
                  </div>

                  <div className="flex gap-2 overflow-x-auto">
                    {toast.content.hourly.map((hour: any, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-1 min-w-[50px] bg-white/10 rounded-lg p-2"
                      >
                        <span className="text-xs text-white/60">
                          {hour.time}
                        </span>
                        <span className="text-lg">{hour.icon}</span>
                        <span className="text-xs text-white font-medium">
                          {hour.temp}°
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-white/60">
                    H:{toast.content.high}° L:{toast.content.low}°
                  </div>
                </div>
              )}

              {toast.type === "success" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <h3 className="text-white font-medium">
                      {toast.content.title}
                    </h3>
                  </div>
                  <p className="text-white/70 text-sm">
                    {toast.content.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    );
  },
);

DynamicIslandInput.displayName = "DynamicIslandInput";

export { DynamicIslandInput };
