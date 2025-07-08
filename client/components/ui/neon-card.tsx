import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface NeonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
  title?: string;
  details?: string[];
  children?: React.ReactNode;
  variant?: "default" | "solid" | "outline";
}

const NeonCard = React.forwardRef<HTMLDivElement, NeonCardProps>(
  (
    {
      className,
      loading = false,
      title,
      details = [],
      children,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-xl transition-all-smooth",
          variant === "default" && "neon-border bg-card/50 backdrop-blur-sm",
          variant === "solid" && "neon-gradient",
          variant === "outline" &&
            "border-2 border-neon-primary/30 bg-card/30 backdrop-blur-sm",
          loading && "animate-neon-pulse",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "relative z-10 p-6",
            variant === "solid" &&
              "bg-background/10 rounded-xl backdrop-blur-sm",
          )}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="h-5 w-5 animate-spin text-neon-primary" />
              <span className="text-sm text-muted-foreground">
                Processing...
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              {title && (
                <h3 className="text-lg font-semibold text-foreground">
                  {title}
                </h3>
              )}
              {details.length > 0 && (
                <div className="space-y-1">
                  {details.map((detail, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </div>
              )}
              {children}
            </div>
          )}
        </div>
      </div>
    );
  },
);

NeonCard.displayName = "NeonCard";

export { NeonCard };
