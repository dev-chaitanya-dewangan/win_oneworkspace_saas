import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Plus,
  Upload,
  UserPlus,
  MoreHorizontal,
  Filter,
  FolderOpen,
  FileText,
  Image,
  Archive,
  File,
  Video,
  Music,
  Sparkles,
  Download,
  Check,
  X,
  Undo,
  GripVertical,
  Share,
  Trash2,
  Menu,
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  sizeBytes: number;
  sharedBy: {
    name: string;
    avatar: string;
  };
  modified: string;
  isAnalyzed: boolean;
  isAnalyzing: boolean;
  analysisResult?: {
    summary: string[];
    fileType: string;
  };
}

interface Folder {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
}

const folders: Folder[] = [
  { id: "ui-design", name: "UI UX Design", icon: FolderOpen, count: 12 },
  { id: "legal-docs", name: "Legal Docs", icon: FileText, count: 8 },
  { id: "reports", name: "Reports", icon: FileText, count: 15 },
  { id: "presentations", name: "Presentations", icon: FileText, count: 6 },
  { id: "documents", name: "Documents", icon: FileText, count: 23 },
  { id: "templates", name: "Templates", icon: FileText, count: 4 },
  { id: "important", name: "Important", icon: FileText, count: 9 },
  { id: "meetings", name: "Meetings", icon: Video, count: 11 },
  { id: "resources", name: "Resources", icon: Archive, count: 7 },
  { id: "client-files", name: "Client Files", icon: FolderOpen, count: 18 },
];

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return Image;
    case "pdf":
      return FileText;
    case "zip":
    case "rar":
    case "7z":
      return Archive;
    case "mp4":
    case "avi":
    case "mov":
      return Video;
    case "mp3":
    case "wav":
    case "flac":
      return Music;
    default:
      return File;
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const generateRandomSize = (): { size: string; bytes: number } => {
  const bytes = Math.floor(Math.random() * 50000000); // Random size up to ~50MB
  return { size: formatFileSize(bytes), bytes };
};

const mockUsers = [
  { name: "Devin Lane", avatar: "DL" },
  { name: "Ronald Richards", avatar: "RR" },
  { name: "Courtney Henry", avatar: "CH" },
  { name: "Natasya Tailor", avatar: "NT" },
  { name: "Melina Sofia", avatar: "MS" },
  { name: "Current User", avatar: "CU" },
];

const initialFiles: FileItem[] = [
  {
    id: "1",
    name: "Design_Campaign.photo.JPG",
    type: "JPG",
    size: "3.0 MB",
    sizeBytes: 300,
    sharedBy: { name: "Devin Lane", avatar: "DL" },
    modified: "11 June 2020",
    isAnalyzed: false,
    isAnalyzing: false,
  },
  {
    id: "2",
    name: "Design_Illustrator.ZIP",
    type: "ZIP",
    size: "4.2 GB",
    sizeBytes: 4200000000,
    sharedBy: { name: "Ronald Richards", avatar: "RR" },
    modified: "10 June 2020",
    isAnalyzed: false,
    isAnalyzing: false,
  },
  {
    id: "3",
    name: "Design_Canva.Video.MP4",
    type: "MP4",
    size: "2.2 GB",
    sizeBytes: 2200000000,
    sharedBy: { name: "Courtney Henry", avatar: "CH" },
    modified: "09 June 2020",
    isAnalyzed: false,
    isAnalyzing: false,
  },
  {
    id: "4",
    name: "Design_Figma.file.FIG",
    type: "FIG",
    size: "4.3 GB",
    sizeBytes: 4300000000,
    sharedBy: { name: "Natasya Tailor", avatar: "NT" },
    modified: "08 June 2020",
    isAnalyzed: true,
    isAnalyzing: false,
    analysisResult: {
      summary: [
        "Contains 15 artboards with modern UI design",
        "Uses consistent design system with 8px grid",
        "Primary colors: Blue (#0066FF), Gray (#F5F5F5)",
        "Includes mobile and desktop responsive layouts",
      ],
      fileType: "Figma Design File",
    },
  },
  {
    id: "5",
    name: "Canva.Stock.photo.JPG",
    type: "JPG",
    size: "2.7 GB",
    sizeBytes: 2700000000,
    sharedBy: { name: "Melina Sofia", avatar: "MS" },
    modified: "07 June 2020",
    isAnalyzed: false,
    isAnalyzing: false,
  },
];

export const AiFileStorageBoard = () => {
  const [files, setFiles] = React.useState<FileItem[]>(initialFiles);
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isDraggingOut, setIsDraggingOut] = React.useState(false);
  const [draggedFileId, setDraggedFileId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [expandedFile, setExpandedFile] = React.useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);

    droppedFiles.forEach((file) => {
      const { size, bytes } = generateRandomSize();
      const randomUser =
        mockUsers[Math.floor(Math.random() * mockUsers.length)];

      const newFile: FileItem = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.name.split(".").pop()?.toUpperCase() || "FILE",
        size,
        sizeBytes: bytes,
        sharedBy: randomUser,
        modified: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        isAnalyzed: false,
        isAnalyzing: false,
      };

      setFiles((prev) => [newFile, ...prev]);

      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been added to your storage.`,
      });
    });
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId],
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map((f) => f.id));
    }
  };

  // Drag OUT handlers for files
  const handleFileDragStart = (e: React.DragEvent, file: FileItem) => {
    setIsDraggingOut(true);
    setDraggedFileId(file.id);

    // Set drag data for external applications
    e.dataTransfer.setData("text/plain", file.name);
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        id: file.id,
        name: file.name,
        type: file.type,
        size: file.size,
        sharedBy: file.sharedBy.name,
      }),
    );

    // Create a custom drag image
    const dragImage = document.createElement("div");
    dragImage.style.padding = "8px 12px";
    dragImage.style.backgroundColor = "#374151";
    dragImage.style.color = "white";
    dragImage.style.borderRadius = "6px";
    dragImage.style.fontSize = "14px";
    dragImage.style.fontWeight = "500";
    dragImage.textContent = file.name;
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    document.body.appendChild(dragImage);

    e.dataTransfer.setDragImage(dragImage, 0, 0);

    // Clean up drag image after drag starts
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);

    toast({
      title: "Dragging file",
      description: `${file.name} ready to be dropped to external location.`,
    });
  };

  const handleFileDragEnd = (e: React.DragEvent) => {
    setIsDraggingOut(false);
    setDraggedFileId(null);

    // Check if the file was dropped outside the application
    if (e.dataTransfer.dropEffect === "none") {
      toast({
        title: "File export ready",
        description: "File data is available for external applications.",
      });
    }
  };

  const startAnalysis = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    if (file.sizeBytes > 10 * 1024 * 1024) {
      // 10MB limit
      toast({
        title: "File too large",
        description: "AI analysis is only available for files under 10MB.",
        variant: "destructive",
      });
      return;
    }

    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, isAnalyzing: true } : f)),
    );

    toast({
      title: "Generating analysis...",
      description: "AI is analyzing your file content.",
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => cancelAnalysis(fileId)}
        >
          Cancel
        </Button>
      ),
    });

    // Simulate analysis
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                isAnalyzing: false,
                isAnalyzed: true,
                analysisResult: {
                  summary: [
                    "High-quality visual content detected",
                    "Optimal resolution for web and print use",
                    "Color palette analysis: Warm tones dominant",
                    "Metadata: Camera settings and location data found",
                  ],
                  fileType: f.type + " File",
                },
              }
            : f,
        ),
      );

      setExpandedFile(fileId);

      toast({
        title: "Analysis completed",
        description: "Your file has been successfully analyzed.",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => undoAnalysis(fileId)}
          >
            <Undo className="h-3 w-3 mr-1" />
            Undo
          </Button>
        ),
      });
    }, 3000);
  };

  const cancelAnalysis = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, isAnalyzing: false } : f)),
    );

    toast({
      title: "Analysis cancelled",
      description: "File analysis has been stopped.",
    });
  };

  const undoAnalysis = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              isAnalyzed: false,
              isAnalyzing: false,
              analysisResult: undefined,
            }
          : f,
      ),
    );
    setExpandedFile(null);

    toast({
      title: "Analysis undone",
      description: "File analysis has been removed.",
    });
  };

  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.sharedBy.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      className="h-full w-full bg-background text-foreground overflow-hidden flex flex-col"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag IN Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-foreground/20 border-2 border-foreground border-dashed z-50 flex items-center justify-center">
          <div className="text-center">
            <Upload className="h-12 w-12 text-foreground mx-auto mb-4" />
            <p className="text-xl font-semibold text-foreground">
              Drop files here to upload
            </p>
            <p className="text-muted-foreground">
              Files will be automatically added to your storage
            </p>
          </div>
        </div>
      )}

      {/* Drag OUT Overlay */}
      {isDraggingOut && (
        <div className="absolute inset-0 bg-foreground/20 border-2 border-foreground border-dashed z-40 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <Download className="h-12 w-12 text-foreground mx-auto mb-4" />
            <p className="text-xl font-semibold text-foreground">
              Drag to external location
            </p>
            <p className="text-muted-foreground">Drop outside to export file</p>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border bg-secondary">
        <div className="flex items-center space-x-2 lg:space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-foreground hover:bg-accent"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg lg:text-2xl font-bold text-foreground truncate">
            AI File Storage Board
          </h1>
          <Badge variant="outline" className="text-muted-foreground border-border hidden sm:inline-flex">
            {files.length} files
          </Badge>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-48 lg:w-64 bg-card border-border text-foreground placeholder-muted-foreground"
            />
          </div>

          <Button className="bg-foreground hover:bg-muted text-background hidden sm:inline-flex">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Create</span>
          </Button>

          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-accent hidden sm:inline-flex"
          >
            <Upload className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Upload</span>
          </Button>

          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-accent hidden lg:inline-flex"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden p-4 border-b border-border bg-secondary">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full bg-card border-border text-foreground placeholder-muted-foreground"
          />
        </div>
      </div>

      {/* Mobile Action Buttons */}
      <div className="sm:hidden flex items-center justify-between p-4 border-b border-border bg-secondary">
        <Button className="bg-foreground hover:bg-muted text-background flex-1 mr-2">
          <Plus className="h-4 w-4 mr-2" />
          Create
        </Button>
        <Button
          variant="outline"
          className="border-border text-foreground hover:bg-accent flex-1"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

      {/* Folder Navigation */}
      <div className="p-4 lg:p-6 border-b border-border bg-secondary">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base lg:text-lg font-semibold text-foreground">Folders</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Add Folder</span>
          </Button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2 lg:gap-3">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="flex flex-col items-center p-2 lg:p-3 rounded-lg bg-card hover:bg-accent cursor-pointer transition-colors group"
            >
              <folder.icon className="h-6 w-6 lg:h-8 lg:w-8 text-foreground mb-1 lg:mb-2 group-hover:text-muted-foreground" />
              <span className="text-xs text-center text-foreground group-hover:text-muted-foreground truncate w-full">
                {folder.name}
              </span>
              <span className="text-xs text-muted-foreground mt-1">{folder.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* File Table */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 lg:p-6 pb-4">
          <div className="flex items-center space-x-2 lg:space-x-4">
            <h2 className="text-base lg:text-lg font-semibold text-foreground">Your Files</h2>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Sort by:</span>
              <select className="bg-transparent border-none text-muted-foreground focus:outline-none">
                <option>Name</option>
                <option>Date</option>
                <option>Size</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Filter className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto hide-scrollbar">
          <div className="min-w-full">
            {/* Table Header - Hidden on mobile */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-4 lg:px-6 py-3 border-b border-border text-sm font-medium text-muted-foreground">
              <div className="col-span-1">
                <Checkbox
                  checked={
                    selectedFiles.length === files.length && files.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </div>
              <div className="col-span-4">Name</div>
              <div className="col-span-2">Shared By</div>
              <div className="col-span-2">File Size</div>
              <div className="col-span-2">Modified</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* File Rows */}
            <div className="space-y-0">
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.type);
                const isExpanded = expandedFile === file.id;

                return (
                  <div key={file.id} className="border-b border-border/50">
                    {/* Desktop Row */}
                    <div
                      draggable
                      onDragStart={(e) => handleFileDragStart(e, file)}
                      onDragEnd={handleFileDragEnd}
                      className={cn(
                        "hidden sm:grid grid-cols-12 gap-4 px-4 lg:px-6 py-4 hover:bg-accent/50 transition-colors items-center cursor-move",
                        selectedFiles.includes(file.id) && "bg-accent/30",
                        draggedFileId === file.id &&
                          "opacity-50 bg-destructive/30",
                      )}
                    >
                      <div className="col-span-1">
                        <Checkbox
                          checked={selectedFiles.includes(file.id)}
                          onCheckedChange={() => handleFileSelect(file.id)}
                        />
                      </div>

                      <div className="col-span-4 flex items-center space-x-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <GripVertical className="h-4 w-4 text-muted-foreground hover:text-foreground flex-shrink-0 cursor-move" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Drag to export file</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <FileIcon className="h-5 w-5 text-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground font-medium truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{file.type}</p>
                        </div>

                        {/* AI Analysis Button */}
                        {!file.isAnalyzed && !file.isAnalyzing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground flex-shrink-0"
                            onClick={() => startAnalysis(file.id)}
                          >
                            <Sparkles className="h-4 w-4" />
                          </Button>
                        )}

                        {file.isAnalyzing && (
                          <Badge
                            variant="outline"
                            className="text-yellow-400 border-yellow-400 flex-shrink-0"
                          >
                            Analyzing...
                          </Badge>
                        )}

                        {file.isAnalyzed && (
                          <Badge className="bg-green-600 text-white flex-shrink-0">
                            <Check className="h-3 w-3 mr-1" />
                            Analyzed
                          </Badge>
                        )}
                      </div>

                      <div className="col-span-2 flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-card text-foreground">
                            {file.sharedBy.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-foreground text-sm truncate">
                          {file.sharedBy.name}
                        </span>
                      </div>

                      <div className="col-span-2">
                        <span className="text-foreground text-sm">
                          {file.size}
                        </span>
                      </div>

                      <div className="col-span-2">
                        <span className="text-muted-foreground text-sm">
                          {file.modified}
                        </span>
                      </div>

                      <div className="col-span-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="bg-card border-border"
                          >
                            <DropdownMenuItem className="text-foreground hover:bg-accent">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-foreground hover:bg-accent">
                              <Share className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Mobile Row */}
                    <div
                      draggable
                      onDragStart={(e) => handleFileDragStart(e, file)}
                      onDragEnd={handleFileDragEnd}
                      className={cn(
                        "sm:hidden p-4 hover:bg-accent/50 transition-colors cursor-move",
                        selectedFiles.includes(file.id) && "bg-accent/30",
                        draggedFileId === file.id &&
                          "opacity-50 bg-destructive/30",
                      )}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <Checkbox
                          checked={selectedFiles.includes(file.id)}
                          onCheckedChange={() => handleFileSelect(file.id)}
                        />
                        <FileIcon className="h-5 w-5 text-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground font-medium truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{file.type}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="bg-card border-border"
                          >
                            <DropdownMenuItem className="text-foreground hover:bg-accent">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-foreground hover:bg-accent">
                              <Share className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs bg-card text-foreground">
                              {file.sharedBy.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground">{file.sharedBy.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-muted-foreground">{file.size}</span>
                          <span className="text-muted-foreground text-xs">{file.modified}</span>
                        </div>
                      </div>

                      {/* Mobile AI Analysis */}
                      <div className="flex items-center justify-between mt-3">
                        {!file.isAnalyzed && !file.isAnalyzing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => startAnalysis(file.id)}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Analyze
                          </Button>
                        )}

                        {file.isAnalyzing && (
                          <Badge
                            variant="outline"
                            className="text-yellow-400 border-yellow-400"
                          >
                            Analyzing...
                          </Badge>
                        )}

                        {file.isAnalyzed && (
                          <Badge className="bg-green-600 text-white">
                            <Check className="h-3 w-3 mr-1" />
                            Analyzed
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Analysis Results Expansion */}
                    {file.isAnalyzed && file.analysisResult && isExpanded && (
                      <div className="px-4 lg:px-6 pb-4 bg-accent/30 border-t border-border">
                        <div className="flex items-start space-x-4 pt-4">
                          <div className="flex-shrink-0">
                            <FileIcon className="h-12 w-12 text-foreground" />
                          </div>

                          <div className="flex-1">
                            <h3 className="text-foreground font-medium mb-2">
                              {file.analysisResult.fileType} Analysis
                            </h3>
                            <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                              {file.analysisResult.summary.map(
                                (point, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start space-x-2"
                                  >
                                    <span className="text-foreground mt-1">
                                      •
                                    </span>
                                    <span>{point}</span>
                                  </li>
                                ),
                              )}
                            </ul>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                              <Button
                                size="sm"
                                className="bg-foreground hover:bg-muted text-background"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Mark Reviewed
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-border text-muted-foreground hover:bg-accent"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download Insights
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground"
                                onClick={() => setExpandedFile(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
