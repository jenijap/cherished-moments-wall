import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MemoryPost } from "@/components/MemoryPost";
import { AddMemoryModal } from "@/components/AddMemoryModal";
import { DatabaseSetup } from "@/components/DatabaseSetup";
import { useToast } from "@/hooks/use-toast";
import { getMemories, createMemory, deleteMemory, uploadPhoto, type Memory } from "@/lib/supabase";
import { Heart, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-scrapbook.jpg";

const Index = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const data = await getMemories();
      setMemories(data);
    } catch (error) {
      console.error('Error loading memories:', error);
      toast({
        title: "Oops!",
        description: "Failed to load your memories. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMemory = async (photo: File, caption: string, location?: string) => {
    try {
      // Upload photo first
      const photoUrl = await uploadPhoto(photo);
      
      // Create memory record
      const newMemory = await createMemory(photoUrl, caption, location);
      
      // Add to local state
      setMemories(prev => [newMemory, ...prev]);
    } catch (error) {
      console.error('Error adding memory:', error);
      throw error; // Let the modal handle the error display
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      await deleteMemory(id);
      setMemories(prev => prev.filter(memory => memory.id !== id));
      
      toast({
        title: "Memory removed",
        description: "Your memory has been deleted from the collection.",
      });
    } catch (error) {
      console.error('Error deleting memory:', error);
      toast({
        title: "Error",
        description: "Failed to delete the memory. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen vintage-paper flex items-center justify-center">
        <div className="text-center space-y-4">
          <Heart className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="font-handwriting text-xl text-muted-foreground">
            Loading your precious memories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DatabaseSetup />
      <div className="min-h-screen vintage-paper">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Memory collection hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background/80" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 px-4">
          <div className="space-y-2">
            <h1 className="font-handwriting text-5xl md:text-7xl text-white drop-shadow-lg">
              Our Memory Collection
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-medium drop-shadow-md max-w-2xl">
              A beautiful digital scrapbook of our precious moments together 💕
            </p>
          </div>
          
          <AddMemoryModal onAddMemory={handleAddMemory} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {memories.length === 0 ? (
          <div className="text-center py-20 space-y-6">
            <Sparkles className="h-16 w-16 text-primary mx-auto opacity-50" />
            <div className="space-y-3">
              <h2 className="font-handwriting text-3xl text-muted-foreground">
                Your memory collection is waiting...
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start building your beautiful digital scrapbook by adding your first precious memory together.
              </p>
            </div>
            <AddMemoryModal onAddMemory={handleAddMemory} />
          </div>
        ) : (
          <>
            {/* Memories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-max">
              {memories.map((memory, index) => (
                <div 
                  key={memory.id}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <MemoryPost 
                    memory={memory} 
                    onDelete={handleDeleteMemory}
                  />
                </div>
              ))}
            </div>

            {/* Floating Add Button for mobile */}
            <div className="fixed bottom-6 right-6 md:hidden z-50">
              <AddMemoryModal onAddMemory={handleAddMemory} />
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 px-4 border-t border-border/30">
        <p className="font-handwriting text-lg text-muted-foreground">
          Made with love for our future family 💕
        </p>
      </footer>
      </div>
    </>
  );
};

export default Index;