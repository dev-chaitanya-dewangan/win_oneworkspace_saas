import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Users, Video } from "lucide-react";

const Calendar = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const events = [
    {
      id: 1,
      title: "Team Standup",
      time: "9:00 AM",
      type: "meeting",
      day: 15,
    },
    {
      id: 2,
      title: "Product Review",
      time: "2:00 PM",
      type: "review",
      day: 15,
    },
    {
      id: 3,
      title: "Design Sprint",
      time: "10:00 AM",
      type: "workshop",
      day: 18,
    },
    {
      id: 4,
      title: "Client Call",
      time: "3:30 PM",
      type: "call",
      day: 22,
    },
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = events.filter((event) => event.day === day);
      const isToday = day === currentDate.getDate();

      days.push(
        <div
          key={day}
          className={`p-2 border border-border/50 min-h-[80px] ${
            isToday ? "bg-primary/10 border-primary/30" : "hover:bg-muted/50"
          } cursor-pointer transition-colors`}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              isToday ? "text-primary" : ""
            }`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="text-xs px-1 py-0.5 bg-primary/20 text-primary rounded truncate"
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>,
      );
    }

    return days;
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground">
              Manage your schedule and book meetings with AI assistance.
            </p>
          </div>
          <Button className="neon-gradient text-white">
            <CalendarIcon className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-0 border border-border/50 rounded-lg overflow-hidden">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="p-3 text-center text-sm font-medium bg-muted/50 border-b border-border/50"
                  >
                    {day}
                  </div>
                ))}
                {renderCalendarDays()}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Today's Schedule
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Team Standup</div>
                    <div className="text-xs text-muted-foreground">
                      9:00 AM - 9:30 AM
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Product Review</div>
                    <div className="text-xs text-muted-foreground">
                      2:00 PM - 3:00 PM
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Video className="h-4 w-4 mr-2" />
                  Join Video Call
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  View Availability
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4">Meeting Types</h3>
              <div className="space-y-2">
                {[
                  {
                    name: "Quick Chat",
                    duration: "15 min",
                    color: "bg-green-500",
                  },
                  {
                    name: "Deep Dive",
                    duration: "60 min",
                    color: "bg-blue-500",
                  },
                  {
                    name: "Workshop",
                    duration: "120 min",
                    color: "bg-purple-500",
                  },
                ].map((type) => (
                  <div key={type.name} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${type.color}`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{type.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {type.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Calendar;
