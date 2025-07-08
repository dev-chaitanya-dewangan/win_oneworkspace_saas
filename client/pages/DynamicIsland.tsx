import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Mic,
  Command,
  Sparkles,
  Settings,
  Users,
  FileText,
  Calendar,
} from "lucide-react";

const DynamicIsland = () => {
  return (
    <MainLayout>
      {/* Background blobs are rendered by the DynamicIslandInput component */}
      <div className="min-h-screen bg-black text-white p-6 pt-24">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              Dynamic Island Experience
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Experience the future of workspace interaction with Apple-inspired
              Dynamic Island components featuring metallic depth, glassmorphism
              effects, and seamless voice integration.
            </p>

            <div className="flex items-center justify-center space-x-4 mt-8">
              <Badge
                variant="outline"
                className="metallic-base text-white border-white/20 px-4 py-2"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered
              </Badge>
              <Badge
                variant="outline"
                className="metallic-base text-white border-white/20 px-4 py-2"
              >
                <Mic className="h-4 w-4 mr-2" />
                Voice Enabled
              </Badge>
              <Badge
                variant="outline"
                className="metallic-base text-white border-white/20 px-4 py-2"
              >
                <Command className="h-4 w-4 mr-2" />
                Keyboard Shortcuts
              </Badge>
            </div>
          </div>

          {/* Command Examples */}
          <div className="metallic-base rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Zap className="h-6 w-6 mr-3 text-yellow-400" />
              Try These Commands
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  command: "/image",
                  description: "Generate AI images",
                  icon: "🎨",
                },
                {
                  command: "/weather",
                  description: "Get weather updates",
                  icon: "🌤️",
                },
                {
                  command: "create mind map",
                  description: "Start visual planning",
                  icon: "🧠",
                },
                {
                  command: "schedule meeting",
                  description: "Calendar integration",
                  icon: "📅",
                },
                {
                  command: "analyze document",
                  description: "AI file insights",
                  icon: "📄",
                },
                {
                  command: "team status",
                  description: "Check team activity",
                  icon: "👥",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="metallic-button p-4 rounded-xl text-center space-y-2 hover:scale-105 transition-transform"
                >
                  <div className="text-2xl">{item.icon}</div>
                  <div className="font-mono text-sm text-blue-300">
                    {item.command}
                  </div>
                  <div className="text-xs text-white/70">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Voice Features */}
            <Card className="metallic-base border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Mic className="h-5 w-5 mr-2 text-red-400" />
                  Voice Interaction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white/80">
                <p>
                  Real-time voice visualization with Web Audio API integration.
                  The Dynamic Island responds to your voice with animated bars
                  that reflect volume and frequency.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Real-time microphone visualization</li>
                  <li>• Automatic speech-to-text conversion</li>
                  <li>• Voice command recognition</li>
                  <li>• Privacy-focused local processing</li>
                </ul>
                <Button className="metallic-button glow-red w-full">
                  <Mic className="h-4 w-4 mr-2" />
                  Try Voice Commands
                </Button>
              </CardContent>
            </Card>

            {/* AI Features */}
            <Card className="metallic-base border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-400" />
                  AI Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white/80">
                <p>
                  Intelligent command processing with contextual responses.
                  Commands trigger specialized AI workflows with rich visual
                  feedback.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Smart command interpretation</li>
                  <li>• Dynamic response cards</li>
                  <li>• Context-aware suggestions</li>
                  <li>• Multi-modal content generation</li>
                </ul>
                <Button className="metallic-button glow-blue w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Explore AI Features
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Design Principles */}
          <div className="metallic-base rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Settings className="h-6 w-6 mr-3 text-gray-400" />
              Design System
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Metallic Depth",
                  description:
                    "Multi-layered gradients creating realistic surfaces",
                  color: "from-gray-600 to-gray-800",
                },
                {
                  title: "Glassmorphism",
                  description: "Backdrop blur with translucent overlays",
                  color: "from-blue-600/30 to-purple-600/30",
                },
                {
                  title: "Subtle Reflections",
                  description: "Inset highlights simulating light",
                  color: "from-white/10 to-white/5",
                },
                {
                  title: "Smooth Animations",
                  description: "Cubic-bezier transitions for premium feel",
                  color: "from-green-600/30 to-teal-600/30",
                },
              ].map((principle, index) => (
                <div
                  key={index}
                  className="text-center space-y-3 p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm"
                >
                  <div
                    className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${principle.color} border border-white/20`}
                  ></div>
                  <h3 className="font-semibold text-white">
                    {principle.title}
                  </h3>
                  <p className="text-sm text-white/70">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Examples */}
          <div className="metallic-base rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Users className="h-6 w-6 mr-3 text-purple-400" />
              Workspace Integration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: FileText,
                  title: "Mind Mapping",
                  description: "Visual idea organization with AI assistance",
                  path: "/mind",
                },
                {
                  icon: Users,
                  title: "Team Chat",
                  description: "Collaborative communication with context",
                  path: "/chat",
                },
                {
                  icon: Calendar,
                  title: "Smart Calendar",
                  description: "Intelligent scheduling and planning",
                  path: "/calendar",
                },
              ].map((integration, index) => (
                <div
                  key={index}
                  className="metallic-button p-6 rounded-xl text-center space-y-4 hover:scale-105 transition-all duration-300 group"
                >
                  <integration.icon className="h-12 w-12 mx-auto text-white group-hover:text-blue-400 transition-colors" />
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      {integration.title}
                    </h3>
                    <p className="text-sm text-white/70">
                      {integration.description}
                    </p>
                  </div>
                  <Button
                    className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                    variant="outline"
                  >
                    Explore
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-white">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Experience the future of workspace interaction. The Dynamic Island
              is always available at the top of your screen - just start typing
              or use voice commands to begin.
            </p>
            <div className="flex justify-center space-x-4">
              <Button className="metallic-button glow-blue px-8 py-3 text-lg">
                <Sparkles className="h-5 w-5 mr-2" />
                Start Creating
              </Button>
              <Button
                variant="outline"
                className="metallic-button px-8 py-3 text-lg text-white border-white/20"
              >
                <Command className="h-5 w-5 mr-2" />
                Learn Shortcuts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DynamicIsland;
