import * as React from "react";
import { User, CalendarEvent } from "./types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, Users } from "lucide-react";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleEvent: (eventData: Partial<CalendarEvent>) => void;
  selectedUser: User | null;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  onScheduleEvent,
  selectedUser,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date(),
  );
  const [eventTitle, setEventTitle] = React.useState("");
  const [eventTime, setEventTime] = React.useState("14:00");
  const [eventDuration, setEventDuration] = React.useState("60");
  const [eventDescription, setEventDescription] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && selectedUser) {
      setEventTitle(`Call with ${selectedUser.name}`);
      setEventDescription(
        `Scheduled meeting with ${selectedUser.name} via OneWorkspace`,
      );
    }
  }, [isOpen, selectedUser]);

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedDate(new Date());
      setEventTitle("");
      setEventTime("14:00");
      setEventDuration("60");
      setEventDescription("");
      setIsCreating(false);
    }
  }, [isOpen]);

  const handleScheduleEvent = async () => {
    if (!selectedDate || !eventTitle.trim() || !selectedUser) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCreating(true);

    try {
      const [hours, minutes] = eventTime.split(":").map(Number);
      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(hours, minutes, 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(
        endDateTime.getMinutes() + parseInt(eventDuration),
      );

      const eventData: Partial<CalendarEvent> = {
        summary: eventTitle,
        description: eventDescription,
        start: startDateTime,
        end: endDateTime,
        attendees: [selectedUser],
      };

      // Simulate Google Calendar API call
      console.log("Creating Google Calendar event:", {
        summary: eventData.summary,
        start: { dateTime: eventData.start?.toISOString() },
        end: { dateTime: eventData.end?.toISOString() },
        attendees: [{ email: selectedUser.email }],
        description: eventData.description,
      });

      onScheduleEvent(eventData);
      toast.success(`Event scheduled with ${selectedUser.name}`);
      onClose();
    } catch (error) {
      toast.error("Failed to create event");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <span>Schedule Event</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-300">
                Select Date
              </Label>
              <div className="mt-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border border-gray-600 bg-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventTitle" className="text-sm font-medium">
                Event Title
              </Label>
              <Input
                id="eventTitle"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Meeting title"
                className="mt-1 bg-gray-800 border-gray-600 text-gray-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="eventTime" className="text-sm font-medium">
                  Time
                </Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-600 text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="duration" className="text-sm font-medium">
                  Duration (min)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={eventDuration}
                  onChange={(e) => setEventDuration(e.target.value)}
                  min="15"
                  step="15"
                  className="mt-1 bg-gray-800 border-gray-600 text-gray-100"
                />
              </div>
            </div>

            {selectedUser && (
              <div className="p-3 bg-gray-800 rounded-lg border border-gray-600">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">
                    Attendees
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  <div>{selectedUser.name}</div>
                  <div className="text-gray-400">{selectedUser.email}</div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Add meeting notes or agenda..."
                rows={3}
                className="mt-1 bg-gray-800 border-gray-600 text-gray-100"
              />
            </div>

            {/* Preview */}
            {selectedDate && eventTitle && (
              <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                <div className="text-sm font-medium text-blue-400 mb-1">
                  Event Preview
                </div>
                <div className="text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-3 w-3" />
                    <span>
                      {selectedDate.toLocaleDateString()} at {eventTime}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{eventDuration} minutes</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-2 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleScheduleEvent}
                disabled={
                  !selectedDate ||
                  !eventTitle.trim() ||
                  !selectedUser ||
                  isCreating
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isCreating ? "Creating..." : "Schedule Event"}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <div className="text-xs text-gray-400">
            <strong>Google Calendar Integration:</strong> This event will be
            created in your Google Calendar and an invitation will be sent to{" "}
            {selectedUser?.email}.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
