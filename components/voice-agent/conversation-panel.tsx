"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  MessageCircle,
  User,
  Sparkles,
} from "lucide-react";
import { TranscriptUpdate } from "@/hooks/use-retell-voice";
import { ConversationMessage } from "@/hooks/use-voice-agent";
import React from "react";

// Utility to format raw transcript updates (kept from original)
export function formatTranscript(transcript: TranscriptUpdate, index: number) {
  const safeString = (value: any): string => {
    if (typeof value === "string") return value;
    if (value === null || value === undefined) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  // Handle array of messages
  if (Array.isArray(transcript)) {
    return (
      <div key={index} className="space-y-4">
        {transcript.map((msg: any, msgIndex: number) => (
          <div
            key={msgIndex}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
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
                <p className="text-sm leading-relaxed">{safeString(msg.content)}</p>
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
                <p className="text-sm leading-relaxed">{safeString(msg.content)}</p>
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

  // Handle role/content format
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

  // Handle generic transcript string format
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
}

interface Props {
  conversationHistory: ConversationMessage[];
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  compactMode: boolean;
  fontSize: "sm" | "base" | "lg";
  showTimestamps: boolean;
}

export function ConversationPanel({
  conversationHistory,
  scrollAreaRef,
  compactMode,
  fontSize,
  showTimestamps,
}: Props) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200/50 shadow-xl lg:col-span-3 flex flex-col min-h-0 flex-1 rounded-lg sm:rounded-xl overflow-hidden">
      <CardHeader className="pb-0 pt-2 sm:pt-3 px-3 sm:px-5 shrink-0 bg-linear-to-r from-blue-50/50 to-purple-50/50 border-b border-blue-100/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-blue-500/10 border border-blue-200/50">
              <MessageCircle className="h-4 w-4 text-blue-600" />
            </div>
            <CardTitle className="text-sm sm:text-base font-bold text-gray-800">
              Live Conversation
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200/50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="text-sm text-green-700 font-semibold">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea
          ref={scrollAreaRef}
          className="h-full w-full rounded-lg bg-linear-to-b from-gray-50/50 to-white/80 pt-2 px-2 sm:px-4 pb-3 sm:pb-4"
        >
          <div className="space-y-3 sm:space-y-4 pr-1 sm:pr-3 pb-3">
            {conversationHistory.length > 0 ? (
              conversationHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`shrink-0 rounded-full flex items-center justify-center relative shadow-lg border-2 ${
                      compactMode ? "w-6 h-6 sm:w-7 sm:h-7" : "w-7 h-7 sm:w-9 sm:h-9"
                    } ${
                      message.role === "user"
                        ? "bg-linear-to-br from-blue-500 to-blue-600 text-white border-blue-300/30 shadow-blue-200/50"
                        : "bg-linear-to-br from-purple-500 via-indigo-600 to-purple-600 text-white border-purple-300/30 shadow-purple-200/50"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className={compactMode ? "h-3 w-3" : "h-4 w-4"} />
                    ) : (
                      <>
                        <Bot className={compactMode ? "h-3.5 w-3.5" : "h-4 w-4"} />
                        <Sparkles
                          className={`absolute -top-0.5 -right-0.5 text-yellow-400 drop-shadow-sm ${
                            compactMode ? "h-2 w-2" : "h-2.5 w-2.5"
                          }`}
                        />
                      </>
                    )}
                  </div>
                  <div
                    className={`flex-1 max-w-[80%] sm:max-w-[85%] ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block rounded-2xl shadow-lg border transition-all duration-200 hover:shadow-xl ${
                        compactMode ? "p-2 sm:p-3" : "p-2.5 sm:p-4"
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
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <p className="text-xs font-medium text-gray-600 bg-gray-100/60 px-2 py-0.5 rounded-full">
                          {message.role === "user" ? "You" : "Rumsan AI"}
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
  );
}

// ---------------------------------------------------------------------------

export function InstructionsPanel() {
  return (
    <>
      <Card className="bg-linear-to-r from-blue-50 to-purple-50 border border-blue-100 col-span-1 lg:col-span-2">
        <CardContent className="p-3">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="p-2 rounded-full bg-linear-to-r from-blue-500 to-purple-600 shadow-lg relative">
                <Bot className="h-5 w-5 text-white" />
                <Sparkles className="h-1.5 w-1.5 absolute -top-0.5 -right-0.5 text-yellow-300" />
              </div>
            </div>
            <h3 className="text-base font-semibold text-gray-800">Rumsan AI Assistant Ready</h3>
            <p className="text-xs text-gray-600">Click the start button to begin your voice conversation</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-linear-to-r from-purple-50 to-blue-50 border border-purple-100">
        <CardContent className="p-3">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Quick Guide</h4>
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
  );
}
