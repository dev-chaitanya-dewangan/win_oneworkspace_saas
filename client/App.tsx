import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Chat from "./pages/Chat";
import SocialMedia from "./pages/SocialMedia";
import Mind from "./pages/Mind";
import Database from "./pages/Database";
import DynamicIsland from "./pages/DynamicIsland";
import Design from "./pages/Design";
import Calendar from "./pages/Calendar";
import Posts from "./pages/Posts";
import Settings from "./pages/Settings";
import Editor from "./pages/Editor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/social-media" element={<SocialMedia />} />
          <Route path="/mind" element={<Mind />} />
          <Route path="/mind/database" element={<Database />} />
          <Route path="/dynamic-island" element={<DynamicIsland />} />
          <Route path="/design" element={<Design />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/settings" element={<Settings />} />

          {/* Placeholder routes for sidebar navigation */}
          <Route path="/search" element={<Search />} />
          <Route path="/capture" element={<Design />} />
          <Route path="/recent" element={<Posts />} />
          <Route path="/growth" element={<Dashboard />} />
          <Route path="/favorites" element={<Posts />} />
          <Route path="/documents" element={<Posts />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
