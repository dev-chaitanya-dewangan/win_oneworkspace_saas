# OneWorkspace - Project Schema

## 1. App Flow & Product UX

### High-Level User Journeys

#### Primary Flow: AI-Powered Workspace Creation

```
1. Landing Page → Sign Up/Login
2. Dashboard → Choose Workspace Type (Mind Mapping, Chat, File Storage)
3. Create Project → Invite Team Members
4. Begin Work → Use AI Assistant for guidance
5. Collaborate → Real-time editing and sharing
6. Review & Export → Download insights and results
```

#### Mind Mapping Flow

```
1. Navigate to /mind → View existing nodes or empty canvas
2. Press Ctrl+Shift+K → Quick create node dialog opens
3. Type node title → Node appears on canvas
4. Drag to connect → Visual connections between ideas
5. Edit in sidebar → Rich content and formatting
6. Export/Share → Save as file or share with team
```

#### Chat & AI Interaction Flow

```
1. Navigate to /chat → Enter chat interface
2. Type message → AI processes and responds
3. Include files → AI analyzes content
4. Request weather → Dynamic weather cards appear
5. Export conversation → Save chat history
```

#### File Storage & AI Analysis Flow

```
1. Navigate to /mind/database → File storage board
2. Drag & drop files → Automatic upload
3. AI analysis (≤10MB) → Smart content insights
4. Review results → Expandable summary cards
5. Organize & share → Team collaboration
```

### Step-by-Step UI States

#### Node Creation (Mind Mapping)

1. **Empty State**: Canvas with dotted grid background
2. **Hover State**: Connection points appear on nodes
3. **Drag State**: Node follows cursor, semi-transparent
4. **Connect State**: Line preview while dragging
5. **Edit State**: Sidebar opens with full editing options

#### File Upload (Storage)

1. **Idle State**: File grid with upload prompts
2. **Drag Over**: Blue highlight overlay with instructions
3. **Uploading**: Progress indicators and toasts
4. **Analyzing**: AI processing badge with spinner
5. **Complete**: Expandable results with action buttons

### Accessibility Considerations

- **Keyboard Navigation**: Tab order through all interactive elements
- **Screen Reader**: ARIA labels and semantic HTML structure
- **Focus Management**: Visible focus indicators with proper contrast
- **Color Contrast**: WCAG 2.1 AA compliance (4.5:1 minimum)
- **Motion**: Respects `prefers-reduced-motion` for animations

### Mobile/Touch Considerations

- **Touch Targets**: Minimum 44px tap areas
- **Gesture Support**: Pinch-to-zoom on mind map canvas
- **Responsive Layout**: Sidebar collapses to drawer on mobile
- **Voice Input**: Touch-and-hold for voice commands
- **Swipe Navigation**: Horizontal swipe between sections

## 2. Metadata

```yaml
name: "OneWorkspace"
version: "1.0.0"
description: "AI-powered workspace with mind mapping, chat, file storage, and team collaboration"
author: "Aaditya Dewangan"
license: "MIT"
repository: "https://github.com/username/oneworkspace"
homepage: "https://oneworkspace.ai"
keywords: ["ai", "workspace", "mind-mapping", "collaboration", "productivity"]
```

## 3. Modules

### Backend

- **Type**: Node.js + Express + TypeScript
- **Entry**: `src/server/index.ts`
- **Environment Variables**:
  - `DATABASE_URL`: PostgreSQL connection string
  - `JWT_SECRET`: Authentication token secret
  - `OPENAI_API_KEY`: AI integration key
  - `GOOGLE_OAUTH_CLIENT_ID`: OAuth authentication
  - `UPLOAD_BUCKET`: File storage configuration
- **Port**: 3001 (configurable)

### Frontend

- **Type**: React + Vite + TypeScript
- **Entry**: `client/App.tsx`
- **Framework**: React 18 with hooks and context
- **Styling**: Tailwind CSS + CSS Custom Properties
- **Theming**: Dark/light toggle with system preference detection
- **Routing**: React Router v6 with nested routes
- **State Management**: React Query + Local State

## 4. Product UX

### Philosophy

"Seamless AI-enhanced productivity with intuitive visual interfaces"

### Goals

1. **Reduce Cognitive Load**: AI assists in organizing thoughts and tasks
2. **Visual Thinking**: Mind mapping for better idea connections
3. **Seamless Collaboration**: Real-time team interaction
4. **Universal Access**: Works across all devices and abilities

### User Types

- **Individual Creators**: Writers, designers, researchers
- **Small Teams**: Startups, agencies, project groups
- **Enterprise Users**: Large organizations with compliance needs
- **Students**: Educational institutions and learners

### Core Flows

#### Onboarding Flow

1. **Welcome Screen**: Feature overview with video demos
2. **Account Setup**: Quick registration with OAuth options
3. **Workspace Creation**: Choose template or start blank
4. **Tutorial**: Interactive guide through core features
5. **First Success**: Complete first mind map or chat

#### Daily Usage Flow

1. **Quick Access**: Global search (Cmd+K) for any content
2. **Context Switching**: Sidebar navigation between tools
3. **AI Assistance**: Always-available help and suggestions
4. **Collaboration**: Real-time presence and sharing
5. **Review & Plan**: Daily insights and next actions

### Responsive UX

#### Mobile (< 768px)

- **Navigation**: Collapsible bottom sheet sidebar
- **Mind Map**: Touch gestures with zoom controls
- **Chat**: Full-screen with swipe-to-dismiss
- **Files**: Grid layout with pull-to-refresh

#### Tablet (768px - 1024px)

- **Split View**: Sidebar + main content side-by-side
- **Mind Map**: Optimized for touch with larger tap targets
- **Multi-tasking**: Picture-in-picture chat overlay

#### Desktop (> 1024px)

- **Full Layout**: Persistent sidebar with breadcrumbs
- **Keyboard Shortcuts**: Complete hotkey system
- **Multi-monitor**: Window management and sharing

### Accessibility

#### Keyboard Navigation

- **Tab Order**: Logical flow through interactive elements
- **Shortcuts**: All mouse actions have keyboard equivalents
- **Focus Traps**: Modal dialogs contain focus properly
- **Skip Links**: Quick navigation to main content

#### Screen Reader Support

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Descriptive labels for complex interactions
- **Live Regions**: Dynamic content announcements
- **Alt Text**: Comprehensive image descriptions

#### Focus Management

- **Visual Indicators**: High-contrast focus rings
- **Focus Restoration**: Return focus after modal closure
- **Roving Tabindex**: Efficient navigation in grids/lists

## 5. Data Models

### Core User Management

```typescript
User {
  id: uuid (primary key)
  name: string (required)
  email: string (unique, required)
  avatarUrl?: string (optional profile image)
  avatar: string (initials fallback)
  isActive: boolean (online status)
  preferences: UserPreferences
  createdAt: datetime
  updatedAt: datetime
}

UserPreferences {
  theme: 'dark' | 'light' | 'system'
  language: string (default: 'en')
  notifications: NotificationSettings
  accessibility: AccessibilitySettings
}
```

### Project & Collaboration

```typescript
Project {
  id: uuid (primary key)
  title: string (required)
  description?: string
  ownerId: uuid → User.id
  collaborators: User[] (many-to-many)
  settings: ProjectSettings
  createdAt: datetime
  updatedAt: datetime
}

Workspace {
  id: uuid (primary key)
  projectId: uuid → Project.id
  type: 'mindmap' | 'chat' | 'files' | 'hybrid'
  data: WorkspaceData (JSON)
  permissions: Permission[]
}
```

### Chat System

```typescript
Chat {
  id: uuid (primary key)
  projectId: uuid → Project.id
  title: string
  messages: Message[]
  participants: User[]
  isActive: boolean
  metadata: ChatMetadata
  createdAt: datetime
}

Message {
  id: uuid (primary key)
  chatId: uuid → Chat.id
  authorId: uuid → User.id
  content: string (required)
  type: 'user' | 'ai' | 'system'
  timestamp: datetime
  reactions: Reaction[]
  attachments: Attachment[]
  metadata: MessageMetadata
}

MessageMetadata {
  includesImage?: boolean
  includesWeather?: boolean
  weatherData?: WeatherData
  aiContext?: string
  isEdited?: boolean
  editHistory?: MessageEdit[]
}
```

### Mind Mapping

```typescript
MindNode {
  id: uuid (primary key)
  title: string (required)
  content: string
  position: Position (canvas coordinates)
  size: Size (width/height)
  color: string (theme color key)
  tags: string[]
  collaborators: User[]
  breadcrumb: string (navigation path)
  children: MindNode[] (hierarchical)
  metadata: NodeMetadata
  createdAt: datetime
  updatedAt: datetime
}

Connection {
  id: uuid (primary key)
  fromNodeId: uuid → MindNode.id
  toNodeId: uuid → MindNode.id
  fromSide: 'top' | 'bottom' | 'left' | 'right'
  toSide: 'top' | 'bottom' | 'left' | 'right'
  style: ConnectionStyle
  label?: string
  bidirectional: boolean
}

Position {
  x: number (canvas x-coordinate)
  y: number (canvas y-coordinate)
  z?: number (layer/depth)
}

Size {
  width: number (minimum: 200px)
  height: number (minimum: 80px)
  isLocked?: boolean
}
```

### File Management

```typescript
FileItem {
  id: uuid (primary key)
  name: string (required)
  originalName: string (uploaded filename)
  type: string (MIME type)
  size: string (human readable)
  sizeBytes: number (exact bytes)
  path: string (storage path)
  sharedBy: User
  permissions: FilePermission[]
  isAnalyzed: boolean
  isAnalyzing: boolean
  analysisResult?: AnalysisResult
  tags: string[]
  metadata: FileMetadata
  uploadedAt: datetime
  modifiedAt: datetime
}

AnalysisResult {
  summary: string[] (AI-generated insights)
  fileType: string (detected type)
  extractedText?: string
  confidence: number (0-1)
  suggestedTags: string[]
  relatedFiles: FileItem[]
  processingTime: number (milliseconds)
}
```

### System & Monitoring

```typescript
ActivityLog {
  id: uuid (primary key)
  userId: uuid → User.id
  action: string (action type)
  resourceType: string (model name)
  resourceId: uuid (target resource)
  details: ActivityDetails (JSON)
  timestamp: datetime
  ipAddress?: string
  userAgent?: string
}

SystemHealth {
  timestamp: datetime
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  activeUsers: number
  apiResponseTime: number
  errorRate: number
}
```

## 6. API Endpoints

### Authentication & Users

```
POST   /api/auth/login          → { user: User, token: string }
POST   /api/auth/logout         → { success: boolean }
POST   /api/auth/refresh        → { token: string }
GET    /api/users/me            → User
PUT    /api/users/me            → User
GET    /api/users/search        → User[]
```

### Projects & Workspaces

```
GET    /api/projects            → Project[]
POST   /api/projects            → Project
GET    /api/projects/:id        → Project
PUT    /api/projects/:id        → Project
DELETE /api/projects/:id        → { success: boolean }
POST   /api/projects/:id/invite → { success: boolean }
```

### Chat System

```
GET    /api/chats                     → Chat[]
POST   /api/chats                     → Chat
GET    /api/chats/:id/messages        → Message[]
POST   /api/chats/:id/messages        → Message
PUT    /api/messages/:id              → Message
DELETE /api/messages/:id              → { success: boolean }
POST   /api/ai/chat                   → { response: string, context: any }
```

### Mind Mapping

```
GET    /api/mind/nodes          → MindNode[]
POST   /api/mind/nodes          → MindNode
GET    /api/mind/nodes/:id      → MindNode
PUT    /api/mind/nodes/:id      → MindNode
DELETE /api/mind/nodes/:id      → { success: boolean }
GET    /api/mind/connections    → Connection[]
POST   /api/mind/connections    → Connection
DELETE /api/mind/connections/:id → { success: boolean }
```

### File Management

```
GET    /api/files               → FileItem[]
POST   /api/files/upload        → FileItem
GET    /api/files/:id           → FileItem
DELETE /api/files/:id           → { success: boolean }
POST   /api/files/:id/analyze   → AnalysisResult
GET    /api/files/:id/download  → FileStream
POST   /api/files/:id/share     → { shareUrl: string }
```

### Search & Discovery

```
GET    /api/search              → SearchResult[]
  ?q=query&type=all|users|files|nodes&limit=20&offset=0
GET    /api/search/suggestions  → string[]
GET    /api/recent              → RecentItem[]
```

### System & Analytics

```
GET    /api/health              → SystemHealth
GET    /api/analytics/usage     → UsageStats
POST   /api/feedback            → { success: boolean }
GET    /api/notifications       → Notification[]
PUT    /api/notifications/:id/read → { success: boolean }
```

## 7. UI Components & Pages

### Page Structure

#### Index (/) - Landing Page

**Components**: HeroSection, FeatureCards, Testimonials, WaitlistForm
**Purpose**: Marketing and conversion
**Key Features**:

- Animated hero with typewriter effect
- Interactive feature demonstrations
- Social proof and testimonials
- Email capture with validation

#### Dashboard (/dashboard) - Command Center

**Components**: ActivityFeed, ProjectCards, QuickActions, AIAssistant
**Purpose**: Central hub for productivity
**Key Features**:

- Real-time activity stream
- Project overview cards
- Quick action buttons
- AI command input

#### Search (/search) - Global Search

**Components**: SearchShowcase, FeatureCards, GlobalSearch
**Purpose**: Search interface and documentation
**Key Features**:

- Cmd+K global shortcut demo
- Search result previews
- Filter and sort options
- Usage statistics

#### Chat (/chat) - AI Conversation

**Components**: MessageBubble, WeatherCard, CommandInput, VoiceRecording
**Purpose**: AI-powered conversations
**Key Features**:

- Message threading
- Rich media support (weather, images)
- Voice input with visual feedback
- Export conversations

#### Mind (/mind) - Mind Mapping

**Components**: MindCanvas, MindNodeComponent, ConnectionLine, MindSidebar
**Purpose**: Visual idea organization
**Key Features**:

- Infinite canvas with zoom/pan
- Drag-and-drop node creation
- Real-time collaboration
- Export to various formats

#### Database (/mind/database) - File Storage

**Components**: AiFileStorageBoard, FileGrid, UploadZone, AnalysisResults
**Purpose**: AI-powered file management
**Key Features**:

- Drag-and-drop upload
- AI content analysis
- File organization
- Team sharing

### Component Specifications

#### SearchCommandDrawer

**Description**: Global search and command interface
**Props**:

- `isOpen: boolean` - Controls visibility
- `onClose: () => void` - Close handler
  **UX States**:
- **Empty State**: "Start typing to search..."
- **Loading State**: Skeleton results with pulse animation
- **Error State**: "Search temporarily unavailable"
- **No Results**: "No results found for 'query'"
  **Styling**: 460px width, glass-morphism background, dark theme
  **Responsive**: Full-screen on mobile with sticky header

#### MindNodeComponent

**Description**: Interactive mind map node
**Props**:

- `node: MindNode` - Node data
- `onSelect: () => void` - Selection handler
- `onDragStart: (e: MouseEvent) => void` - Drag initiation
- `isDragging: boolean` - Drag state
  **UX States**:
- **Default State**: Clean card with subtle shadow
- **Hover State**: Elevated shadow, connection points visible
- **Selected State**: Blue border with action buttons
- **Editing State**: Inline title editing
- **Connecting State**: Highlighted for connection target
  **Interactions**:
- Click to select
- Double-click to edit title
- Drag to move
- Hover to show connection points
- Right-click for context menu

#### AiFileStorageBoard

**Description**: File storage with AI analysis
**Props**:

- `files: FileItem[]` - File list
- `onUpload: (files: File[]) => void` - Upload handler
  **UX States**:
- **Empty State**: Large upload area with instructions
- **Drag Over**: Blue highlight with "Drop files here"
- **Uploading**: Progress bars and file previews
- **Analyzing**: AI processing indicators
- **Complete**: Expandable analysis results
  **Features**:
- Drag-and-drop from desktop
- Drag-out to desktop
- Batch operations
- AI analysis for supported formats

#### WeatherCard

**Description**: Dynamic weather display in chat
**Props**:

- `temperature: number` - Current temperature
- `hourlyForecast: HourlyForecast[]` - Hourly data
- `highLow: {high: number, low: number}` - Daily range
  **Styling**: Blue gradient background, glass-morphism, rounded corners
  **Animation**: Smooth entry with slide-up effect
  **Responsive**: Horizontal scroll on mobile for hourly forecast

### Component States & Behaviors

#### Loading States

- **Skeleton Screens**: Content-aware loading placeholders
- **Progress Indicators**: Circular for indefinite, linear for progress
- **Shimmer Effects**: Subtle animation on placeholder content
- **Micro-interactions**: Button press feedback, hover states

#### Error States

- **Inline Errors**: Field-level validation messages
- **Page Errors**: Friendly error pages with recovery actions
- **Network Errors**: Retry mechanisms with exponential backoff
- **Validation Errors**: Real-time feedback with clear instructions

#### Empty States

- **First-time Use**: Onboarding prompts and tutorials
- **No Content**: Motivational messaging with clear next steps
- **No Results**: Search suggestions and alternative actions
- **Deleted Content**: Confirmation with undo options

## 8. Theming System

### CSS Custom Properties

#### Dark Theme (Default)

```css
:root {
  /* Primary surfaces */
  --bg-primary: #0d0d0d;
  --bg-secondary: #1a1a1a;
  --bg-tertiary: #262626;

  /* Text colors */
  --text-primary: #f5f5f5;
  --text-secondary: #a0a0a0;
  --text-muted: #6b7280;

  /* Accent colors */
  --accent-green: #6fffb0;
  --accent-yellow: #ffe066;
  --accent-pink: #ff69b4;
  --accent-orange: #ffb347;
  --accent-blue: #60a5fa;

  /* System colors */
  --border-muted: #2e2e2e;
  --highlight: #ffe666;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;

  /* Effects */
  --glass-blur: backdrop-blur(8px);
  --glass-tint: rgba(255, 255, 255, 0.02);
  --shadow-soft: 0 4px 24px rgba(0, 0, 0, 0.4);
  --shadow-hard: 0 8px 32px rgba(0, 0, 0, 0.6);
}
```

#### Light Theme

```css
.light {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #f1f3f4;

  --text-primary: #1a1a1a;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;

  /* Accent colors remain the same for consistency */

  --border-muted: #e5e7eb;
  --glass-tint: rgba(0, 0, 0, 0.02);
  --shadow-soft: 0 4px 24px rgba(0, 0, 0, 0.1);
  --shadow-hard: 0 8px 32px rgba(0, 0, 0, 0.15);
}
```

### Typography Scale

```css
/* Font families */
--font-primary: "Inter", "Satoshi", system-ui, -apple-system, sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", Consolas, monospace;

/* Type scale */
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem; /* 36px */

/* Line heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Spacing Scale

```css
/* Spacing system (based on 4px grid) */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-5: 1.25rem; /* 20px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-10: 2.5rem; /* 40px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
--space-20: 5rem; /* 80px */
--space-24: 6rem; /* 96px */
```

### Theme Switching

```typescript
// Theme context and switching logic
const useTheme = () => {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("system");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  return { theme, toggleTheme };
};
```

## 9. Features by Category

### AI Integration

- **OpenAI GPT Integration**: Contextual responses in chat
- **File Content Analysis**: AI insights for uploaded documents
- **Smart Search**: AI-powered search suggestions and results
- **Voice Commands**: Speech-to-text with natural language processing
- **Content Generation**: AI-assisted writing and idea generation
- **Smart Tagging**: Automatic categorization and labeling

### Collaboration Features

- **Real-time Presence**: Live user cursors and activity indicators
- **Shared Workspaces**: Multi-user mind maps and file collections
- **Team Chat**: Project-specific communication channels
- **Permission Management**: Granular access control for resources
- **Activity Feeds**: Timeline of team actions and changes
- **Commenting System**: Contextual discussions on content

### Productivity Tools

- **Global Search (Cmd+K)**: Instant access to any content
- **Quick Actions**: Keyboard shortcuts for common tasks
- **Drag & Drop**: File uploads and mind map organization
- **Calendar Integration**: Google Calendar sync for scheduling
- **Export Options**: PDF, PNG, JSON formats for all content
- **Template System**: Pre-built structures for common use cases

### User Experience

- **Theme Switching**: Dark/light mode with system preference
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Touch Interface**: Gesture support for mobile devices
- **Keyboard Navigation**: Complete accessibility via keyboard
- **Progressive Loading**: Skeleton screens and lazy loading
- **Offline Support**: Basic functionality without internet

### Security & Privacy

- **End-to-End Encryption**: Sensitive data protection
- **JWT Authentication**: Secure token-based sessions
- **OAuth Integration**: Google, GitHub, Microsoft sign-in
- **GDPR Compliance**: Data protection and user rights
- **Audit Logging**: Complete activity tracking
- **Content Moderation**: AI-powered inappropriate content detection

### Performance & Scalability

- **Lazy Loading**: On-demand component and data loading
- **Virtual Scrolling**: Efficient large list rendering
- **Image Optimization**: Automatic compression and sizing
- **CDN Integration**: Global content delivery
- **Caching Strategy**: Intelligent data caching
- **Error Boundaries**: Graceful error handling and recovery

## 10. Build Configuration

### Package Management

```json
{
  "packageManager": "npm",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### Scripts

```json
{
  "scripts": {
    "install": "npm ci",
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "vite --port 3000",
    "dev:server": "nodemon src/server/index.ts --port 3001",
    "test": "vitest",
    "test:ui": "@playwright/test",
    "test:coverage": "vitest --coverage",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "tsc -p tsconfig.server.json",
    "lint": "eslint . --ext .ts,.tsx --fix",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "analyze": "npm run build:client -- --analyze"
  }
}
```

### Runtime Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "@tanstack/react-query": "^4.24.0",
    "tailwindcss": "^3.2.0",
    "lucide-react": "^0.263.0",
    "sonner": "^1.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "framer-motion": "^9.0.0",
    "date-fns": "^2.29.0",
    "zustand": "^4.3.0"
  }
}
```

### Development Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^4.1.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^3.1.0",
    "eslint": "^8.34.0",
    "@typescript-eslint/eslint-plugin": "^5.52.0",
    "prettier": "^3.0.0",
    "vitest": "^0.28.0",
    "@playwright/test": "^1.30.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "concurrently": "^7.6.0",
    "nodemon": "^2.0.0"
  }
}
```

### Deployment Configuration

#### Vercel

```json
{
  "provider": "vercel",
  "settings": {
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "framework": "vite",
    "environmentVariables": {
      "NODE_ENV": "production",
      "VITE_API_URL": "https://api.oneworkspace.ai"
    }
  }
}
```

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/server/index.js"]
```

### Testing Strategy

- **Unit Tests**: Vitest for component and utility testing
- **Integration Tests**: React Testing Library for user interactions
- **E2E Tests**: Playwright for full application flows
- **Visual Regression**: Chromatic for UI consistency
- **Performance Tests**: Lighthouse CI for web vitals
- **Accessibility Tests**: axe-core for WCAG compliance

## 11. Glossary

### Technical Terms

- **uuid**: A universally unique identifier string (RFC 4122) used as primary keys
- **datetime**: ISO-8601 timestamp format (YYYY-MM-DDTHH:mm:ss.sssZ) for all time data
- **glassMorphism**: Background blur + translucency styling effect for modern UI depth
- **neonGradient**: CSS gradient technique with glowing neon colors for accent elements
- **responsiveDesign**: Adaptive layout that works across desktop, tablet, and mobile devices

### Product Terms

- **mindMapping**: Visual representation of information using connected nodes and relationships
- **aiAssistant**: Large language model integration providing intelligent responses and suggestions
- **dragAndDrop**: Interactive UI pattern for file uploads and object manipulation
- **realTimeCollaboration**: Live multi-user editing with presence indicators and conflict resolution
- **globalSearch**: Universal search functionality accessible from any application context

### UX/UI Terms

- **commandPalette**: Quick action interface triggered by keyboard shortcuts (Cmd+K)
- **contextMenu**: Right-click menu with relevant actions for selected content
- **breadcrumbs**: Navigation aid showing current location in information hierarchy
- **toastNotification**: Temporary popup message for status updates and confirmations
- **skeletonScreen**: Loading placeholder that mimics content structure

### Development Terms

- **componentLibrary**: Reusable UI building blocks with consistent styling and behavior
- **stateManagement**: Application data flow and storage patterns
- **apiEndpoint**: Server interface for client-server communication
- **typeScript**: Strongly-typed JavaScript superset for better development experience
- **vite**: Fast build tool for modern web development

### Business Terms

- **workspace**: Digital environment for team collaboration and productivity
- **projectManagement**: Tools and processes for organizing work and tracking progress
- **userJourney**: Step-by-step experience users have while accomplishing goals
- **accessibilityCompliance**: Adherence to WCAG guidelines for inclusive design
- **performanceOptimization**: Techniques to improve application speed and responsiveness

---

**Last Updated**: 2024-01-15  
**Schema Version**: 1.0.0  
**Maintainer**: Aaditya Dewangan  
**Review Cycle**: Monthly  
**Next Review**: 2024-02-15
