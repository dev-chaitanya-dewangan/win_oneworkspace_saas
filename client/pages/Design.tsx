import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NeonCard } from "@/components/ui/neon-card";
import { Palette, Upload, Wand2, Download } from "lucide-react";

const Design = () => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedDesign, setGeneratedDesign] = React.useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedDesign(true);
    }, 3000);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Carousel Generator
          </h1>
          <p className="text-muted-foreground">
            Create stunning carousels with AI-powered design assistance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-6 space-y-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Wand2 className="h-5 w-5 mr-2 text-primary" />
              Design Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="logo">Brand Logo</Label>
                <div className="mt-1 flex items-center space-x-4">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="colors">Brand Colors</Label>
                <div className="mt-1 flex space-x-2">
                  <Input
                    id="colors"
                    type="color"
                    defaultValue="#7c3aed"
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="color"
                    defaultValue="#f59e0b"
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="color"
                    defaultValue="#06b6d4"
                    className="w-16 h-10 p-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Design Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your design requirements... e.g., 'Modern product showcase with minimalist style for social media'"
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div>
                <Label>Platforms</Label>
                <div className="mt-2 space-y-2">
                  {[
                    "Instagram Stories",
                    "LinkedIn Carousel",
                    "Twitter Thread",
                    "Facebook Post",
                  ].map((platform) => (
                    <label
                      key={platform}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        className="rounded"
                        defaultChecked
                      />
                      <span className="text-sm">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                className="w-full neon-gradient text-white"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Carousel"}
                <Palette className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Preview</h2>

            {isGenerating && (
              <NeonCard loading variant="outline" className="h-96" />
            )}

            {generatedDesign && !isGenerating && (
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Generated Carousel</h3>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((slide) => (
                    <div
                      key={slide}
                      className="aspect-square bg-gradient-to-br from-primary/20 to-neon-secondary/20 rounded-lg flex items-center justify-center border border-border/50"
                    >
                      <span className="text-sm text-muted-foreground">
                        Slide {slide}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p>✨ 4 slides generated with your brand colors and style</p>
                </div>
              </Card>
            )}

            {!isGenerating && !generatedDesign && (
              <Card className="p-8 text-center border-dashed border-2 border-border/50">
                <Palette className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  Configure your design settings and click "Generate Carousel"
                  to see the preview.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Design;
