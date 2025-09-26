import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Memory {
  id: string;
  photo_url: string;
  caption: string;
  created_at: string;
  location?: string;
}

interface MemoryPostProps {
  memory: Memory;
  onDelete: (id: string) => void;
}

export const MemoryPost = ({ memory, onDelete }: MemoryPostProps) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this precious memory?")) {
      onDelete(memory.id);
    }
  };

  return (
    <div 
      className="group relative animate-polaroid-drop hover:z-10 smooth-transition"
      style={{
        transform: `rotate(${Math.random() * 6 - 3}deg)`,
        transformOrigin: 'center bottom'
      }}
    >
      <Card className="scrapbook-card p-4 hover:scale-105 bounce-transition polaroid-shadow">
        {/* Decorative tape */}
        <div className="absolute -top-2 left-4 w-12 h-6 bg-vintage-tape opacity-80 transform -rotate-12 rounded-sm shadow-sm"></div>
        <div className="absolute -top-2 right-6 w-12 h-6 bg-vintage-tape opacity-80 transform rotate-12 rounded-sm shadow-sm"></div>
        
        {/* Photo */}
        <div className="relative mb-4">
          <img
            src={memory.photo_url}
            alt={memory.caption}
            className="w-full h-64 object-cover rounded-lg border-4 border-vintage-border shadow-md"
          />
          
          {/* Delete button */}
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 smooth-transition"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Caption */}
        <div className="space-y-3">
          <p className="font-handwriting text-lg text-foreground leading-relaxed">
            {memory.caption}
          </p>
          
          {/* Date and Location */}
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(memory.created_at), "MMM dd, yyyy")}</span>
            </div>
            {memory.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{memory.location}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};