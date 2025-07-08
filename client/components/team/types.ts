export interface TeamMember {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  email: string;
  phone?: string;
  birthday?: string;
  tags: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  isFavorite: boolean;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: "meeting" | "task" | "event" | "bug_fix" | "project";
  date: Date;
  participants: TeamMember[];
  category: string;
  relatedNode?: {
    id: string;
    title: string;
    canvasPosition?: { x: number; y: number };
  };
  status: "upcoming" | "in_progress" | "completed" | "cancelled";
}

export interface ContactFilter {
  category: "all" | "work" | "friends" | "family" | "important";
  searchQuery: string;
  showFavoritesOnly: boolean;
}

export interface TeamCollaborationState {
  isOpen: boolean;
  selectedMemberId: string | null;
  activePanel: "contacts" | "profile" | "activity";
  filter: ContactFilter;
}
