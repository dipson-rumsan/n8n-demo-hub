"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Mic, MessageCircle } from "lucide-react";
import { VOICE_AGENT_CONFIG } from "@/constants";

interface VoiceAgentProps {
  title?: string;
  description?: string;
}

interface Transcript {
  role: "user" | "agent";
  content: string;
  timestamp: Date;
}

const VOICE_AGENT_WIDGET_ID = "voice-widget";

export function VoiceAgent({
  title = "Voice Agent",
  description = "Start a voice conversation with our Rumsan AI agent",
}: VoiceAgentProps) {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [isActive, setIsActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const userTranscriptRef = useRef<string>("");
  const lastUserMessageTime = useRef<number>(0);

  useEffect(() => {
    if (document.getElementById(VOICE_AGENT_WIDGET_ID)) {
      return;
    }

    // Intercept WebSocket to capture voice agent messages
    const OriginalWebSocket = window.WebSocket;
    let voiceAgentWebSocket: WebSocket | null = null;

    (window as any).WebSocket = function(url: string, protocols?: string | string[]) {
      const ws = new OriginalWebSocket(url, protocols);
      
      // Check if this is the voice agent WebSocket
      if (url.includes('dograh') || url.includes('api.dograh.com')) {
        voiceAgentWebSocket = ws;
        
        const originalOnMessage = ws.onmessage;
        ws.addEventListener('message', (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Handle user transcription (accumulate as user speaks)
            if (data.type === 'rtf-user-transcription' && data.payload?.text) {
              const now = Date.now();
              const newText = data.payload.text.trim();
              
              setTranscripts(prev => {
                const lastTranscript = prev[prev.length - 1];
                
                // Always update if last message is from user (ongoing speech)
                if (lastTranscript && lastTranscript.role === "user") {
                  // Check if new text contains or extends the old text
                  const prevText = lastTranscript.content.trim();
                  
                  // If new text is longer or different, it's an update
                  if (newText.length >= prevText.length || 
                      newText.includes(prevText) || 
                      prevText.includes(newText)) {
                    // Update existing message
                    lastUserMessageTime.current = now;
                    userTranscriptRef.current = newText;
                    
                    return [
                      ...prev.slice(0, -1),
                      {
                        ...lastTranscript,
                        content: newText,
                        timestamp: new Date(),
                      },
                    ];
                  } else if (now - lastUserMessageTime.current > 3000) {
                    // Long gap and different content - new utterance
                    lastUserMessageTime.current = now;
                    userTranscriptRef.current = newText;
                    
                    return [
                      ...prev,
                      {
                        role: "user",
                        content: newText,
                        timestamp: new Date(),
                      },
                    ];
                  } else {
                    // Short gap with different content - concatenate
                    const combined = prevText + ' ' + newText;
                    lastUserMessageTime.current = now;
                    userTranscriptRef.current = combined;
                    
                    return [
                      ...prev.slice(0, -1),
                      {
                        ...lastTranscript,
                        content: combined,
                        timestamp: new Date(),
                      },
                    ];
                  }
                } else {
                  // No previous user message or last was agent - start new
                  lastUserMessageTime.current = now;
                  userTranscriptRef.current = newText;
                  
                  return [
                    ...prev,
                    {
                      role: "user",
                      content: newText,
                      timestamp: new Date(),
                    },
                  ];
                }
              });
            }
            
            // Handle bot/agent text (streaming word by word)
            if (data.type === 'rtf-bot-text' && data.payload?.text) {
              // Agent speaking means user is done, finalize their message
              if (userTranscriptRef.current) {
                userTranscriptRef.current = "";
              }
              
              setTranscripts(prev => {
                const lastTranscript = prev[prev.length - 1];
                const now = new Date();
                
                // If last message is from agent within last 5 seconds, append to it
                if (lastTranscript && 
                    lastTranscript.role === "agent" && 
                    (now.getTime() - lastTranscript.timestamp.getTime()) < 5000) {
                  const currentContent = lastTranscript.content;
                  const newWord = data.payload.text;
                  const needsSpace = currentContent.length > 0 && 
                                    !currentContent.endsWith(' ') && 
                                    !newWord.startsWith(' ');
                  
                  return [
                    ...prev.slice(0, -1),
                    {
                      ...lastTranscript,
                      content: currentContent + (needsSpace ? ' ' : '') + newWord,
                      timestamp: now,
                    },
                  ];
                } else {
                  // Start new agent message
                  return [
                    ...prev,
                    {
                      role: "agent",
                      content: data.payload.text,
                      timestamp: now,
                    },
                  ];
                }
              });
            }
            
            // Handle connection status
            if (data.type === 'session_started' || data.type === 'call_started') {
              setIsActive(true);
            } else if (data.type === 'session_ended' || data.type === 'call_ended') {
              setIsActive(false);
              // Finalize any pending user message
              if (userTranscriptRef.current) {
                userTranscriptRef.current = "";
                lastUserMessageTime.current = 0;
              }
            }
          } catch (error) {
            // Not JSON or parsing error, ignore
          }
        });
      }
      
      return ws;
    };

    const firstScript = document.getElementsByTagName("script")[0];
    const script = document.createElement("script");
    script.id = VOICE_AGENT_WIDGET_ID;
    script.src = VOICE_AGENT_CONFIG.WIDGET_URL;
    script.async = true;

    if (firstScript?.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.body.appendChild(script);
    }

    // Restore original WebSocket on cleanup
    return () => {
      (window as any).WebSocket = OriginalWebSocket;
    };
  }, []);

  // Auto-scroll to bottom when new transcripts arrive
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [transcripts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Widget Section */}
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            {isActive && (
              <Badge variant="default" className="gap-1">
                <Mic className="h-3 w-3" />
                Active
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <div id="dograh-inline-container" className="w-full min-h-100"></div>
        </CardContent>
      </Card>

      {/* Transcription Section */}
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Live Transcription
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-5rem)]">
          <ScrollArea className="h-full pr-4" ref={scrollRef}>
            {transcripts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Bot className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm">
                  Start a conversation to see live transcription
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {transcripts.map((transcript, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      transcript.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        transcript.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-purple-500 text-white"
                      }`}
                    >
                      {transcript.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={`flex-1 max-w-[85%] ${
                        transcript.role === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      <div
                        className={`inline-block p-3 rounded-2xl shadow-sm ${
                          transcript.role === "user"
                            ? "bg-blue-500 text-white rounded-br-md"
                            : "bg-gray-100 text-gray-800 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {transcript.content}
                        </p>
                      </div>
                      <p
                        className={`text-xs text-gray-500 mt-1 ${
                          transcript.role === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {transcript.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    addEventListener(
      type: "voice-agent-event",
      listener: (event: CustomEvent) => void
    ): void;
    removeEventListener(
      type: "voice-agent-event",
      listener: (event: CustomEvent) => void
    ): void;
  }
}
