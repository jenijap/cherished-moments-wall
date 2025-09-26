import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Database, Image } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const DatabaseSetup = () => {
  const [setupStatus, setSetupStatus] = useState<{
    table: boolean;
    storage: boolean;
    checking: boolean;
  }>({
    table: false,
    storage: false,
    checking: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      // Check if memories table exists
      const { data: tableData, error: tableError } = await supabase
        .from('memories')
        .select('id')
        .limit(1);

      // Check if storage bucket exists
      const { data: bucketData, error: bucketError } = await supabase.storage
        .from('memory-photos')
        .list('', { limit: 1 });

      setSetupStatus({
        table: !tableError,
        storage: !bucketError,
        checking: false,
      });
    } catch (error) {
      setSetupStatus({
        table: false,
        storage: false,
        checking: false,
      });
    }
  };

  const createTable = async () => {
    try {
      const { error } = await supabase.rpc('create_memories_table');
      if (!error) {
        setSetupStatus(prev => ({ ...prev, table: true }));
        toast({
          title: "Table created!",
          description: "Memories table has been set up successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Setup required",
        description: "Please create the memories table in your Supabase dashboard.",
        variant: "destructive",
      });
    }
  };

  const createBucket = async () => {
    try {
      const { error } = await supabase.storage.createBucket('memory-photos', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (!error) {
        setSetupStatus(prev => ({ ...prev, storage: true }));
        toast({
          title: "Storage created!",
          description: "Photo storage bucket has been set up successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Setup required",
        description: "Please create the memory-photos storage bucket in your Supabase dashboard.",
        variant: "destructive",
      });
    }
  };

  if (setupStatus.checking) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="scrapbook-card max-w-md">
          <CardContent className="pt-6 text-center">
            <Database className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="font-handwriting text-lg">Checking your setup...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (setupStatus.table && setupStatus.storage) {
    return null; // Everything is set up
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="scrapbook-card max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-handwriting text-2xl text-primary">
            Almost Ready! 💕
          </CardTitle>
          <CardDescription>
            We need to set up your database to store your precious memories.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Table Setup */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5" />
              <div>
                <p className="font-medium">Memories Table</p>
                <p className="text-sm text-muted-foreground">Store your memory data</p>
              </div>
            </div>
            {setupStatus.table ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Button onClick={createTable} size="sm" variant="romantic">
                Create
              </Button>
            )}
          </div>

          {/* Storage Setup */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Image className="h-5 w-5" />
              <div>
                <p className="font-medium">Photo Storage</p>
                <p className="text-sm text-muted-foreground">Store your photos securely</p>
              </div>
            </div>
            {setupStatus.storage ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Button onClick={createBucket} size="sm" variant="romantic">
                Create
              </Button>
            )}
          </div>

          {/* Manual Setup Instructions */}
          {(!setupStatus.table || !setupStatus.storage) && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="text-sm space-y-2">
                  <p className="font-medium">Need to set up manually?</p>
                  {!setupStatus.table && (
                    <div>
                      <p>Create a table called <code className="bg-background px-1 rounded">memories</code> with:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                        <li>id (uuid, primary key)</li>
                        <li>photo_url (text)</li>
                        <li>caption (text)</li>
                        <li>location (text, nullable)</li>
                        <li>created_at (timestamp)</li>
                        <li>updated_at (timestamp)</li>
                      </ul>
                    </div>
                  )}
                  {!setupStatus.storage && (
                    <p>Create a public storage bucket called <code className="bg-background px-1 rounded">memory-photos</code></p>
                  )}
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={checkSetup} 
            className="w-full" 
            variant="outline"
          >
            Check Setup Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};