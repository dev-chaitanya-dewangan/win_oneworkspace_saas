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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
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
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div className={cn("max-w-[80%]", isUser ? "order-1" : "order-2")}>
        {!isUser && (
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-xs font-bold text-white">✨</span>
            </div>
            <span className="text-xs text-gray-400">AI Assistant</span>
          </div>
        )}

        <div
          className={cn(
            "rounded-xl px-4 py-3 shadow-sm",
            isUser
              ? "bg-gray-700 text-white ml-4"
              : "bg-gray-800 text-gray-100 mr-4",
          )}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>

          {/* Image Card */}
          {message.includesImage && !isUser && (
            <div className="mt-3 p-3 bg-gray-750 rounded-lg border border-gray-600">
              <img
                src="https://via.placeholder.com/512x300/1f2937/9ca3af?text=Walter+Isaacson"
                alt="Walter Isaacson"
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <p className="text-xs text-gray-400">
                Sample document content about Walter Isaacson
              </p>
            </div>
          )}

          {/* Weather Card */}
          {message.includesWeather && message.weatherData && !isUser && (
            <div className="mt-3 p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-8 w-8 text-yellow-300" />
                    <span className="text-3xl font-bold text-white">
                      {message.weatherData.temperature}°C
                    </span>
                  </div>
                  <p className="text-blue-100 text-sm">
                    {message.weatherData.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm">
                    H:{message.weatherData.high}° L:{message.weatherData.low}°
                  </p>
                </div>
              </div>

              <div className="flex space-x-2 overflow-x-auto">
                {message.weatherData.hourly.map((hour, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-1 min-w-[50px] bg-blue-500/30 rounded-lg p-2"
                  >
                    <span className="text-xs text-blue-100">{hour.time}</span>
                    <WeatherIcon type={hour.icon} />
                    <span className="text-xs text-white font-medium">
                      {hour.temp}°
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-blue-100 text-xs mt-3">
                The weather in {message.weatherData.location} at 3 PM today will
                be around {message.weatherData.temperature}°C.
              </p>
            </div>
          )}
        </div>

        {/* Feedback Actions for AI messages */}
        {!isUser && (
          <div className="flex items-center space-x-2 mt-2 ml-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-gray-500 hover:text-gray-300"
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
                    className="h-7 w-7 p-0 text-gray-500 hover:text-green-400"
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
                    className="h-7 w-7 p-0 text-gray-500 hover:text-red-400"
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Dislike</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span className="text-xs text-gray-500 ml-2">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        {/* Timestamp for user messages */}
        {isUser && (
          <div className="flex justify-end mr-4 mt-1">
            <span className="text-xs text-gray-500">
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
  const [inputValue, setInputValue] = React.useState("");
  const [isRecording, setIsRecording] = React.useState(false);
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

  const handleSendMessage = () => {
    if (inputValue.trim()) {
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
        content: inputValue,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: "I understand your request. Let me help you with that.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Simulate voice recording logic here
  };

  return (
    <div className="flex flex-col h-full bg-black text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-sm font-bold text-white">✨</span>
          </div>
          <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">Ctrl+/</span>
          <span className="text-xs text-gray-400">Cmd+K</span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && isNewChat ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                New Chat
              </h3>
              <p className="text-sm">
                Start a conversation with your AI assistant
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-0 p-4 border-t border-gray-800 bg-black">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type or say your command..."
              className="w-full bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 pr-12 focus:border-blue-500 focus:ring-blue-500"
            />
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0",
                isRecording
                  ? "text-red-400 hover:text-red-300"
                  : "text-gray-400 hover:text-gray-300",
              )}
              onClick={toggleRecording}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-800 disabled:text-gray-500"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-gray-500">
          <span>💡 Pro Tips</span>
          <span>🔍 Search Pages</span>
          <span>📁 Upload & Analyze</span>
          <span>🧠 Loading Page</span>
          <span>⚡ Shortcuts Tools</span>
        </div>
      </div>
    </div>
  );
};
