import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NeonCard } from "@/components/ui/neon-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Zap,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Calendar,
  Camera,
  Star,
} from "lucide-react";

const testimonials = [
  {
    quote:
      "OneWorkspace transformed how our team collaborates. The AI-powered workflow is incredible.",
    author: "Sarah Chen",
    role: "Product Manager at TechCorp",
    avatar: "SC",
  },
  {
    quote:
      "Finally, a workspace that actually understands what I need before I even ask for it.",
    author: "Marcus Rodriguez",
    role: "Creative Director",
    avatar: "MR",
  },
  {
    quote:
      "The seamless integration of all our tools in one place has boosted our productivity by 300%.",
    author: "Emily Johnson",
    role: "CEO at StartupXYZ",
    avatar: "EJ",
  },
];

const TypewriterText: React.FC<{ text: string; delay?: number }> = ({
  text,
  delay = 0,
}) => {
  const [displayText, setDisplayText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [currentIndex, text]);

  return (
    <span className="font-mono">
      {displayText}
      <span className="animate-blink">|</span>
    </span>
  );
};

const TestimonialCard: React.FC<{ testimonial: (typeof testimonials)[0] }> = ({
  testimonial,
}) => (
  <NeonCard variant="outline" className="p-6 space-y-4">
    <div className="flex items-center space-x-1 text-neon-primary">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
    </div>
    <blockquote className="text-sm leading-relaxed text-muted-foreground">
      "{testimonial.quote}"
    </blockquote>
    <div className="flex items-center space-x-3">
      <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
        {testimonial.avatar}
      </div>
      <div>
        <div className="font-semibold text-sm text-foreground">
          {testimonial.author}
        </div>
        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
      </div>
    </div>
  </NeonCard>
);

const WaitlistDialog: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [email, setEmail] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Here you would typically send the email to your backend
      console.log("Waitlist signup:", email);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>Join the Waitlist</span>
          </DialogTitle>
        </DialogHeader>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full neon-gradient text-white">
              Get Early Access
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-3 py-4">
            <div className="h-12 w-12 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold">You're on the list!</h3>
            <p className="text-sm text-muted-foreground">
              We'll notify you when OneWorkspace is ready for early access.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="relative container mx-auto px-4 py-24 sm:py-32">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 rounded-full border border-border/50 bg-muted/50 px-4 py-2 text-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Introducing OneWorkspace v0</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
              <span className="block text-foreground">The Future of</span>
              <span className="block bg-gradient-to-r from-primary via-neon-secondary to-neon-tertiary bg-clip-text text-transparent">
                AI Collaboration
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              <TypewriterText text="Transform your workflow with intelligent automation, seamless collaboration, and AI that understands your context." />
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <WaitlistDialog>
                <Button
                  size="lg"
                  className="neon-gradient text-white font-semibold px-8"
                >
                  Join Waitlist
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </WaitlistDialog>

              <Button size="lg" variant="outline" asChild>
                <Link to="/dashboard">
                  Try Demo
                  <Sparkles className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">Everything you need</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features designed to streamline your workflow and boost
              productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <NeonCard variant="outline" className="p-8 text-center space-y-4">
              <div className="h-12 w-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">AI Chat</h3>
              <p className="text-muted-foreground">
                Intelligent conversations that understand your context and help
                you get work done faster.
              </p>
            </NeonCard>

            <NeonCard variant="outline" className="p-8 text-center space-y-4">
              <div className="h-12 w-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Smart Calendar</h3>
              <p className="text-muted-foreground">
                Automated scheduling with AI-powered meeting insights and
                seamless booking flows.
              </p>
            </NeonCard>

            <NeonCard variant="outline" className="p-8 text-center space-y-4">
              <div className="h-12 w-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Content Creation</h3>
              <p className="text-muted-foreground">
                Generate stunning visuals and content with AI-powered design
                tools and templates.
              </p>
            </NeonCard>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">Loved by teams worldwide</h2>
            <p className="text-muted-foreground text-lg">
              See what industry leaders are saying about OneWorkspace.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 via-neon-secondary/10 to-neon-tertiary/10">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-bold">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of teams already using OneWorkspace to build the
            future.
          </p>
          <WaitlistDialog>
            <Button
              size="lg"
              className="neon-gradient text-white font-semibold px-8"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </WaitlistDialog>
        </div>
      </section>
    </div>
  );
}
