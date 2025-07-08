import * as React from "react";
import { cn } from "@/lib/utils";
import { User, CommandParsed } from "./types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Send,
  User as UserIcon,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";

interface MessagingCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (content: string, files?: File[]) => void;
  users: User[];
  onCreateUser: (userData: {
    name: string;
    email: string;
    phone?: string;
  }) => User;
}

export const MessagingCommandPalette: React.FC<
  MessagingCommandPaletteProps
> = ({ isOpen, onClose, onSendMessage, users, onCreateUser }) => {
  const [input, setInput] = React.useState("");
  const [parsedCommand, setParsedCommand] =
    React.useState<CommandParsed | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Parse command syntax: ~@ExistingName message~ or ~@NewUser(name: Name, email: x@x.com, phone: +1234567890) message~
  const parseCommand = (input: string): CommandParsed | null => {
    const commandRegex = /^~@(.+?)(?:\((.+?)\))?\s+(.+)~$/;
    const match = input.match(commandRegex);

    if (!match) return null;

    const [, mention, userDataStr, message] = match;

    // Check if it's an existing user
    const existingUser = users.find((user) =>
      user.name.toLowerCase().includes(mention.toLowerCase()),
    );

    if (existingUser) {
      return {
        mention,
        isNewUser: false,
        message,
        files: [],
        platform: existingUser.email
          ? "email"
          : existingUser.phone
            ? "sms"
            : "in-app",
      };
    }

    // Parse new user data
    if (userDataStr) {
      const nameMatch = userDataStr.match(/name:\s*([^,]+)/);
      const emailMatch = userDataStr.match(/email:\s*([^,]+)/);
      const phoneMatch = userDataStr.match(/phone:\s*([^,)]+)/);

      if (nameMatch && emailMatch) {
        const userData = {
          name: nameMatch[1].trim(),
          email: emailMatch[1].trim(),
          phone: phoneMatch ? phoneMatch[1].trim() : undefined,
        };

        return {
          mention,
          isNewUser: true,
          userData,
          message,
          files: [],
          platform: userData.email
            ? "email"
            : userData.phone
              ? "sms"
              : "in-app",
        };
      }
    }

    return null;
  };

  React.useEffect(() => {
    const parsed = parseCommand(input);
    setParsedCommand(parsed);
  }, [input, users]);

  React.useEffect(() => {
    if (!isOpen) {
      setInput("");
      setParsedCommand(null);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleExecuteCommand = async () => {
    if (!parsedCommand) return;

    setIsProcessing(true);

    try {
      let targetUser: User;

      if (parsedCommand.isNewUser && parsedCommand.userData) {
        // Create new user
        targetUser = onCreateUser(parsedCommand.userData);
        toast.success(`New contact created: ${targetUser.name}`);
      } else {
        // Find existing user
        targetUser = users.find((user) =>
          user.name.toLowerCase().includes(parsedCommand.mention.toLowerCase()),
        )!;
      }

      // Simulate API routing based on platform
      if (parsedCommand.platform === "email") {
        // Simulate Gmail API call
        console.log("Sending via Gmail API:", {
          to: targetUser.email,
          subject: `Message from OneWorkspace`,
          body: parsedCommand.message,
        });
        toast.success(`Email sent to ${targetUser.name}`);
      } else if (parsedCommand.platform === "sms") {
        // Simulate Twilio/WhatsApp API call
        console.log("Sending via SMS/WhatsApp API:", {
          to: targetUser.phone,
          message: parsedCommand.message,
        });
        toast.success(`SMS sent to ${targetUser.name}`);
      } else {
        // In-app message
        onSendMessage(parsedCommand.message);
        toast.success(`Message sent to ${targetUser.name}`);
      }

      onClose();
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsProcessing(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <Phone className="h-4 w-4" />;
      case "whatsapp":
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <UserIcon className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5 text-primary" />
            <span>Command Palette - Messaging</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Input */}
          <div className="space-y-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="~@ExistingName message~ or ~@NewUser(name: John, email: john@example.com) message~"
              className="bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500"
              autoFocus
            />
            <div className="text-xs text-gray-500">
              Use ~@mention syntax to send messages via email, SMS, or in-app
            </div>
          </div>

          {/* Parsed Command Preview */}
          {parsedCommand && (
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
              <h4 className="text-sm font-medium text-gray-200 mb-2">
                Command Preview:
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className="bg-gray-700 border-gray-600"
                  >
                    {parsedCommand.isNewUser
                      ? "New Contact"
                      : "Existing Contact"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "flex items-center space-x-1",
                      parsedCommand.platform === "email"
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                        : parsedCommand.platform === "sms"
                          ? "bg-green-500/10 border-green-500/30 text-green-400"
                          : "bg-gray-500/10 border-gray-500/30 text-gray-400",
                    )}
                  >
                    {getPlatformIcon(parsedCommand.platform)}
                    <span>{parsedCommand.platform.toUpperCase()}</span>
                  </Badge>
                </div>

                {parsedCommand.isNewUser && parsedCommand.userData && (
                  <div className="text-sm text-gray-300">
                    <div>
                      <strong>Name:</strong> {parsedCommand.userData.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {parsedCommand.userData.email}
                    </div>
                    {parsedCommand.userData.phone && (
                      <div>
                        <strong>Phone:</strong> {parsedCommand.userData.phone}
                      </div>
                    )}
                  </div>
                )}

                <div className="text-sm text-gray-300">
                  <strong>Message:</strong> {parsedCommand.message}
                </div>
              </div>
            </div>
          )}

          {/* Examples */}
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Examples:
            </h4>
            <div className="space-y-1 text-xs text-gray-400">
              <div>~@Pharah House Hey, can you review the latest designs?~</div>
              <div>
                ~@NewUser(name: John Doe, email: john@company.com, phone:
                +1234567890) Welcome to our platform!~
              </div>
              <div>~@Sarah Chen Let's schedule a meeting for tomorrow~</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {parsedCommand?.platform && (
                <span>
                  Will route via {parsedCommand.platform.toUpperCase()} API
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleExecuteCommand}
                disabled={!parsedCommand || isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessing ? "Sending..." : "Send Message"}
                <Send className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
