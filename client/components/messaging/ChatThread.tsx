import * as React from "react";
import { cn } from "@/lib/utils";
import { Conversation, Message, User } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreHorizontal,
  Command,
} from "lucide-react";

interface ChatThreadProps {
  conversation: Conversation | undefined;
  messages: Message[];
  onSendMessage: (content: string, files?: File[]) => void;
  onOpenCommandPalette: () => void;
  currentUserId: string;
  users: User[];
}

export const ChatThread: React.FC<ChatThreadProps> = ({
  conversation,
  messages,
  onSendMessage,
  onOpenCommandPalette,
  currentUserId,
  users,
}) => {
  const [messageInput, setMessageInput] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput("");
    }
  };

  const formatMessageTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserById = (userId: string) => {
    return users.find((user) => user.id === userId);
  };

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
          <p className="text-sm">Choose a conversation to start messaging</p>
          <Button
            variant="outline"
            className="mt-4 bg-gray-800 border-gray-600 text-gray-300"
            onClick={onOpenCommandPalette}
          >
            <Command className="h-4 w-4 mr-2" />
            Start new conversation (Ctrl+/)
          </Button>
        </div>
      </div>
    );
  }

  const participant = conversation.participants[0];

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gray-600 text-gray-200">
                {participant?.avatar || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-100">
                {participant?.name || "Unknown User"}
              </h3>
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    participant?.status === "active"
                      ? "bg-green-500"
                      : participant?.status === "away"
                        ? "bg-yellow-500"
                        : "bg-gray-500",
                  )}
                />
                <span className="text-xs text-gray-400">
                  {participant?.status === "active"
                    ? "Active"
                    : participant?.status === "away"
                      ? "Away"
                      : "Offline"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-700"
            >
              <Phone className="h-4 w-4 text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-700"
            >
              <Video className="h-4 w-4 text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-700"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUserId;
              const sender = getUserById(message.senderId);
              const showAvatar =
                !isCurrentUser &&
                (index === 0 ||
                  messages[index - 1].senderId !== message.senderId);

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    isCurrentUser ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "flex max-w-xs lg:max-w-md",
                      isCurrentUser ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    {showAvatar && !isCurrentUser && (
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback className="bg-gray-600 text-gray-200 text-xs">
                          {sender?.avatar || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {!showAvatar && !isCurrentUser && (
                      <div className="w-8 mr-2" />
                    )}

                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 space-y-1",
                        isCurrentUser
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-100",
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "text-xs",
                            isCurrentUser ? "text-blue-100" : "text-gray-400",
                          )}
                        >
                          {formatMessageTime(message.timestamp)}
                        </span>
                        <div className="flex items-center space-x-1">
                          {message.platform !== "in-app" && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs h-4 px-1",
                                isCurrentUser
                                  ? "border-blue-300 text-blue-100"
                                  : "border-gray-500 text-gray-400",
                              )}
                            >
                              {message.platform}
                            </Badge>
                          )}
                          {isCurrentUser && (
                            <span
                              className={cn(
                                "text-xs",
                                message.status === "read"
                                  ? "text-blue-200"
                                  : message.status === "delivered"
                                    ? "text-blue-300"
                                    : message.status === "sent"
                                      ? "text-blue-400"
                                      : "text-gray-400",
                              )}
                            >
                              {message.status === "read"
                                ? "✓✓"
                                : message.status === "delivered"
                                  ? "✓✓"
                                  : message.status === "sent"
                                    ? "✓"
                                    : "..."}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-700"
          >
            <Paperclip className="h-4 w-4 text-gray-400" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              className="bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onOpenCommandPalette}
                className="h-6 w-6 p-0 hover:bg-gray-600"
              >
                <Command className="h-3 w-3 text-gray-400" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-600"
              >
                <Smile className="h-3 w-3 text-gray-400" />
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            size="sm"
            disabled={!messageInput.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <div className="mt-2 text-xs text-gray-500 text-center">
          Press{" "}
          <kbd className="px-1 py-0.5 bg-gray-700 rounded text-gray-300">
            Ctrl+/
          </kbd>{" "}
          for command palette with ~@mention syntax
        </div>
      </div>
    </div>
  );
};
