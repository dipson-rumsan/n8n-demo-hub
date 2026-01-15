"use client";

import { useCallback, useRef, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import { RETELL_CONFIG, URLS } from "@/constants";

export interface CallStatus {
  isConnected: boolean;
  isAgentSpeaking: boolean;
  error: string | null;
}

export interface TranscriptUpdate {
  transcript?: string;
  user_transcript?: string;
  agent_transcript?: string;
  role?: string;
  content?: string;
  [key: string]: any; // Allow for additional properties
}

export const useRetellVoice = () => {
  const [callStatus, setCallStatus] = useState<CallStatus>({
    isConnected: false,
    isAgentSpeaking: false,
    error: null,
  });
  const [transcripts, setTranscripts] = useState<TranscriptUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const retellWebClientRef = useRef<RetellWebClient | null>(null);

  const getAccessToken = async (metadata?: Record<string, any>, dynamicVariables?: Record<string, any>): Promise<string> => {
    try {
      const response = await fetch(URLS.RETELL_TOKEN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata,
          dynamicVariables,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = (errorData as { error?: string })?.error || "Failed to get access token";
        throw new Error(errorMessage);
      }

      const data = await response.json() as { access_token: string };
      return data.access_token;
    } catch (error) {
      throw new Error(`Failed to get access token: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const initializeClient = useCallback(() => {
    if (!retellWebClientRef.current) {
      retellWebClientRef.current = new RetellWebClient();
      
      // Set up event listeners
      retellWebClientRef.current.on("call_started", () => {
        console.log("Call started");
        setCallStatus(prev => ({
          ...prev,
          isConnected: true,
          error: null,
        }));
      });

      retellWebClientRef.current.on("call_ended", () => {
        console.log("Call ended");
        setCallStatus({
          isConnected: false,
          isAgentSpeaking: false,
          error: null,
        });
      });

      retellWebClientRef.current.on("agent_start_talking", () => {
        console.log("Agent speaking");
        setCallStatus(prev => ({
          ...prev,
          isAgentSpeaking: true,
        }));
      });

      retellWebClientRef.current.on("agent_stop_talking", () => {
        console.log("Agent stopped speaking");
        setCallStatus(prev => ({
          ...prev,
          isAgentSpeaking: false,
        }));
      });

      retellWebClientRef.current.on("update", (update: any) => {
        console.log("Transcript update:", update);
        
        // Handle different transcript formats
        const normalizedUpdate: TranscriptUpdate = {
          transcript: update.transcript || '',
          user_transcript: update.user_transcript,
          agent_transcript: update.agent_transcript,
          role: update.role,
          content: update.content,
        };
        
        setTranscripts(prev => [...prev, normalizedUpdate]);
      });

      retellWebClientRef.current.on("error", (error) => {
        console.error("Retell error:", error);
        const errorMessage = typeof error === 'string' ? error : 
                            (error?.message && typeof error.message === 'string') ? error.message :
                            "An unknown error occurred";
        setCallStatus(prev => ({
          ...prev,
          error: errorMessage,
        }));
        // Auto-stop call on error
        if (retellWebClientRef.current) {
          retellWebClientRef.current.stopCall();
        }
      });
    }
  }, []);

  const startCall = useCallback(async (options?: {
    metadata?: Record<string, any>;
    dynamicVariables?: Record<string, any>;
  }) => {
    try {
      setIsLoading(true);
      setCallStatus(prev => ({ ...prev, error: null }));
      
      initializeClient();
      
      if (!retellWebClientRef.current) {
        throw new Error("Failed to initialize Retell client");
      }

      const accessToken = await getAccessToken(
        options?.metadata,
        options?.dynamicVariables
      );

      await retellWebClientRef.current.startCall({
        accessToken: accessToken,
        sampleRate: RETELL_CONFIG.SAMPLE_RATE,
        emitRawAudioSamples: RETELL_CONFIG.EMIT_RAW_AUDIO_SAMPLES,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to start call";
      console.error("Start call error:", error);
      setCallStatus(prev => ({
        ...prev,
        error: errorMessage,
      }));
    } finally {
      setIsLoading(false);
    }
  }, [initializeClient]);

  const stopCall = useCallback(() => {
    if (retellWebClientRef.current) {
      retellWebClientRef.current.stopCall();
      console.log("Call stopped");
    }
  }, []);

  const clearTranscripts = useCallback(() => {
    setTranscripts([]);
  }, []);

  return {
    callStatus,
    transcripts,
    isLoading,
    startCall,
    stopCall,
    clearTranscripts,
  };
};