import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { OneWorkspaceSidebar } from "./OneWorkspaceSidebar";
import { Toolbar } from "./Toolbar";
import { SearchCommandDrawer } from "@/components/search/SearchCommandDrawer";

interface MainLayoutProps {
  children: React.ReactNode;
  aiFeed?: Array<{ title: string; details: string[] }>;
  setAiFeed?: React.Dispatch<
    React.SetStateAction<Array<{ title: string; details: string[] }>>
  >;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  aiFeed,
  setAiFeed,
}) => {
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = React.useState(false);

  // Global keyboard shortcut for search (Cmd/Ctrl + K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchDrawerOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchDrawerOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCommand = (command: string) => {
    // Command handling logic can be customized per page
    console.log("Command received:", command);
  };

  return (
    <SidebarProvider>
      <OneWorkspaceSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col overflow-hidden relative">
          {/* Dynamic Island is now rendered by Toolbar and positioned absolutely */}
          <Toolbar
            onCommand={handleCommand}
            aiFeed={aiFeed}
            setAiFeed={setAiFeed}
            onOpenSearch={() => setIsSearchDrawerOpen(true)}
          />
          <main className="flex-1 overflow-y-auto pt-4">{children}</main>
        </div>
      </SidebarInset>

      {/* Global Search Command Drawer */}
      <SearchCommandDrawer
        isOpen={isSearchDrawerOpen}
        onClose={() => setIsSearchDrawerOpen(false)}
      />
    </SidebarProvider>
  );
};

export { MainLayout };
