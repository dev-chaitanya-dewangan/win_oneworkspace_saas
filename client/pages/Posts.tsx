import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Calendar,
  TrendingUp,
} from "lucide-react";

const Posts = () => {
  const posts = [
    {
      id: 1,
      date: "Mar 15, 2024",
      platform: "Instagram",
      caption: "Introducing our new product line! ✨ #innovation #design",
      status: "published",
      engagement: "2.3k",
      reach: "12.5k",
    },
    {
      id: 2,
      date: "Mar 18, 2024",
      platform: "LinkedIn",
      caption: "5 tips for better team collaboration in remote work...",
      status: "scheduled",
      engagement: "-",
      reach: "-",
    },
    {
      id: 3,
      date: "Mar 20, 2024",
      platform: "Twitter",
      caption: "Just shipped a major update! Check out what's new 🚀",
      status: "draft",
      engagement: "-",
      reach: "-",
    },
    {
      id: 4,
      date: "Mar 12, 2024",
      platform: "Facebook",
      caption: "Behind the scenes: How we built our latest feature",
      status: "published",
      engagement: "1.8k",
      reach: "8.2k",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "scheduled":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return "bg-pink-500/20 text-pink-400";
      case "LinkedIn":
        return "bg-blue-600/20 text-blue-400";
      case "Twitter":
        return "bg-sky-500/20 text-sky-400";
      case "Facebook":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Scheduled Posts
            </h1>
            <p className="text-muted-foreground">
              Manage your content calendar and track post performance.
            </p>
          </div>
          <Button className="neon-gradient text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-muted-foreground">
                  Posts This Month
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">18.2k</div>
                <div className="text-sm text-muted-foreground">
                  Total Engagement
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">89k</div>
                <div className="text-sm text-muted-foreground">Total Reach</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">6</div>
                <div className="text-sm text-muted-foreground">Scheduled</div>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">All Posts</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search posts..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Caption</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Reach</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow
                  key={post.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{post.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getPlatformColor(post.platform)}
                    >
                      {post.platform}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {post.caption}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(post.status)}
                    >
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.engagement}</TableCell>
                  <TableCell>{post.reach}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Posts;
