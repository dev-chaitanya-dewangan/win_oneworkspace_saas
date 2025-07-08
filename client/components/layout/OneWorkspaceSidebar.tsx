import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Camera,
  MessageCircle,
  Calendar,
  Settings,
  Plus,
  Heart,
  FileText,
  ChevronDown,
  LogOut,
  Zap,
  Brain,
  Edit3,
  Smartphone,
} from "lucide-react";

const OneWorkspaceSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();

  const navigation = [
    {
      title: "Platform",
      items: [
        {
          title: "Search",
          icon: Search,
          href: "/search",
        },
        {
          title: "Capture",
          icon: Camera,
          href: "/capture",
        },

        {
          title: "Mind",
          icon: Brain,
          href: "/mind",
          subItems: [
            {
              title: "Database",
              href: "/mind/database",
            },
          ],
        },
        {
          title: "Calendar",
          icon: Calendar,
          href: "/calendar",
        },
        {
          title: "Editor",
          icon: Edit3,
          href: "/editor",
        },
        {
          title: "Settings",
          icon: Settings,
          href: "/settings",
        },
      ],
    },
    {
      title: "Projects",
      items: [
        {
          title: "Chat",
          icon: MessageCircle,
          href: "/chat",
          hasNewChat: true,
        },
        {
          title: "Social Media",
          icon: Smartphone,
          href: "/social-media",
        },
        {
          title: "Self-Growth",
          icon: Zap,
          href: "/growth",
        },
      ],
    },
    {
      title: "Library",
      items: [
        {
          title: "Favorites",
          icon: Heart,
          href: "/favorites",
        },
        {
          title: "Documents",
          icon: FileText,
          href: "/documents",
        },
      ],
    },
  ];

  return (
    <Sidebar variant="inset" className="border-r border-sidebar-border">
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <div className="flex items-center space-x-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg neon-gradient">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {state === "expanded" && (
            <div className="flex-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-auto p-0 font-semibold text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    <span>OneWorkspace</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem>
                    <Plus className="h-4 w-4 mr-2" />
                    New Workspace
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Workspace Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {navigation.map((section, index) => (
          <div key={section.title}>
            {index > 0 && <SidebarSeparator className="my-4" />}

            {state === "expanded" && (
              <div className="px-2 py-2">
                <h3 className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
            )}

            <SidebarMenu>
              {section.items.map((item) => (
                <div key={item.href}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        location.pathname === item.href ||
                        (item.title === "Mind" &&
                          location.pathname.startsWith("/mind"))
                      }
                      tooltip={state === "collapsed" ? item.title : undefined}
                    >
                      <Link
                        to={item.href}
                        className="flex items-center space-x-3"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Render subItems for Mind */}
                  {item.title === "Mind" &&
                    item.subItems &&
                    state === "expanded" && (
                      <SidebarMenuSub>
                        {item.subItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.href}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                to={subItem.href}
                                className={cn(
                                  "w-full justify-start h-7 text-xs font-normal text-sidebar-foreground/70 hover:text-sidebar-foreground",
                                  location.pathname === subItem.href &&
                                    "bg-sidebar-accent text-sidebar-accent-foreground",
                                )}
                              >
                                {subItem.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}

                  {/* Render New Chat for Chat items in Projects */}
                  {item.hasNewChat && state === "expanded" && (
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-7 text-xs font-normal text-sidebar-foreground/70 hover:text-sidebar-foreground"
                            onClick={() => {
                              // Navigate to chat and signal new chat creation
                              window.location.href = "/chat?new=true";
                            }}
                          >
                            <Plus className="h-3 w-3 mr-2" />
                            New Chat
                          </Button>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </div>
              ))}
            </SidebarMenu>

            {section.title === "Projects" && state === "expanded" && (
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-7 text-xs font-normal text-sidebar-foreground/70 hover:text-sidebar-foreground"
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      New Project
                    </Button>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/placeholder.svg" alt="User Avatar" />
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  {state === "expanded" && (
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Aaditya</span>
                      <span className="truncate text-xs text-sidebar-foreground/70">
                        aaditya@workspace.com
                      </span>
                    </div>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="end"
                side={state === "collapsed" ? "right" : "bottom"}
              >
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export { OneWorkspaceSidebar };
