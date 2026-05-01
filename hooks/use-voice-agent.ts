"use client";

import { useRetellVoice } from "@/hooks/use-retell-voice";
import { useState, useEffect, useRef } from "react";

export interface VoiceAgentProps {
  title?: string;
  description?: string;
}

export interface ConversationMessage {
  role: string;
  content: string;
  timestamp: Date;
}

export function useVoiceAgent() {
  const {
    callStatus,
    transcripts,
    isLoading,
    startCall,
    stopCall,
    clearTranscripts,
  } = useRetellVoice();

  const [isHovered, setIsHovered] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showMicPermissionModal, setShowMicPermissionModal] = useState(false);
  const [microphoneError, setMicrophoneError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);

  // Conversation customization states
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("sm");
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const checkExistingPermission = async () => {
    try {
      const result = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      return result.state === "granted";
    } catch (error) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch {
        return false;
      }
    }
  };

  const requestMicrophoneAccess = async () => {
    try {
      setMicrophoneError(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      setShowMicPermissionModal(false);
      startCall();
    } catch (error: any) {
      console.error("Microphone access error:", error);

      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setMicrophoneError(
          "Microphone access denied. Please allow microphone access to use voice features."
        );
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        setMicrophoneError(
          "No microphone found. Please connect a microphone and try again."
        );
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        setMicrophoneError("Microphone is already in use by another application.");
      } else {
        setMicrophoneError(
          "Unable to access microphone. Please check your settings and try again."
        );
      }
    }
  };

  const handleStartCall = async () => {
    const hasPermission = await checkExistingPermission();
    if (hasPermission) {
      setMicrophoneError(null);
      startCall();
    } else {
      setShowMicPermissionModal(true);
    }
  };

  const handleClear = () => {
    clearTranscripts();
    setShowInstructions(true);
    setMicrophoneError(null);
    setConversationHistory([]);
    setShowCustomizePanel(false);
    setIsExpanded(false);
  };

  // Update conversation history when transcripts change
  useEffect(() => {
    if (transcripts.length > 0) {
      const latestTranscript = transcripts[transcripts.length - 1];
      const newMessages: ConversationMessage[] = [];

      if (Array.isArray(latestTranscript)) {
        latestTranscript.forEach((msg: any) => {
          if (msg.role && msg.content) {
            newMessages.push({ role: msg.role, content: msg.content, timestamp: new Date() });
          }
        });
      } else if (latestTranscript.transcript && Array.isArray(latestTranscript.transcript)) {
        latestTranscript.transcript.forEach((msg: any) => {
          if (msg.role && msg.content) {
            newMessages.push({ role: msg.role, content: msg.content, timestamp: new Date() });
          }
        });
      }

      if (newMessages.length > 0) {
        setConversationHistory(newMessages);
      }
    }
  }, [transcripts]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [conversationHistory]);

  return {
    callStatus,
    transcripts,
    isLoading,
    stopCall,
    isHovered,
    setIsHovered,
    showInstructions,
    showMicPermissionModal,
    setShowMicPermissionModal,
    microphoneError,
    scrollAreaRef,
    conversationHistory,
    showCustomizePanel,
    fontSize,
    showTimestamps,
    compactMode,
    isExpanded,
    handleStartCall,
    requestMicrophoneAccess,
    handleClear,
  };
}
