import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, ExternalLink, Heart } from "lucide-react";
import { isSupabaseConnected } from "@/lib/supabase";

export const SupabaseConnection = () => {
  if (isSupabaseConnected()) {
    return null; // Connection is working, don't show this component
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="scrapbook-card max-w-lg">
        <CardHeader className="text-center">
          <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle className="font-handwriting text-3xl text-primary">
            Welcome to Your Memory Collection! 💕
          </CardTitle>
          <CardDescription className="text-base">
            To start saving your precious memories, we need to connect to your Supabase database.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Database className="h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="font-medium">Supabase Integration</p>
                <p className="text-sm text-muted-foreground">
                  Store photos, captions, and memories securely
                </p>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                Click the <strong className="text-primary">green Supabase button</strong> in the top right 
                corner of your Lovable interface to connect your database.
              </p>
              <p>
                Once connected, you'll be able to upload photos, add captions, 
                and create your beautiful digital scrapbook! ✨
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border/30">
            <p className="font-handwriting text-lg text-primary mb-3">
              Can't wait to see your memories! 💖
            </p>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => window.location.reload()}
            >
              <Database className="h-4 w-4" />
              Check Connection Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};