import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search as SearchIcon,
  Command,
  Filter,
  FileText,
  Users,
  Calendar,
  Zap,
} from "lucide-react";

const Search = () => {
  return (
    <MainLayout>
      <div className="h-full w-full bg-primary p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">
              Global Search & Commands
            </h1>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Search across your entire workspace, find people, files, and
              execute quick actions with our powerful command interface.
            </p>

            <div className="flex items-center justify-center space-x-4 mt-6">
              <Badge variant="outline" className="text-sm px-3 py-1">
                <Command className="h-3 w-3 mr-1" />
                Press Cmd+K to open
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                <SearchIcon className="h-3 w-3 mr-1" />
                Type to search
              </Badge>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-blur border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 accent-green" />
                  People Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary text-sm mb-3">
                  Find team members, collaborators, and contacts across your
                  workspace.
                </p>
                <ul className="text-xs text-secondary space-y-1">
                  <li>• Search by name or email</li>
                  <li>• View recent activity</li>
                  <li>• Contact directly</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-blur border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 accent-yellow" />
                  File Discovery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary text-sm mb-3">
                  Locate documents, images, and files with smart search.
                </p>
                <ul className="text-xs text-secondary space-y-1">
                  <li>• File type filtering</li>
                  <li>• Content mentions</li>
                  <li>• Quick actions</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-blur border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Zap className="h-5 w-5 mr-2 accent-pink" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary text-sm mb-3">
                  Execute common tasks instantly without navigation.
                </p>
                <ul className="text-xs text-secondary space-y-1">
                  <li>• Create tasks & notes</li>
                  <li>• Add team members</li>
                  <li>• Schedule meetings</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-blur border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 accent-orange" />
                  Collections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary text-sm mb-3">
                  Browse organized content groups and resources.
                </p>
                <ul className="text-xs text-secondary space-y-1">
                  <li>• Paid & free content</li>
                  <li>• Category filtering</li>
                  <li>• Quick access</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-blur border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-secondary" />
                  Smart Filtering
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary text-sm mb-3">
                  Advanced filters to narrow down your search results.
                </p>
                <ul className="text-xs text-secondary space-y-1">
                  <li>• Date ranges</li>
                  <li>• Content types</li>
                  <li>• User activity</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-blur border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <SearchIcon className="h-5 w-5 mr-2 highlight" />
                  Global Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary text-sm mb-3">
                  Access search from anywhere in the application.
                </p>
                <ul className="text-xs text-secondary space-y-1">
                  <li>• Keyboard shortcuts</li>
                  <li>• Mobile responsive</li>
                  <li>• Contextual results</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4 py-8">
            <h2 className="text-2xl font-semibold text-primary">Try it out!</h2>
            <p className="text-secondary">
              Press{" "}
              <kbd className="px-2 py-1 bg-secondary rounded text-primary font-mono text-sm">
                Cmd+K
              </kbd>{" "}
              to open the search interface and explore all the features.
            </p>

            <div className="flex justify-center space-x-4 mt-6">
              <Button
                variant="default"
                onClick={() => {
                  // Simulate keyboard shortcut
                  document.dispatchEvent(
                    new KeyboardEvent("keydown", {
                      key: "k",
                      metaKey: true,
                      bubbles: true,
                    }),
                  );
                }}
                className="bg-primary hover:bg-primary/90"
              >
                <Command className="h-4 w-4 mr-2" />
                Open Search
              </Button>

              <Button variant="outline" className="border-muted">
                <FileText className="h-4 w-4 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Search;
