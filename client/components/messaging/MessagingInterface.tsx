import * as React from "react";
import { cn } from "@/lib/utils";
import { MessagingState, User, Message, CalendarEvent } from "./types";
import { ConversationList } from "./ConversationList";
import { ChatThread } from "./ChatThread";
import { ProfilePanel } from "./ProfilePanel";
import { MessagingCommandPalette } from "./MessagingCommandPalette";
import { CalendarModal } from "./CalendarModal";
import { Button } from "@/components/ui/button";
import {
  X,
  MessageCircle,
  User as UserIcon,
  Calendar,
  Menu,
} from "lucide-react";

interface MessagingInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessagingInterface: React.FC<MessagingInterfaceProps> = ({
  isOpen,
  onClose,
}) => {
  const [state, setState] = React.useState<MessagingState>({
    conversations: [],
    selectedConversationId: null,
    messages: {},
    users: [],
    events: [],
    notifications: [],
    isLoading: false,
    commandPaletteOpen: false,
    calendarModalOpen: false,
    selectedUser: null,
  });

  const [activePanel, setActivePanel] = React.useState<
    "conversations" | "chat" | "profile"
  >("conversations");
  const [leftPanelOpen, setLeftPanelOpen] = React.useState(true);

  // Mock data initialization
  React.useEffect(() => {
    if (isOpen) {
      // Initialize with mock data
      const mockUsers: User[] = [
        {
          id: "1",
          name: "Pharah House",
          email: "pharah@design.com",
          phone: "+1234567890",
          avatar: "PH",
          status: "active",
          profileUrl: "https://design.com/sta",
          role: "Design Lead",
          subscribed: true,
          subscribedDaysAgo: 9,
          lastContact: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        },
        {
          id: "2",
          name: "Penny Valeria",
          email: "penny@company.com",
          avatar: "PV",
          status: "offline",
          lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
        },
        {
          id: "3",
          name: "Leonard Kayle",
          email: "leonard@startup.com",
          avatar: "LK",
          status: "active",
        },
        {
          id: "4",
          name: "Leslie Winkle",
          email: "leslie@research.com",
          avatar: "LW",
          status: "away",
        },
      ];

      const mockConversations = [
        {
          id: "conv-1",
          participants: [mockUsers[0]],
          lastMessage: {
            id: "msg-1",
            senderId: "1",
            receiverId: "current-user",
            content: "Thanks and checking 👍",
            type: "text" as const,
            timestamp: new Date(Date.now() - 1000 * 60 * 10),
            status: "read" as const,
            platform: "in-app" as const,
          },
          unreadCount: 0,
          updatedAt: new Date(Date.now() - 1000 * 60 * 10),
          type: "direct" as const,
        },
        {
          id: "conv-2",
          participants: [mockUsers[1]],
          lastMessage: {
            id: "msg-2",
            senderId: "2",
            receiverId: "current-user",
            content: "Let's see the...",
            type: "text" as const,
            timestamp: new Date(Date.now() - 1000 * 60 * 20),
            status: "delivered" as const,
            platform: "in-app" as const,
          },
          unreadCount: 1,
          updatedAt: new Date(Date.now() - 1000 * 60 * 20),
          type: "direct" as const,
        },
      ];

      const mockMessages = {
        "conv-1": [
          {
            id: "msg-1-1",
            senderId: "1",
            receiverId: "current-user",
            content:
              "We need to make sure that the product works well at every circumstances that fit with us",
            type: "text" as const,
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            status: "read" as const,
            platform: "email" as const,
          },
          {
            id: "msg-1-2",
            senderId: "current-user",
            receiverId: "1",
            content:
              "Sending you the files and docs within few moments Meanwhile Check our website for insights",
            type: "text" as const,
            timestamp: new Date(Date.now() - 1000 * 60 * 25),
            status: "read" as const,
            platform: "email" as const,
          },
          {
            id: "msg-1-3",
            senderId: "1",
            receiverId: "current-user",
            content: "Thanks and checking 👍",
            type: "text" as const,
            timestamp: new Date(Date.now() - 1000 * 60 * 10),
            status: "read" as const,
            platform: "in-app" as const,
          },
        ],
      };

      const mockEvents: CalendarEvent[] = [
        {
          id: "event-1",
          summary: "Design Review with Pharah",
          description: "Review new design proposals",
          start: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
          end: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours from now
          attendees: [mockUsers[0]],
          status: "upcoming",
          platform: "google",
        },
      ];

      setState((prev) => ({
        ...prev,
        users: mockUsers,
        conversations: mockConversations,
        messages: mockMessages,
        events: mockEvents,
        selectedConversationId: "conv-1",
        selectedUser: mockUsers[0],
        notifications: [
          {
            id: "notif-1",
            type: "message",
            title: "New Message",
            description: "From Pharah House",
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            isRead: false,
          },
          {
            id: "notif-2",
            type: "deal",
            title: "5 Deals Pending",
            description: "Just now",
            timestamp: new Date(),
            isRead: false,
          },
        ],
      }));
    }
  }, [isOpen]);

  // Global keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setState((prev) => ({ ...prev, commandPaletteOpen: true }));
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const handleConversationSelect = (conversationId: string) => {
    setState((prev) => ({ ...prev, selectedConversationId: conversationId }));
    const conversation = state.conversations.find(
      (c) => c.id === conversationId,
    );
    if (conversation && conversation.participants[0]) {
      setState((prev) => ({
        ...prev,
        selectedUser: conversation.participants[0],
      }));
    }
    if (window.innerWidth <= 768) {
      setActivePanel("chat");
    }
  };

  const handleSendMessage = async (content: string, files?: File[]) => {
    if (!state.selectedConversationId || !content.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: "current-user",
      receiverId: state.selectedUser?.id || "",
      content,
      type: "text",
      timestamp: new Date(),
      status: "sending",
      platform: "in-app",
    };

    // Add message to state
    setState((prev) => ({
      ...prev,
      messages: {
        ...prev.messages,
        [state.selectedConversationId!]: [
          ...(prev.messages[state.selectedConversationId!] || []),
          newMessage,
        ],
      },
    }));

    // Simulate API call
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        messages: {
          ...prev.messages,
          [state.selectedConversationId!]: prev.messages[
            state.selectedConversationId!
          ].map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: "sent" } : msg,
          ),
        },
      }));
    }, 1000);
  };

  const handleScheduleEvent = async (eventData: Partial<CalendarEvent>) => {
    if (!state.selectedUser) return;

    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      summary: eventData.summary || `Call with ${state.selectedUser.name}`,
      description: eventData.description || "",
      start: eventData.start || new Date(),
      end: eventData.end || new Date(Date.now() + 1000 * 60 * 60), // 1 hour later
      attendees: [state.selectedUser],
      status: "upcoming",
      platform: "google",
    };

    setState((prev) => ({
      ...prev,
      events: [...prev.events, newEvent],
      calendarModalOpen: false,
    }));

    // Simulate Google Calendar API call
    console.log("Creating Google Calendar event:", newEvent);
  };

  if (!isOpen) return null;

  const selectedConversation = state.conversations.find(
    (c) => c.id === state.selectedConversationId,
  );
  const selectedMessages = state.selectedConversationId
    ? state.messages[state.selectedConversationId] || []
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-gray-900">
      <div className="flex h-full">
        {/* Header - Mobile Only */}
        <div className="md:hidden absolute top-0 left-0 right-0 z-10 bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-semibold text-gray-100">Messages</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="flex mt-4 -mb-4">
            <button
              onClick={() => setActivePanel("conversations")}
              className={cn(
                "flex-1 flex items-center justify-center py-2 text-sm font-medium",
                activePanel === "conversations"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400",
              )}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chats
            </button>
            <button
              onClick={() => setActivePanel("chat")}
              className={cn(
                "flex-1 flex items-center justify-center py-2 text-sm font-medium",
                activePanel === "chat"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400",
              )}
              disabled={!selectedConversation}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </button>
            <button
              onClick={() => setActivePanel("profile")}
              className={cn(
                "flex-1 flex items-center justify-center py-2 text-sm font-medium",
                activePanel === "profile"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400",
              )}
              disabled={!state.selectedUser}
            >
              <UserIcon className="h-4 w-4 mr-2" />
              Profile
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block absolute top-0 left-0 right-0 z-10 bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-100">
              Messages & Scheduling
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex pt-16 md:pt-16">
          {/* Desktop 3-panel layout */}
          <div className="hidden md:flex flex-1">
            {/* Left Panel - Conversations */}
            <div
              className={cn(
                "w-80 border-r border-gray-700 transition-all duration-300",
                leftPanelOpen
                  ? "translate-x-0"
                  : "-translate-x-full md:translate-x-0",
              )}
            >
              <ConversationList
                conversations={state.conversations}
                selectedConversationId={state.selectedConversationId}
                onConversationSelect={handleConversationSelect}
                users={state.users}
              />
            </div>

            {/* Center Panel - Chat */}
            <div className="flex-1">
              <ChatThread
                conversation={selectedConversation}
                messages={selectedMessages}
                onSendMessage={handleSendMessage}
                onOpenCommandPalette={() =>
                  setState((prev) => ({ ...prev, commandPaletteOpen: true }))
                }
                currentUserId="current-user"
                users={state.users}
              />
            </div>

            {/* Right Panel - Profile */}
            <div className="w-80 border-l border-gray-700">
              <ProfilePanel
                user={state.selectedUser}
                events={state.events}
                notifications={state.notifications}
                onScheduleEvent={() =>
                  setState((prev) => ({ ...prev, calendarModalOpen: true }))
                }
                onUnsubscribe={(userId) => console.log("Unsubscribe:", userId)}
              />
            </div>
          </div>

          {/* Mobile single panel view */}
          <div className="md:hidden flex-1">
            {activePanel === "conversations" && (
              <ConversationList
                conversations={state.conversations}
                selectedConversationId={state.selectedConversationId}
                onConversationSelect={handleConversationSelect}
                users={state.users}
              />
            )}
            {activePanel === "chat" && (
              <ChatThread
                conversation={selectedConversation}
                messages={selectedMessages}
                onSendMessage={handleSendMessage}
                onOpenCommandPalette={() =>
                  setState((prev) => ({ ...prev, commandPaletteOpen: true }))
                }
                currentUserId="current-user"
                users={state.users}
              />
            )}
            {activePanel === "profile" && (
              <ProfilePanel
                user={state.selectedUser}
                events={state.events}
                notifications={state.notifications}
                onScheduleEvent={() =>
                  setState((prev) => ({ ...prev, calendarModalOpen: true }))
                }
                onUnsubscribe={(userId) => console.log("Unsubscribe:", userId)}
              />
            )}
          </div>
        </div>

        {/* Command Palette */}
        <MessagingCommandPalette
          isOpen={state.commandPaletteOpen}
          onClose={() =>
            setState((prev) => ({ ...prev, commandPaletteOpen: false }))
          }
          onSendMessage={handleSendMessage}
          users={state.users}
          onCreateUser={(userData) => {
            const newUser: User = {
              id: `user-${Date.now()}`,
              ...userData,
              avatar: userData.name.substring(0, 2).toUpperCase(),
              status: "offline",
            };
            setState((prev) => ({ ...prev, users: [...prev.users, newUser] }));
            return newUser;
          }}
        />

        {/* Calendar Modal */}
        <CalendarModal
          isOpen={state.calendarModalOpen}
          onClose={() =>
            setState((prev) => ({ ...prev, calendarModalOpen: false }))
          }
          onScheduleEvent={handleScheduleEvent}
          selectedUser={state.selectedUser}
        />
      </div>
    </div>
  );
};
