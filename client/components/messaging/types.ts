export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  status: "active" | "offline" | "away";
  lastSeen?: Date;
  profileUrl?: string;
  role?: string;
  subscribed?: boolean;
  subscribedDaysAgo?: number;
  lastContact?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: "text" | "file" | "image" | "system";
  timestamp: Date;
  fileUrl?: string;
  fileName?: string;
  status: "sending" | "sent" | "delivered" | "read";
  platform: "email" | "sms" | "whatsapp" | "in-app";
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
  type: "direct" | "group";
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  attendees: User[];
  location?: string;
  status: "upcoming" | "in-progress" | "completed" | "cancelled";
  platform: "google" | "outlook" | "in-app";
}

export interface Notification {
  id: string;
  type: "message" | "deal" | "event" | "system";
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

export interface CommandParsed {
  mention: string;
  isNewUser: boolean;
  userData?: {
    name: string;
    email: string;
    phone?: string;
  };
  message: string;
  files?: string[];
  platform: "email" | "sms" | "whatsapp" | "in-app";
}

export interface MessagingState {
  conversations: Conversation[];
  selectedConversationId: string | null;
  messages: { [conversationId: string]: Message[] };
  users: User[];
  events: CalendarEvent[];
  notifications: Notification[];
  isLoading: boolean;
  commandPaletteOpen: boolean;
  calendarModalOpen: boolean;
  selectedUser: User | null;
}
