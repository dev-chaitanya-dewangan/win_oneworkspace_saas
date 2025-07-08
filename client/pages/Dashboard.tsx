import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { NeonCard } from "@/components/ui/neon-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Clock,
  Calendar,
  FileText,
  Image,
  MessageCircle,
  TrendingUp,
  Users,
  Zap,
  MoreHorizontal,
  Play,
} from "lucide-react";

interface TaskItem {
  id: string;
  title: string;
  type: "design" | "content" | "meeting" | "analysis";
  status: "completed" | "in-progress" | "pending";
  timestamp: Date;
  details: string[];
}

const Dashboard = () => {
  const [aiFeed, setAiFeed] = React.useState<
    Array<{ title: string; details: string[] }>
  >([
    {
      title: "Created 5-slide product carousel",
      details: [
        "Scheduled for Instagram Stories at 3 PM",
        "Brand colors and fonts applied",
        "Engagement prediction: +25%",
      ],
    },
    {
      title: "Generated meeting summary",
      details: [
        "Extracted 12 action items",
        "Assigned to team members",
        "Follow-up scheduled for Friday",
      ],
    },
    {
      title: "Optimized content calendar",
      details: [
        "Analyzed 30 days of performance data",
        "Suggested optimal posting times",
        "Projected 40% increase in reach",
      ],
    },
  ]);

  const [taskCards] = React.useState<TaskItem[]>([
    {
      id: "1",
      title: "Q1 Marketing Campaign",
      type: "design",
      status: "in-progress",
      timestamp: new Date(),
      details: ["5 carousel designs", "Instagram & LinkedIn", "Due: March 15"],
    },
    {
      id: "2",
      title: "Team Standup Notes",
      type: "meeting",
      status: "completed",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      details: ["Action items extracted", "Next meeting: Tomorrow 10 AM"],
    },
    {
      id: "3",
      title: "Content Performance Analysis",
      type: "analysis",
      status: "pending",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      details: ["Last 30 days", "All platforms", "Optimization suggestions"],
    },
    {
      id: "4",
      title: "Product Launch Video",
      type: "content",
      status: "in-progress",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      details: ["Script generated", "B-roll suggestions", "Due: Next week"],
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "in-progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "overdue":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-secondary/20 text-muted-foreground border-border/30";
    }
  };

  const getTypeIcon = (type: TaskItem["type"]) => {
    switch (type) {
      case "design":
        return <Image className="h-4 w-4" />;
      case "content":
        return <FileText className="h-4 w-4" />;
      case "meeting":
        return <Users className="h-4 w-4" />;
      case "analysis":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const TaskDetailModal: React.FC<{
    task: TaskItem;
    children: React.ReactNode;
  }> = ({ task, children }) => (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            {getTypeIcon(task.type)}
            <span>{task.title}</span>
            <Badge variant="outline" className={getStatusColor(task.status)}>
              {task.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Created:</span>
              <p className="font-medium">
                {task.timestamp.toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span>
              <p className="font-medium capitalize">{task.type}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Details</h4>
            <ul className="space-y-1">
              {task.details.map((detail, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex items-center"
                >
                  <span className="w-1 h-1 bg-primary rounded-full mr-2" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button size="sm" variant="outline">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <MainLayout aiFeed={aiFeed} setAiFeed={setAiFeed}>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            AI Command Center
          </h1>
          <p className="text-muted-foreground">
            Monitor your AI-powered workflows and manage active projects.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* AI Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                Recent AI Activity
              </h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {aiFeed.map((item, index) => (
                <NeonCard
                  key={index}
                  title={item.title}
                  details={item.details}
                  variant="outline"
                  className="transition-all hover:scale-[1.02] cursor-pointer"
                />
              ))}

              {aiFeed.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    No AI activity yet. Try running a command from the toolbar
                    above!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Task Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Active Projects
              </h2>
              <Button variant="outline" size="sm">
                + New
              </Button>
            </div>

            <div className="space-y-4">
              {taskCards.map((task) => (
                <TaskDetailModal key={task.id} task={task}>
                  <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors border-border/50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(task.type)}
                          <span className="font-medium text-sm">
                            {task.title}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getStatusColor(task.status)}`}
                        >
                          {task.status}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        {task.details.slice(0, 2).map((detail, index) => (
                          <p
                            key={index}
                            className="text-xs text-muted-foreground"
                          >
                            {detail}
                          </p>
                        ))}
                      </div>

                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {task.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </Card>
                </TaskDetailModal>
              ))}
            </div>

            {/* Quick Stats */}
            <Card className="p-4 space-y-4">
              <h3 className="font-semibold text-sm">Today's Progress</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-xs text-muted-foreground">
                    Tasks Completed
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">8</div>
                  <div className="text-xs text-muted-foreground">
                    AI Commands
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
