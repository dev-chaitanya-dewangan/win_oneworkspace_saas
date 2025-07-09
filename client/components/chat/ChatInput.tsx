import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mic, Square, Send } from "lucide-react";

// Simulated database types
interface User {
  id: number;
  username: string;
  avatar: string;
}

interface FileItem {
  id: number;
  name: string;
  type: 'pdf' | 'image' | 'doc';
  owner: number;
  url: string;
}

interface MindRef {
  id: number;
  title: string;
  type: 'node' | 'connection';
}

interface Chip {
  id: string;
  type: 'mention' | 'file' | 'mind';
  text: string;
  data: any;
}

// Simulated Supabase database
const mockUsers: User[] = [
  { id: 1, username: 'tom', avatar: 'T' },
  { id: 2, username: 'alice', avatar: 'A' },
  { id: 3, username: 'bob', avatar: 'B' },
  { id: 4, username: 'sarah', avatar: 'S' },
];

const mockFiles: FileItem[] = [
  { id: 1, name: 'project-specs.pdf', type: 'pdf', owner: 1, url: '/files/specs.pdf' },
  { id: 2, name: 'wireframes.png', type: 'image', owner: 1, url: '/files/wireframes.png' },
  { id: 3, name: 'architecture-diagram.pdf', type: 'pdf', owner: 1, url: '/files/arch.pdf' },
  { id: 4, name: 'user-research.pdf', type: 'pdf', owner: 2, url: '/files/research.pdf' },
  { id: 5, name: 'mockup-v2.png', type: 'image', owner: 2, url: '/files/mockup.png' },
  { id: 6, name: 'requirements.doc', type: 'doc', owner: 3, url: '/files/req.doc' },
];

const mockMindRefs: MindRef[] = [
  { id: 1, title: 'User Authentication Flow', type: 'node' },
  { id: 2, title: 'Database Schema Design', type: 'node' },
  { id: 3, title: 'API Integration Points', type: 'node' },
  { id: 4, title: 'Payment Processing Logic', type: 'connection' },
  { id: 5, title: 'Error Handling Strategy', type: 'connection' },
];

// Simulated API functions
const fetchUsers = async (query: string): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockUsers.filter(user => 
    user.username.toLowerCase().includes(query.toLowerCase())
  );
};

const fetchUserFiles = async (userId: number): Promise<FileItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockFiles.filter(file => file.owner === userId);
};

const fetchMindRefs = async (query: string): Promise<MindRef[]> => {
  await new Promise(resolve => setTimeout(resolve, 250));
  return mockMindRefs.filter(ref => 
    ref.title.toLowerCase().includes(query.toLowerCase())
  );
};

const simulateWhisperAPI = async (): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const transcripts = [
    "Can you help me review the project specifications?",
    "Let's discuss the user authentication flow",
    "I need to check the database schema design",
    "Please show me the latest wireframes",
    "How is the payment processing integration going?"
  ];
  return transcripts[Math.floor(Math.random() * transcripts.length)];
};

interface ChatInputProps {
  onSendMessage: (message: string, chips: Chip[]) => void;
  placeholder?: string;
  className?: string;
  popupDirection?: 'up' | 'down';
  mentionTextColor?: string;
  highlightColor?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  placeholder = "Type or say your command...",
  className = "",
  popupDirection = "down",
  mentionTextColor = "white",
  highlightColor = "transparent"
}) => {
  const [inputValue, setInputValue] = React.useState("");
  const [chips, setChips] = React.useState<Chip[]>([]);
  const [dropdown, setDropdown] = React.useState<'none' | 'mention' | 'file' | 'mind'>('none');
  const [query, setQuery] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const [displayNumber, setDisplayNumber] = React.useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = React.useState(0);
  
  // Dropdown data
  const [users, setUsers] = React.useState<User[]>([]);
  const [files, setFiles] = React.useState<FileItem[]>([]);
  const [mindRefs, setMindRefs] = React.useState<MindRef[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const inputRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Handle input changes
  const handleInput = React.useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || "";
    setInputValue(text);
    
    const cursorPos = window.getSelection()?.getRangeAt(0)?.startOffset || 0;
    setCursorPosition(cursorPos);
    
    // Check for triggers
    const lastChar = text[cursorPos - 1];
    const beforeCursor = text.substring(0, cursorPos);
    
    if (lastChar === '@' && dropdown === 'none') {
      setDropdown('mention');
      setQuery('');
      setSelectedIndex(0);
      fetchUsers('').then(setUsers);
    } else if (lastChar === '#' && dropdown === 'none') {
      setDropdown('mind');
      setQuery('');
      setSelectedIndex(0);
      fetchMindRefs('').then(setMindRefs);
    } else if (dropdown === 'mention') {
      const mentionMatch = beforeCursor.match(/@([^@#\s]*)$/);
      if (mentionMatch) {
        const q = mentionMatch[1];
        setQuery(q);
        fetchUsers(q).then(setUsers);
      } else {
        setDropdown('none');
      }
    } else if (dropdown === 'mind') {
      const mindMatch = beforeCursor.match(/#([^@#\s]*)$/);
      if (mindMatch) {
        const q = mindMatch[1];
        setQuery(q);
        fetchMindRefs(q).then(setMindRefs);
      } else {
        setDropdown('none');
      }
    }
  }, [dropdown]);

  // Handle key navigation
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (dropdown !== 'none') {
      const items = dropdown === 'mention' ? users : dropdown === 'file' ? files : mindRefs;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[selectedIndex]) {
          if (dropdown === 'mention') {
            selectUser(items[selectedIndex] as User);
          } else if (dropdown === 'file') {
            selectFile(items[selectedIndex] as FileItem);
          } else if (dropdown === 'mind') {
            selectMindRef(items[selectedIndex] as MindRef);
          }
        }
      } else if (e.key === 'Escape') {
        setDropdown('none');
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [dropdown, users, files, mindRefs, selectedIndex]);

  // Selection handlers
  const selectUser = React.useCallback(async (user: User) => {
    setSelectedUser(user);
    const userFiles = await fetchUserFiles(user.id);
    setFiles(userFiles);
    setDropdown('file');
    setSelectedIndex(0);
    
    // Replace @query with @username
    const newInputValue = inputValue.replace(/@[^@#\s]*$/, `@${user.username} `);
    setInputValue(newInputValue);
    setChips([...chips, { id: user.id.toString(), type: 'mention', text: `@${user.username}`, data: user }]);
    setDropdown('none');
  }, [inputValue, chips]);

  const selectFile = React.useCallback((file: FileItem) => {
    if (!selectedUser) return;
    
    const chipId = `chip-${Date.now()}`;
    const newChip: Chip = {
      id: chipId,
      type: 'file',
      text: `@${selectedUser.username}:${file.name}`,
      data: { user: selectedUser, file }
    };
    
    setChips(prev => [...prev, newChip]);
    
    // Clear the input text
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.textContent = '';
    }
    
    setDropdown('none');
    setSelectedUser(null);
  }, [selectedUser]);

  const selectMindRef = React.useCallback((mindRef: MindRef) => {
    const chipId = `chip-${Date.now()}`;
    const newChip: Chip = {
      id: chipId,
      type: 'mind',
      text: `#${mindRef.title}`,
      data: mindRef
    };
    
    setChips(prev => [...prev, newChip]);
    
    // Clear the input text
    const newText = inputValue.replace(new RegExp(`#${query}$`), '');
    setInputValue(newText);
    if (inputRef.current) {
      inputRef.current.textContent = newText;
    }
    
    setDropdown('none');
  }, [inputValue, query]);

  const removeChip = React.useCallback((chipId: string) => {
    setChips(prev => prev.filter(chip => chip.id !== chipId));
  }, []);

  // Mic recording handler
  const toggleMic = React.useCallback(async () => {
    if (!isRecording) {
      setIsRecording(true);
      
      // Countdown simulation
      for (let i = 4; i >= 1; i--) {
        if (!isRecording) break; // Check if cancelled
        setDisplayNumber(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (isRecording) {
        try {
          const transcript = await simulateWhisperAPI();
          setInputValue(transcript);
          if (inputRef.current) {
            inputRef.current.textContent = transcript;
          }
        } catch (error) {
          console.error('Whisper simulation failed:', error);
        }
      }
      
      setIsRecording(false);
      setDisplayNumber(null);
    } else {
      setIsRecording(false);
      setDisplayNumber(null);
    }
  }, [isRecording]);

  // Send handler
  const handleSend = React.useCallback(() => {
    if (inputValue.trim() || chips.length > 0) {
      onSendMessage(inputValue.trim(), chips);
      setInputValue('');
      setChips([]);
      if (inputRef.current) {
        inputRef.current.textContent = '';
      }
    }
  }, [inputValue, chips, onSendMessage]);

  // Click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdown('none');
      }
    };

    if (dropdown !== 'none') {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdown]);

  // Generate chip styles with progressive saturation
  const getChipStyle = React.useCallback((index: number, type: Chip['type']) => {
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

    return {
      backgroundColor: colors[type],
      borderColor: borderColors[type],
      '--sat': saturation
    } as React.CSSProperties;
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Main Input Container */}
      <div className="bg-card/95 border border-border rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 backdrop-blur-sm shadow-lg">
        {/* Chips Display */}
        <div className="flex flex-wrap gap-1">
          {chips.map((chip, index) => (
            <span
              key={chip.id}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border shadow-sm"
              style={getChipStyle(index, chip.type)}
            >
              {chip.text}
              <button
                onClick={() => removeChip(chip.id)}
                className="ml-1.5 hover:opacity-100 transition-opacity opacity-70 bg-none border-none cursor-pointer text-sm leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex-1 relative">
          <div
            ref={inputRef}
            contentEditable
            className="min-h-[24px] outline-none text-sm text-foreground bg-transparent break-words resize-none"
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            suppressContentEditableWarning={true}
          />
          
          {/* Recording Countdown Overlay */}
          {isRecording && displayNumber && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded text-5xl font-bold text-red-500 backdrop-blur-sm">
              {displayNumber}
            </div>
          )}
          
          {!inputValue && chips.length === 0 && !isRecording && (
            <div className="absolute inset-0 flex items-center text-muted-foreground pointer-events-none text-sm">
              {placeholder}
            </div>
          )}
        </div>

        {/* Mic Button */}
        <button
          className={cn(
            "w-8 h-8 sm:w-9 sm:h-9 rounded-full border-none flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95",
            isRecording 
              ? "bg-red-500 shadow-lg shadow-red-500/40" 
              : "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30"
          )}
          onClick={toggleMic}
        >
          {isRecording ? (
            <Square className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          ) : (
            <Mic className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          )}
        </button>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!inputValue.trim() && chips.length === 0}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed w-8 h-8 sm:w-9 sm:h-9 p-0"
        >
          <Send className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>

      {/* Dropdowns */}
      {dropdown !== 'none' && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute left-0 right-0 bg-card/95 backdrop-blur-sm border border-border rounded-lg max-h-48 overflow-y-auto z-50 mt-1 shadow-xl",
            popupDirection === 'up' ? "bottom-full mb-1" : "top-full"
          )}
        >
          {dropdown === 'mention' && users.map((user, index) => (
            <div
              key={user.id}
              onClick={() => selectUser(user)}
              className={cn(
                "p-3 cursor-pointer flex items-center gap-2 transition-colors hover:bg-accent/50",
                index === selectedIndex && "bg-accent/30"
              )}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {user.avatar}
              </div>
              <span className="text-sm font-medium text-foreground">@{user.username}</span>
            </div>
          ))}

          {dropdown === 'file' && files.map((file, index) => (
            <div
              key={file.id}
              onClick={() => selectFile(file)}
              className={cn(
                "p-3 cursor-pointer flex items-center gap-2 transition-colors hover:bg-accent/50",
                index === selectedIndex && "bg-accent/30"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white",
                file.type === 'pdf' && "bg-red-500",
                file.type === 'image' && "bg-green-500",
                file.type === 'doc' && "bg-blue-500"
              )}>
                {file.type === 'pdf' ? '📄' : file.type === 'image' ? '🖼️' : '📄'}
              </div>
              <span className="text-sm text-foreground">{file.name}</span>
            </div>
          ))}

          {dropdown === 'mind' && mindRefs.map((ref, index) => (
            <div
              key={ref.id}
              onClick={() => selectMindRef(ref)}
              className={cn(
                "p-3 cursor-pointer flex items-center gap-2 transition-colors hover:bg-accent/50",
                index === selectedIndex && "bg-accent/30"
              )}
            >
              <div className="w-6 h-6 rounded bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                {ref.type === 'node' ? '🧠' : '🔗'}
              </div>
              <span className="text-sm text-foreground">#{ref.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 