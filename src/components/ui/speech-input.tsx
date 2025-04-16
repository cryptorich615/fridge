import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";

interface SpeechInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
  onSubmit?: () => void;
}

export const SpeechInput = React.forwardRef<HTMLInputElement, SpeechInputProps>(
  ({ className, onValueChange, onSubmit, value, ...props }, ref) => {
    const [isListening, setIsListening] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    // Check if the browser supports the Web Speech API
    const speechRecognitionSupported = React.useMemo(() => {
      return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    }, []);

    const startListening = React.useCallback(() => {
      if (!speechRecognitionSupported) {
        setErrorMessage("Speech recognition is not supported in your browser.");
        return;
      }

      setErrorMessage(null);
      setIsListening(true);

      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onValueChange) {
          onValueChange(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setErrorMessage(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }, [speechRecognitionSupported, onValueChange]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSubmit) {
        onSubmit();
      }
    };

    return (
      <div className={cn("relative flex w-full items-center", className)}>
        <Input
          ref={ref}
          value={value}
          onKeyDown={handleKeyDown}
          className="pr-10"
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={startListening}
          disabled={isListening || !speechRecognitionSupported}
          className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
          title={speechRecognitionSupported ? "Click to speak" : "Speech recognition not supported"}
        >
          {isListening ? (
            <span className="h-4 w-4 animate-pulse rounded-full bg-red-500"></span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          )}
        </Button>
        {errorMessage && (
          <div className="absolute -bottom-6 left-0 text-xs text-red-500">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

SpeechInput.displayName = "SpeechInput";

// Add TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}