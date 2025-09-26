import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Upload, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddMemoryModalProps {
  onAddMemory: (photo: File, caption: string, location?: string) => Promise<void>;
}

export const AddMemoryModal = ({ onAddMemory }: AddMemoryModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please choose a photo smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setPhoto(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!photo || !caption.trim()) {
      toast({
        title: "Missing information",
        description: "Please add both a photo and caption for your memory",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onAddMemory(photo, caption.trim(), location.trim() || undefined);
      
      // Reset form
      setPhoto(null);
      setCaption("");
      setLocation("");
      setPreviewUrl(null);
      setIsOpen(false);
      
      toast({
        title: "Memory saved! 💕",
        description: "Your beautiful moment has been added to your collection",
      });
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Something went wrong saving your memory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="romantic-gradient text-primary-foreground font-medium shadow-lg hover:shadow-xl smooth-transition hover:scale-105"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Memory
          <Heart className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="scrapbook-card max-w-md">
        <DialogHeader>
          <DialogTitle className="font-handwriting text-2xl text-center text-primary">
            Capture a New Memory 💕
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label className="font-medium">Photo</Label>
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <Label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 smooth-transition"
              >
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload photo</span>
                  </div>
                )}
              </Label>
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption" className="font-medium">Caption</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What made this moment special? 💖"
              className="resize-none font-handwriting text-base"
              rows={3}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="font-medium">Location (optional)</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where was this taken?"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full romantic-gradient text-primary-foreground font-medium hover:scale-105 smooth-transition shadow-lg hover:shadow-xl"
          >
            {isLoading ? "Saving your memory..." : "Save Memory 💕"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};