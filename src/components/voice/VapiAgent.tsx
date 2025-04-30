
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VapiAgentProps {
  assistantId?: string;
  enableDemo?: boolean;
  shareKey?: string;
  onClose?: () => void;
}

const VapiAgent: React.FC<VapiAgentProps> = ({ 
  assistantId = '9cc6edcc-8468-435b-b332-08b4051b7587',
  enableDemo = true,
  shareKey = 'c42849ce-d6c4-4dd3-ac8c-24482acfd70a',
  onClose
}) => {
  const [isActive, setIsActive] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Add VAPI script to the document
    const script = document.createElement('script');
    script.src = 'https://cdn.vapi.ai/vapi.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Vapi script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Vapi script');
      toast({
        title: "Voice Assistant Unavailable",
        description: "Could not load the voice assistant. Please try again later.",
        variant: "destructive",
      });
    };
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [toast]);

  const activateVapi = () => {
    setIsActive(true);
    
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.Vapi) {
        try {
          window.Vapi.start({
            assistantId,
            demo: enableDemo,
            shareKey,
            position: 'bottom-right',
            greeting: "Hello, welcome to Bharat Property Nexus! I'm your property search assistant. How can I help you today?",
            showTranscript: true,
            theme: {
              buttonBackgroundColor: '#0b3d91',
              buttonIconColor: '#ffffff',
              chatBackgroundColor: '#f8f9fa',
              chatTextColor: '#121212',
              voiceWaveColor: '#ff6f00'
            }
          });
          
          toast({
            title: "Voice Assistant Ready",
            description: "You can now speak with your property search assistant",
            variant: "default",
          });
        } catch (error) {
          console.error("Error starting Vapi:", error);
          toast({
            title: "Voice Assistant Error",
            description: "Failed to start the voice assistant",
            variant: "destructive",
          });
        }
      } else {
        console.error("Vapi not available");
        toast({
          title: "Voice Assistant Not Available",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      }
    }, 1000);
  };
  
  const deactivateVapi = () => {
    if (typeof window !== 'undefined' && window.Vapi) {
      try {
        window.Vapi.stop();
      } catch (error) {
        console.error("Error stopping Vapi:", error);
      }
    }
    
    setIsActive(false);
    if (onClose) onClose();
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {!isActive ? (
        <Button 
          className="rounded-full w-14 h-14 bg-gov-blue hover:bg-gov-blue-light shadow-lg flex items-center justify-center animate-fade-in"
          onClick={activateVapi}
        >
          <Mic className="w-6 h-6" />
        </Button>
      ) : (
        <Button 
          variant="outline"
          className="rounded-full px-4 py-2 border-gov-blue text-gov-blue hover:bg-gov-blue/10 shadow-lg flex items-center gap-2"
          onClick={deactivateVapi}
        >
          <MicOff className="w-4 h-4" />
          <span>End Voice Session</span>
        </Button>
      )}
    </div>
  );
};

// Add Vapi to the global Window interface
declare global {
  interface Window {
    Vapi?: {
      start: (config: any) => void;
      stop: () => void;
    };
  }
}

export default VapiAgent;
