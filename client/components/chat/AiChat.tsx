import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Copy,
  ThumbsUp,
  ThumbsDown,
  Mic,
  Send,
  Sun,
  Cloud,
  CloudRain,
} from "lucide-react";
import { ChatInput } from "./ChatInput";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Import Chip type from ChatInput
interface Chip {
  id: string;
  type: 'mention' | 'file' | 'mind';
  text: string;
  data: any;
}

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  chips?: Chip[];
  includesImage?: boolean;
  includesWeather?: boolean;
  weatherData?: {
    temperature: number;
    location: string;
    high: number;
    low: number;
    hourly: Array<{
      time: string;
      temp: number;
      icon: "sun" | "cloud" | "rain";
    }>;
  };
}

const initialMessages: Message[] = [
  {
    id: "1",
    type: "user",
    content: "chat with me by assistancy of ceo",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "2",
    type: "ai",
    content: "Hello! How can I assist you today in your role as CEO?",
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: "3",
    type: "user",
    content: "say my name and find image of walter issac",
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: "4",
    type: "ai",
    content:
      "Hello, CEO! Unfortunately, I can't find images directly, but I can create a document for you about Walter Isaacson if you'd like. Would that be helpful?",
    timestamp: new Date(Date.now() - 120000),
    includesImage: true,
  },
  {
    id: "5",
    type: "user",
    content: "weather today at three pm",
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: "6",
    type: "ai",
    content: "I am retrieving the weather for Mumbai at 3 PM today.",
    timestamp: new Date(Date.now() - 30000),
    includesWeather: true,
    weatherData: {
      temperature: 29,
      location: "Mumbai",
      high: 30,
      low: 28,
      hourly: [
        { time: "7PM", temp: 29, icon: "sun" },
        { time: "8PM", temp: 28, icon: "sun" },
        { time: "9PM", temp: 27, icon: "sun" },
        { time: "10PM", temp: 26, icon: "cloud" },
        { time: "11PM", temp: 26, icon: "cloud" },
        { time: "12AM", temp: 25, icon: "cloud" },
      ],
    },
  },
];

const WeatherIcon = ({ type }: { type: "sun" | "cloud" | "rain" }) => {
  switch (type) {
    case "sun":
      return <Sun className="h-4 w-4 text-yellow-400" />;
    case "cloud":
      return <Cloud className="h-4 w-4 text-gray-300" />;
    case "rain":
      return <CloudRain className="h-4 w-4 text-blue-400" />;
  }
};

const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.type === "user";

  return (
    <div
      className={cn(
        "flex w-full mb-3 sm:mb-4",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div className={cn("max-w-[85%] sm:max-w-[80%]", isUser ? "order-1" : "order-2")}>
        {!isUser && (
          <div className="flex items-center space-x-2 mb-1 px-1">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-foreground to-muted flex items-center justify-center">
              <span className="text-xs font-bold text-background">✨</span>
            </div>
            <span className="text-xs text-muted-foreground">AI Assistant</span>
          </div>
        )}

        <div
          className={cn(
            "rounded-xl px-3 py-2 sm:px-4 sm:py-3 shadow-sm backdrop-blur-sm",
            isUser
              ? "bg-card/90 text-foreground ml-2 sm:ml-4 border border-border"
              : "bg-muted/90 text-foreground mr-2 sm:mr-4 border border-border",
          )}
        >
          {/* Display chips if they exist */}
          {message.chips && message.chips.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {message.chips.map((chip, index) => {
                const baseSaturation = 20;
                const saturationIncrement = 5;
                const maxSaturation = 50;
                const saturation = Math.min(baseSaturation + (index * saturationIncrement), maxSaturation);
                
                const colors = {
                  mention: `hsl(210, ${saturation}%, 85%)`,
                  file: `hsl(120, ${saturation}%, 85%)`,
                  mind: `hsl(280, ${saturation}%, 85%)`
                };
                
                const borderColors = {
                  mention: `hsl(210, ${saturation}%, 65%)`,
                  file: `hsl(120, ${saturation}%, 65%)`,
                  mind: `hsl(280, ${saturation}%, 65%)`
                };

                return (
                  <span
                    key={chip.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: colors[chip.type],
                      borderColor: borderColors[chip.type],
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                  >
                    {chip.text}
                  </span>
                );
              })}
            </div>
          )}
          
          <p className="text-sm leading-relaxed break-words">{message.content}</p>

          {/* Image Card */}
          {message.includesImage && !isUser && (
            <div className="mt-3 p-3 bg-accent/50 rounded-lg border border-border backdrop-blur-sm">
              <img
                src="https://via.placeholder.com/512x300/1f2937/9ca3af?text=Walter+Isaacson"
                alt="Walter Isaacson"
                className="w-full h-24 sm:h-32 object-cover rounded-md mb-2"
              />
              <p className="text-xs text-muted-foreground">
                Sample document content about Walter Isaacson
              </p>
            </div>
          )}

          {/* Weather Card */}
          {message.includesWeather && message.weatherData && !isUser && (
            <div className="mt-3 p-3 sm:p-4 bg-gradient-to-r from-accent/50 to-card/50 rounded-lg shadow-lg border border-border backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300" />
                    <span className="text-2xl sm:text-3xl font-bold text-foreground">
                      {message.weatherData.temperature}°C
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {message.weatherData.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    H:{message.weatherData.high}° L:{message.weatherData.low}°
                  </p>
                </div>
              </div>

              <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-1">
                {message.weatherData.hourly.map((hour, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-1 min-w-[40px] sm:min-w-[50px] bg-accent/30 rounded-lg p-1.5 sm:p-2 backdrop-blur-sm"
                  >
                    <span className="text-xs text-muted-foreground">{hour.time}</span>
                    <WeatherIcon type={hour.icon} />
                    <span className="text-xs text-foreground font-medium">
                      {hour.temp}°
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-muted-foreground text-xs mt-3">
                The weather in {message.weatherData.location} at 3 PM today will
                be around {message.weatherData.temperature}°C.
              </p>
            </div>
          )}
        </div>

        {/* Feedback Actions for AI messages */}
        {!isUser && (
          <div className="flex items-center space-x-1 sm:space-x-2 mt-2 ml-2 sm:ml-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy message</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Like</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Dislike</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        {/* Timestamp for user messages */}
        {isUser && (
          <div className="flex justify-end mr-2 sm:mr-4 mt-1">
            <span className="text-xs text-muted-foreground">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const AiChat = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isNewChat, setIsNewChat] = React.useState(false);
  const [chatCreated, setChatCreated] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Check for new chat parameter in URL
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("new") === "true") {
      setIsNewChat(true);
      setMessages([]); // Start with empty messages for new chat
    } else {
      setMessages(initialMessages); // Load existing messages
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string, chips: Chip[]) => {
    if (content.trim() || chips.length > 0) {
      // Create new chat instance only when first message is sent
      if (isNewChat && !chatCreated) {
        setChatCreated(true);
        // Clear the URL parameter
        const url = new URL(window.location.href);
        url.searchParams.delete("new");
        window.history.replaceState({}, "", url.toString());
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: content,
        timestamp: new Date(),
        chips: chips.length > 0 ? chips : undefined,
      };

      setMessages((prev) => [...prev, newMessage]);

      // Simulate AI response with context from chips
      setTimeout(() => {
        let aiContent = "I understand your request. Let me help you with that.";
        
        if (chips.length > 0) {
          const mentions = chips.filter(c => c.type === 'mention' || c.type === 'file');
          const mindRefs = chips.filter(c => c.type === 'mind');
          
          if (mentions.length > 0) {
            aiContent = `I see you've mentioned ${mentions.map(m => m.text).join(', ')}. Let me review those files and provide assistance.`;
          } else if (mindRefs.length > 0) {
            aiContent = `I understand you're referencing ${mindRefs.map(m => m.text).join(', ')} from your mind map. Let me help you with that context.`;
          }
        }

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: aiContent,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <div className="h-full w-full bg-background text-foreground relative flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-3 sm:p-4 border-b border-border bg-card/95 backdrop-blur-sm z-30">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-foreground to-muted flex items-center justify-center">
            <span className="text-xs sm:text-sm font-bold text-background">✨</span>
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-foreground">AI Assistant</h2>
        </div>
        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Ctrl+/</span>
          <span className="text-xs text-muted-foreground">Cmd+K</span>
        </div>
      </div>

      {/* Scrollable Messages Container - Takes remaining height */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto hide-scrollbar">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-40">
            {messages.length === 0 && isNewChat ? (
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center text-muted-foreground">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-foreground to-muted flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg sm:text-2xl text-background">✨</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                    New Chat
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Start a conversation with your AI assistant
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Floating Chat Input - Positioned absolutely at bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-sm z-40 shadow-lg">
            <ChatInput
              onSendMessage={handleSendMessage}
              placeholder="Ask AI anything, @ to mention people or files, # for mind references..."
              className="w-full"
              popupDirection="up"
            />
            
            
        </div>
      </div>
    </div>
  );
};
