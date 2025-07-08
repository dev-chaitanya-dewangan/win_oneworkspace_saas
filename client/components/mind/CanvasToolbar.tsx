import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CanvasViewport } from "./types";
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw,
  Search,
  Minimize2,
  Link,
} from "lucide-react";

interface CanvasToolbarProps {
  viewport: CanvasViewport;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onFitToScreen: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  viewport,
  onZoomIn,
  onZoomOut,
  onResetView,
  onFitToScreen,
}) => {
  const zoomPercentage = Math.round(viewport.zoom * 100);

  return (
    <TooltipProvider>
      <div className="absolute top-4 right-4 z-40 flex flex-col space-y-2">
        {/* Zoom Controls */}
        <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-600/50 rounded-lg p-2 shadow-lg">
          <div className="flex flex-col space-y-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onZoomIn}
                  className="h-8 w-8 p-0 hover:bg-gray-700/50 text-gray-300"
                  disabled={viewport.zoom >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Zoom In</p>
              </TooltipContent>
            </Tooltip>

            <Badge
              variant="outline"
              className="text-xs bg-gray-700/50 border-gray-600/50 text-gray-300 justify-center min-w-12"
            >
              {zoomPercentage}%
            </Badge>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onZoomOut}
                  className="h-8 w-8 p-0 hover:bg-gray-700/50 text-gray-300"
                  disabled={viewport.zoom <= 0.1}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Zoom Out</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-600/50 rounded-lg p-2 shadow-lg">
          <div className="flex flex-col space-y-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onFitToScreen}
                  className="h-8 w-8 p-0 hover:bg-gray-700/50 text-gray-300"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Fit to Screen</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onResetView}
                  className="h-8 w-8 p-0 hover:bg-gray-700/50 text-gray-300"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Reset View</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Additional Tools */}
        <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-600/50 rounded-lg p-2 shadow-lg">
          <div className="flex flex-col space-y-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => console.log("Search on canvas")}
                  className="h-8 w-8 p-0 hover:bg-gray-700/50 text-gray-300"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Search Canvas</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => console.log("Minimap toggle")}
                  className="h-8 w-8 p-0 hover:bg-gray-700/50 text-gray-300"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Toggle Minimap</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => console.log("Connection mode")}
                  className="h-8 w-8 p-0 hover:bg-gray-700/50 text-gray-300"
                >
                  <Link className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Connection Mode</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
