"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mic,
  Phone,
  PhoneOff,
  Trash2,
  Bot,
  MessageCircle,
  User,
  Volume2,
  Brain,
  Sparkles,
} from "lucide-react";
import { useRetellVoice, TranscriptUpdate } from "@/hooks/use-retell-voice";
import { useState, useEffect, useRef } from "react";

interface VoiceAgentProps {
  title?: string;
  description?: string;
}

export function VoiceAgent({
  title = "Voice Agent",
  description = "Start a voice conversation with our Rumsan AI agent",
}: VoiceAgentProps) {
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
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: string; content: string; timestamp: Date }>
  >([]);

  // Conversation customization states
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("sm");
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if microphone permission is already granted
  const checkExistingPermission = async () => {
    try {
      const result = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      return result.state === "granted";
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
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

      // Stop the stream immediately since we just want to check permissions
      stream.getTracks().forEach((track) => track.stop());

      // Close modal and start call
      setShowMicPermissionModal(false);
      startCall();
    } catch (error: any) {
      console.error("Microphone access error:", error);

      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        setMicrophoneError(
          "Microphone access denied. Please allow microphone access to use voice features."
        );
      } else if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError"
      ) {
        setMicrophoneError(
          "No microphone found. Please connect a microphone and try again."
        );
      } else if (
        error.name === "NotReadableError" ||
        error.name === "TrackStartError"
      ) {
        setMicrophoneError(
          "Microphone is already in use by another application."
        );
      } else {
        setMicrophoneError(
          "Unable to access microphone. Please check your settings and try again."
        );
      }
    }
  };

  const handleStartCall = async () => {
    // Check if permission is already granted
    const hasPermission = await checkExistingPermission();

    if (hasPermission) {
      // Permission already granted, start call directly
      setMicrophoneError(null);
      startCall();
    } else {
      // Need to request permission, show modal
      setShowMicPermissionModal(true);
    }
  };

  // Update conversation history when transcripts change
  useEffect(() => {
    if (transcripts.length > 0) {
      const latestTranscript = transcripts[transcripts.length - 1];

      // Extract messages from latest transcript
      const newMessages: Array<{
        role: string;
        content: string;
        timestamp: Date;
      }> = [];

      if (Array.isArray(latestTranscript)) {
        latestTranscript.forEach((msg: any) => {
          if (msg.role && msg.content) {
            newMessages.push({
              role: msg.role,
              content: msg.content,
              timestamp: new Date(),
            });
          }
        });
      } else if (
        latestTranscript.transcript &&
        Array.isArray(latestTranscript.transcript)
      ) {
        latestTranscript.transcript.forEach((msg: any) => {
          if (msg.role && msg.content) {
            newMessages.push({
              role: msg.role,
              content: msg.content,
              timestamp: new Date(),
            });
          }
        });
      }

      // Update conversation history if we have new messages
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

  const formatTranscript = (transcript: TranscriptUpdate, index: number) => {
    // Safely convert any value to string
    const safeString = (value: any): string => {
      if (typeof value === "string") return value;
      if (value === null || value === undefined) return "";
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    };

    // Handle array of messages (like the update format you showed)
    if (Array.isArray(transcript)) {
      return (
        <div key={index} className="space-y-4">
          {transcript.map((msg: any, msgIndex: number) => (
            <div
              key={msgIndex}
              className={`flex gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-purple-500 text-white"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div
                className={`flex-1 max-w-[85%] ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-800 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed">
                    {safeString(msg.content)}
                  </p>
                </div>
                <p
                  className={`text-xs text-gray-500 mt-1 ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {msg.role === "user" ? "You" : "Rumsan AI"}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Handle generic transcript format that contains an array
    if (transcript.transcript && Array.isArray(transcript.transcript)) {
      return (
        <div key={index} className="space-y-4">
          {transcript.transcript.map((msg: any, msgIndex: number) => (
            <div
              key={msgIndex}
              className={`flex gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-linear-to-r from-purple-500 to-indigo-600 text-white"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <>
                    <Bot className="h-4 w-4" />
                    <Sparkles className="h-2 w-2 absolute -top-0.5 -right-0.5 text-yellow-300" />
                  </>
                )}
              </div>
              <div
                className={`flex-1 max-w-[85%] ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-800 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed">
                    {safeString(msg.content)}
                  </p>
                </div>
                <p
                  className={`text-xs text-gray-500 mt-1 ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {msg.role === "user" ? "You" : "Rumsan AI"}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Handle role/content format (common in chat APIs)
    if (transcript.role && transcript.content) {
      return (
        <div
          key={index}
          className={`flex gap-3 ${
            transcript.role === "user" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <div
            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative ${
              transcript.role === "user"
                ? "bg-blue-500 text-white"
                : "bg-linear-to-r from-purple-500 to-indigo-600 text-white"
            }`}
          >
            {transcript.role === "user" ? (
              <User className="h-4 w-4" />
            ) : (
              <>
                <Bot className="h-4 w-4" />
                <Sparkles className="h-2 w-2 absolute -top-0.5 -right-0.5 text-yellow-300" />
              </>
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
                {safeString(transcript.content)}
              </p>
            </div>
            <p
              className={`text-xs text-gray-500 mt-1 ${
                transcript.role === "user" ? "text-right" : "text-left"
              }`}
            >
              {transcript.role === "user" ? "You" : "Rumsan AI"}
            </p>
          </div>
        </div>
      );
    }

    // Handle user_transcript format
    if (transcript.user_transcript) {
      return (
        <div key={index} className="flex gap-3 flex-row-reverse">
          <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 max-w-[85%] text-right">
            <div className="inline-block p-3 rounded-2xl rounded-br-md bg-blue-500 text-white shadow-sm">
              <p className="text-sm leading-relaxed">
                {safeString(transcript.user_transcript)}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">You</p>
          </div>
        </div>
      );
    }

    // Handle agent_transcript format
    if (transcript.agent_transcript) {
      return (
        <div key={index} className="flex gap-3">
          <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-r from-purple-500 to-indigo-600 text-white flex items-center justify-center relative">
            <Bot className="h-4 w-4" />
            <Sparkles className="h-2 w-2 absolute -top-0.5 -right-0.5 text-yellow-300" />
          </div>
          <div className="flex-1 max-w-[85%]">
            <div className="inline-block p-3 rounded-2xl rounded-bl-md bg-gray-100 text-gray-800 shadow-sm">
              <p className="text-sm leading-relaxed">
                {safeString(transcript.agent_transcript)}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">Rumsan AI</p>
          </div>
        </div>
      );
    }

    // Handle generic transcript format
    if (transcript.transcript) {
      return (
        <div key={index} className="flex gap-3">
          <div className="shrink-0 w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center">
            <MessageCircle className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="inline-block p-3 rounded-2xl rounded-bl-md bg-gray-100 text-gray-800 shadow-sm">
              <p className="text-sm leading-relaxed">
                {safeString(transcript.transcript)}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">System Update</p>
          </div>
        </div>
      );
    }

    // Fallback for unknown formats
    return (
      <div key={index} className="flex gap-3">
        <div className="shrink-0 w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center">
          <MessageCircle className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="inline-block p-3 rounded-2xl rounded-bl-md bg-yellow-50 text-gray-800 shadow-sm border border-yellow-200">
            <p className="text-sm leading-relaxed">Unknown transcript format</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">System</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-full flex flex-col max-h-[calc(100vh-100px)] mt-3">
      {/* Main Voice Agent Card */}
      <Card
        className={`bg-linear-to-br from-white via-blue-50/30 to-purple-50/30 border-2 shadow-xl flex flex-col overflow-hidden rounded-xl mx-2 max-h-200 transition-all duration-500 ${
          conversationHistory.length > 0 && callStatus.isConnected
            ? "border-blue-400/60 shadow-blue-500/20 shadow-2xl"
            : "border-blue-100/50 shadow-blue-500/10"
        }`}
      >
        <CardHeader
          className={`text-center ${
            conversationHistory.length > 0 && callStatus.isConnected
              ? "pb-0 py-1"
              : "pb-1 py-2"
          }`}
        >
          {!(conversationHistory.length > 0 && callStatus.isConnected) && (
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="rounded-full bg-linear-to-r from-blue-500 to-purple-600 shadow-lg p-2">
                <Brain className="text-white h-5 w-5" />
              </div>
              <CardTitle className="font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-2xl">
                {title}
              </CardTitle>
            </div>
          )}
          {description &&
            !(conversationHistory.length > 0 && callStatus.isConnected) && (
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-base">
                {description}
              </p>
            )}
        </CardHeader>

        <CardContent
          className={`flex flex-col overflow-hidden flex-1 ${
            conversationHistory.length > 0 && callStatus.isConnected
              ? "space-y-0 py-0 px-2"
              : "space-y-1 py-2 px-6"
          }`}
        >
          {/* Enhanced Status Display */}
          {!(conversationHistory.length > 0 && callStatus.isConnected) && (
            <div className="flex items-center justify-center gap-2 flex-wrap mb-1">
              <Badge
                variant={callStatus.isConnected ? "default" : "secondary"}
                className={`flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-medium transition-all duration-300 ${
                  callStatus.isConnected
                    ? "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/25 animate-pulse"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {callStatus.isConnected ? (
                  <>
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <Phone className="h-4 w-4" />
                    Connected & Active
                  </>
                ) : (
                  <>
                    <PhoneOff className="h-4 w-4" />
                    Ready to Connect
                  </>
                )}
              </Badge>
            </div>
          )}

          {/* Enhanced Error Display */}
          {(callStatus.error || microphoneError) && (
            <div className="p-1.5 bg-linear-to-r from-red-50 to-pink-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-1 text-red-700">
                <div className="w-0.5 h-0.5 bg-red-500 rounded-full"></div>
                <p className="font-medium text-xs">
                  {microphoneError
                    ? `Microphone: ${microphoneError}`
                    : `Error: ${callStatus.error}`}
                </p>
              </div>
            </div>
          )}

          {/* Enhanced Controls */}
          <div
            className={`flex flex-row gap-2 justify-center items-center flex-wrap ${
              conversationHistory.length > 0 && callStatus.isConnected
                ? "justify-end mb-2"
                : ""
            }`}
          >
            {callStatus.isAgentSpeaking &&
              conversationHistory.length > 0 &&
              callStatus.isConnected && (
                <Badge className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/30 mr-3 rounded-full border border-purple-300/30">
                  <div className="relative">
                    <Volume2 className="h-3 w-3 animate-bounce text-white" />
                    <div className="absolute inset-0 h-3 w-3 bg-white/20 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-white">AI Speaking</span>
                </Badge>
              )}
            <Button
              onClick={callStatus.isConnected ? stopCall : handleStartCall}
              disabled={isLoading}
              variant={callStatus.isConnected ? "destructive" : "default"}
              className={`flex items-center gap-1.5 transition-all duration-300 transform hover:scale-105 ${
                conversationHistory.length > 0 && callStatus.isConnected
                  ? "px-3 py-1 text-xs rounded-md shadow-md"
                  : "px-5 py-2 text-sm rounded-lg"
              } ${
                callStatus.isConnected
                  ? "bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 font-medium text-white"
                  : "bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25 text-white font-semibold"
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {callStatus.isConnected ? (
                <>
                  <PhoneOff
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isHovered ? "scale-110" : ""
                    }`}
                  />
                  End Call
                </>
              ) : (
                <>
                  <Phone
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isHovered ? "scale-110" : ""
                    }`}
                  />
                  {isLoading ? "Connecting..." : "Start Call"}
                </>
              )}
            </Button>

            {transcripts.length > 0 &&
              !(conversationHistory.length > 0 && callStatus.isConnected) && (
                <Button
                  onClick={() => {
                    clearTranscripts();
                    setShowInstructions(true);
                    setMicrophoneError(null);
                    setConversationHistory([]);
                    setShowCustomizePanel(false);
                    setIsExpanded(false);
                  }}
                  variant="outline"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-900 bg-white hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 transition-all duration-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear
                </Button>
              )}
          </div>

          {/* Enhanced Transcript Display - Horizontal Layout */}
          <div
            className={`grid lg:grid-cols-3 flex-1 min-h-0 ${
              conversationHistory.length > 0 && callStatus.isConnected
                ? ""
                : "gap-3"
            }`}
          >
            {transcripts.length > 0 ? (
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200/50 shadow-xl lg:col-span-3 flex flex-col min-h-0 flex-1 rounded-xl overflow-hidden">
                <CardHeader className="pb-0 pt-3 px-5 shrink-0 bg-linear-to-r from-blue-50/50 to-purple-50/50 border-b border-blue-100/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-blue-500/10 border border-blue-200/50">
                        <MessageCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <CardTitle className="text-base font-bold text-gray-800">
                        Live Conversation
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200/50">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                      <span className="text-sm text-green-700 font-semibold">
                        Live
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea
                    ref={scrollAreaRef}
                    className="h-full w-full rounded-lg bg-linear-to-b from-gray-50/50 to-white/80 pt-2 px-4 pb-4"
                  >
                    <div className="space-y-4 pr-3 pb-3">
                      {conversationHistory.length > 0 ? (
                        conversationHistory.map((message, index) => (
                          <div
                            key={index}
                            className={`flex gap-3 ${
                              message.role === "user"
                                ? "flex-row-reverse"
                                : "flex-row"
                            }`}
                          >
                            <div
                              className={`shrink-0 rounded-full flex items-center justify-center relative shadow-lg border-2 ${
                                compactMode ? "w-7 h-7" : "w-9 h-9"
                              } ${
                                message.role === "user"
                                  ? "bg-linear-to-br from-blue-500 to-blue-600 text-white border-blue-300/30 shadow-blue-200/50"
                                  : "bg-linear-to-br from-purple-500 via-indigo-600 to-purple-600 text-white border-purple-300/30 shadow-purple-200/50"
                              }`}
                            >
                              {message.role === "user" ? (
                                <User
                                  className={
                                    compactMode ? "h-3 w-3" : "h-4 w-4"
                                  }
                                />
                              ) : (
                                <>
                                  <Bot
                                    className={
                                      compactMode ? "h-3.5 w-3.5" : "h-4 w-4"
                                    }
                                  />
                                  <Sparkles
                                    className={`absolute -top-0.5 -right-0.5 text-yellow-400 drop-shadow-sm ${
                                      compactMode ? "h-2 w-2" : "h-2.5 w-2.5"
                                    }`}
                                  />
                                </>
                              )}
                            </div>
                            <div
                              className={`flex-1 max-w-[85%] ${
                                message.role === "user"
                                  ? "text-right"
                                  : "text-left"
                              }`}
                            >
                              <div
                                className={`inline-block rounded-2xl shadow-lg border transition-all duration-200 hover:shadow-xl ${
                                  compactMode ? "p-3" : "p-4"
                                } ${
                                  message.role === "user"
                                    ? "bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-br-md shadow-blue-200/50 border-blue-300/30"
                                    : "bg-linear-to-r from-white to-gray-50 text-gray-800 rounded-bl-md shadow-gray-200/50 border-gray-200/50"
                                }`}
                              >
                                <p
                                  className={`leading-relaxed ${
                                    fontSize === "sm"
                                      ? "text-sm"
                                      : fontSize === "lg"
                                      ? "text-base"
                                      : "text-sm"
                                  }`}
                                >
                                  {message.content}
                                </p>
                              </div>
                              {showTimestamps && (
                                <div
                                  className={`flex items-center gap-2 mt-2 ${
                                    message.role === "user"
                                      ? "justify-end"
                                      : "justify-start"
                                  }`}
                                >
                                  <p className="text-xs font-medium text-gray-600 bg-gray-100/60 px-2 py-0.5 rounded-full">
                                    {message.role === "user"
                                      ? "You"
                                      : "Rumsan AI"}
                                  </p>
                                  <p className="text-xs text-gray-500 font-mono">
                                    {message.timestamp.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-32 text-gray-500">
                          <div className="text-center p-6 rounded-xl bg-linear-to-br from-gray-50 to-white border-2 border-dashed border-gray-200">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                              <MessageCircle className="h-6 w-6 text-blue-500" />
                            </div>
                            <p className="text-sm font-medium text-gray-600">
                              Start a conversation
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Messages will appear here
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ) : (
              showInstructions &&
              !callStatus.isConnected && (
                <>
                  <Card className="bg-linear-to-r from-blue-50 to-purple-50 border border-blue-100 lg:col-span-2">
                    <CardContent className="p-3">
                      <div className="text-center space-y-2">
                        <div className="flex justify-center">
                          <div className="p-2 rounded-full bg-linear-to-r from-blue-500 to-purple-600 shadow-lg relative">
                            <Bot className="h-5 w-5 text-white" />
                            <Sparkles className="h-1.5 w-1.5 absolute -top-0.5 -right-0.5 text-yellow-300" />
                          </div>
                        </div>
                        <h3 className="text-base font-semibold text-gray-800">
                          Rumsan AI Assistant Ready
                        </h3>
                        <p className="text-xs text-gray-600">
                          Click the start button to begin your voice
                          conversation
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-linear-to-r from-purple-50 to-blue-50 border border-purple-100">
                    <CardContent className="p-3">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        Quick Guide
                      </h4>
                      <div className="space-y-1.5 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full shrink-0"></div>
                          <span>Speak clearly into microphone</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-purple-500 rounded-full shrink-0"></div>
                          <span>AI responds with voice & text</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-green-500 rounded-full shrink-0"></div>
                          <span>View live conversation</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Microphone Permission Modal */}
      {showMicPermissionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md relative bg-white border-slate-200 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-linear-to-r from-blue-500 to-purple-600 shadow-lg">
                  <Mic className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">
                Microphone Access Required
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center space-y-3">
                <p className="text-gray-600 leading-relaxed">
                  To have a voice conversation with our AI assistant, we need
                  access to your microphone.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm font-medium">
                      Your voice data stays private and secure
                    </p>
                  </div>
                </div>
              </div>

              {microphoneError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{microphoneError}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowMicPermissionModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-900 bg-white hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400"
                >
                  Cancel
                </Button>
                <Button
                  onClick={requestMicrophoneAccess}
                  className="flex-1 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                >
                  Allow Microphone
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
